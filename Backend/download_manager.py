"""
Download Manager - Handles SpotDL integration and download queue management
"""
from __future__ import annotations

import json
import logging
import re
import subprocess
import socket
from datetime import datetime
from pathlib import Path
from threading import Lock
from typing import List, Optional


logger = logging.getLogger(__name__)


def check_internet_connection():
    """Check if internet connection is available"""
    try:
        # Try to connect to Google's DNS
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return True
    except OSError:
        return False


class DownloadManager:
    def __init__(self):
        self.tasks = {}  # task_id -> task_data (JSON-serializable)
        self.tasks_lock = Lock()
        self.processes = {}  # task_id -> subprocess.Popen

        self.config_file = Path('config.json')
        self.logs_dir = Path('logs')
        self.logs_dir.mkdir(exist_ok=True)

        self.config = self._load_config()

    # ---------------------------- Config ---------------------------- #
    def _load_config(self) -> dict:
        if self.config_file.exists():
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load config: {e}")

        default_config = {
            'client_id': '',
            'client_secret': '',
            'redirect_uri': 'http://localhost:8888/callback',
            'default_download_path': str(Path.home() / 'Downloads' / 'GroveGrab'),
            'audio_format': 'mp3',
            'audio_quality': '320k',
            'has_credentials': False,
        }
        self._save_config(default_config)
        return default_config

    def _save_config(self, config: dict):
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save config: {e}")

    def get_config(self) -> dict:
        return self.config.copy()

    def update_config(
        self,
        client_id: str | None = None,
        client_secret: str | None = None,
        redirect_uri: str | None = None,
        download_path: str | None = None,
        audio_format: str | None = None,
        audio_quality: str | None = None,
    ) -> bool:
        try:
            if client_id is not None:
                self.config['client_id'] = client_id
            if client_secret is not None:
                self.config['client_secret'] = client_secret
            if redirect_uri is not None:
                self.config['redirect_uri'] = redirect_uri
            if download_path is not None:
                self.config['default_download_path'] = download_path
            if audio_format is not None:
                self.config['audio_format'] = audio_format
            if audio_quality is not None:
                self.config['audio_quality'] = audio_quality

            self.config['has_credentials'] = bool(
                self.config.get('client_id') and self.config.get('client_secret')
            )

            self._save_config(self.config)
            return True
        except Exception as e:
            logger.error(f"Failed to update config: {e}")
            return False

    # ---------------------------- Validation ---------------------------- #
    def validate_url(self, url: str) -> dict:
        patterns = {
            'track': r'spotify\.com/track/([a-zA-Z0-9]+)',
            'playlist': r'spotify\.com/playlist/([a-zA-Z0-9]+)',
            'album': r'spotify\.com/album/([a-zA-Z0-9]+)',
            'artist': r'spotify\.com/artist/([a-zA-Z0-9]+)',
        }
        for url_type, pattern in patterns.items():
            m = re.search(pattern, url)
            if m:
                return {'valid': True, 'type': url_type, 'id': m.group(1), 'url': url}
        return {
            'valid': False,
            'error': 'Invalid Spotify URL. Please provide a valid track, playlist, album, or artist URL.',
        }

    # ---------------------------- Tasks ---------------------------- #
    def preload_metadata(self, task_id: str, url: str):
        with self.tasks_lock:
            self.tasks[task_id] = {
                'id': task_id,
                'url': url,
                'type': 'preload',
                'status': 'running',
                'progress': 0,
                'total_tracks': 0,
                'completed_tracks': 0,
                'failed_tracks': 0,
                'current_track': '',
                'logs': [],
                'tracks': [],
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
            }

        try:
            self._log(task_id, f"Starting metadata preload for: {url}")
            cmd = self._build_spotdl_command(url, preload_only=True)
            result = self._execute_spotdl(task_id, cmd)

            with self.tasks_lock:
                if result['success']:
                    self.tasks[task_id]['status'] = 'completed'
                    self.tasks[task_id]['progress'] = 100
                else:
                    self.tasks[task_id]['status'] = 'failed'
                self.tasks[task_id]['updated_at'] = datetime.now().isoformat()

            self._log(
                task_id,
                'Metadata preload completed' if result['success'] else f"Preload failed: {result.get('error', 'Unknown error')}",
            )
        except Exception as e:
            logger.error(f"Preload error for task {task_id}: {e}")
            with self.tasks_lock:
                self.tasks[task_id]['status'] = 'failed'
                self.tasks[task_id]['updated_at'] = datetime.now().isoformat()
            self._log(task_id, f"Error: {str(e)}")

    def start_download(self, task_id: str, url: str, download_path: str | None = None):
        # Check internet connection first
        if not check_internet_connection():
            with self.tasks_lock:
                self.tasks[task_id] = {
                    'id': task_id,
                    'url': url,
                    'type': 'download',
                    'status': 'failed',
                    'progress': 0,
                    'total_tracks': 0,
                    'completed_tracks': 0,
                    'failed_tracks': 0,
                    'current_track': '',
                    'tracks': [],
                    'download_path': download_path or self.config.get('default_download_path'),
                    'logs': ['❌ No internet connection detected. Please check your network and try again.'],
                    'failed_track_list': [],
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat(),
                    'cancelled': False,
                }
            logger.error(f"Task {task_id}: No internet connection")
            return

        if not download_path:
            download_path = self.config.get('default_download_path')
        Path(download_path).mkdir(parents=True, exist_ok=True)

        with self.tasks_lock:
            self.tasks[task_id] = {
                'id': task_id,
                'url': url,
                'type': 'download',
                'status': 'running',
                'progress': 0,
                'total_tracks': 0,
                'completed_tracks': 0,
                'failed_tracks': 0,
                'current_track': '',
                'tracks': [],  # [{ title, status, progress }]
                'download_path': download_path,
                'logs': [],
                'failed_track_list': [],
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat(),
                'cancelled': False,
            }

        try:
            self._log(task_id, f"Starting download for: {url}")
            self._log(task_id, f"Download path: {download_path}")

            cmd = self._build_spotdl_command(url, download_path=download_path)
            result = self._execute_spotdl(task_id, cmd)

            # Decide final status without logging under the lock
            with self.tasks_lock:
                if self.tasks[task_id].get('cancelled'):
                    self.tasks[task_id]['status'] = 'cancelled'
                    final_msg = 'Download cancelled by user'
                elif result['success']:
                    self.tasks[task_id]['status'] = 'completed'
                    self.tasks[task_id]['progress'] = 100
                    final_msg = 'Download completed successfully!'
                else:
                    self.tasks[task_id]['status'] = 'failed'
                    final_msg = f"Download failed: {result.get('error', 'Unknown error')}"
                self.tasks[task_id]['updated_at'] = datetime.now().isoformat()

            self._log(task_id, final_msg)
        except Exception as e:
            logger.error(f"Download error for task {task_id}: {e}")
            with self.tasks_lock:
                self.tasks[task_id]['status'] = 'failed'
                self.tasks[task_id]['updated_at'] = datetime.now().isoformat()
            self._log(task_id, f"Error: {str(e)}")

    # ---------------------------- SpotDL ---------------------------- #
    def _build_spotdl_command(
        self, url: str, download_path: str | None = None, preload_only: bool = False
    ) -> List[str]:
        cmd = ['spotdl']
        cmd.append(url)

        if self.config.get('client_id') and self.config.get('client_secret'):
            cmd.extend(['--client-id', self.config['client_id'], '--client-secret', self.config['client_secret']])

        if preload_only:
            cmd.append('--preload')
        else:
            if download_path:
                cmd.extend(['--output', download_path])

            audio_format = self.config.get('audio_format', 'mp3')
            cmd.extend(['--format', audio_format])

            if audio_format == 'mp3':
                quality = self.config.get('audio_quality', '320k')
                cmd.extend(['--bitrate', quality])

            # Skip already-downloaded songs if files exist
            cmd.extend(['--overwrite', 'skip'])

        return cmd

    def _execute_spotdl(self, task_id: str, cmd: List[str]) -> dict:
        try:
            self._log(task_id, f"Executing: {' '.join(cmd[:2])}...")  # Avoid logging credentials

            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True,
            )
            with self.tasks_lock:
                self.processes[task_id] = process

            dns_error_count = 0
            for line in iter(process.stdout.readline, ''):
                if not line:
                    break
                line = line.strip()
                if not line:
                    continue

                # Check for DNS/network errors
                if 'getaddrinfo failed' in line or 'Failed to resolve' in line:
                    dns_error_count += 1
                    if dns_error_count == 1:  # Log only once
                        self._log(task_id, '⚠️ Network/DNS error detected. Retrying...')
                    continue

                if 'ConnectionResetError' in line or 'Connection broken' in line:
                    self._log(task_id, '⚠️ Connection issue detected. SpotDL will retry automatically...')
                    continue

                # Check cancellation quickly
                with self.tasks_lock:
                    if self.tasks.get(task_id, {}).get('cancelled'):
                        try:
                            process.terminate()
                        except Exception:
                            pass
                        return {'success': False, 'error': 'Cancelled by user'}

                self._log(task_id, line)
                self._parse_progress(task_id, line)

            process.wait()
            
            # Check if download failed due to network issues
            if dns_error_count > 10:
                self._log(task_id, '❌ Download failed: Network/DNS resolution errors. Please check your internet connection.')
                return {'success': False, 'error': 'Network connectivity issues - DNS resolution failed'}
            
            if process.returncode == 0:
                return {'success': True}
            return {'success': False, 'error': f'Process exited with code {process.returncode}'}
        except Exception as e:
            logger.error(f"SpotDL execution error: {e}")
            error_msg = str(e)
            if 'getaddrinfo failed' in error_msg:
                error_msg = 'Network error: Cannot resolve Spotify/YouTube domains. Check your internet connection.'
            return {'success': False, 'error': error_msg}
        finally:
            with self.tasks_lock:
                self.processes.pop(task_id, None)

    # ---------------------------- Parsing ---------------------------- #
    def _parse_progress(self, task_id: str, line: str):
        with self.tasks_lock:
            task = self.tasks.get(task_id)
            if not task:
                return

            # Infer total tracks
            m_total = re.search(r"Found\s+(\d+)\s+(songs?|tracks?)", line, re.IGNORECASE)
            if m_total:
                try:
                    task['total_tracks'] = int(m_total.group(1))
                except Exception:
                    pass

            # Extract title
            title = None
            m_title_quoted = re.search(r'"([^"\n]+)"', line)
            if m_title_quoted:
                title = m_title_quoted.group(1)
            else:
                m_processing = re.search(r"(?:Downloading|Processing)[:\s]+(.+)$", line, re.IGNORECASE)
                if m_processing:
                    title = m_processing.group(1).strip()

            # Ensure a track entry exists
            def ensure_track(t_title: str):
                if not t_title:
                    return None
                for t in task['tracks']:
                    if t.get('title') == t_title:
                        return t
                t = {'title': t_title, 'status': 'queued', 'progress': 0}
                task['tracks'].append(t)
                return t

            percent = None
            m_pct = re.search(r"(\d{1,3})%", line)
            if m_pct:
                try:
                    percent = max(0, min(100, int(m_pct.group(1))))
                except Exception:
                    percent = None

            lowered = line.lower()

            if ('downloading' in lowered or 'processing' in lowered) and title:
                task['current_track'] = title
                t = ensure_track(title)
                if t:
                    t['status'] = 'downloading'
                    if percent is not None:
                        t['progress'] = percent

            if 'downloaded' in lowered or 'completed' in lowered:
                t = ensure_track(title or task.get('current_track'))
                if t and t['status'] != 'completed':
                    t['status'] = 'completed'
                    t['progress'] = 100
                    task['completed_tracks'] = (task.get('completed_tracks') or 0) + 1

            if 'failed' in lowered or 'error' in lowered:
                t = ensure_track(title or task.get('current_track'))
                if t and t['status'] != 'failed':
                    t['status'] = 'failed'
                    if percent is None:
                        t['progress'] = 0
                    task['failed_tracks'] = (task.get('failed_tracks') or 0) + 1
                    task['failed_track_list'].append(line)

            total = task.get('total_tracks') or 0
            completed = task.get('completed_tracks') or 0
            if total > 0:
                task['progress'] = int((completed / total) * 100)

            task['updated_at'] = datetime.now().isoformat()

    # ---------------------------- Logging ---------------------------- #
    def _log(self, task_id: str, message: str):
        timestamp = datetime.now().strftime('%H:%M:%S')
        entry = f"[{timestamp}] {message}"
        with self.tasks_lock:
            if task_id in self.tasks:
                self.tasks[task_id].setdefault('logs', []).append(entry)
        logger.info(f"Task {task_id}: {message}")

    # ---------------------------- Public API ---------------------------- #
    def get_all_tasks(self) -> List[dict]:
        with self.tasks_lock:
            return list(self.tasks.values())

    def get_task(self, task_id: str) -> Optional[dict]:
        with self.tasks_lock:
            return self.tasks.get(task_id)

    def get_task_logs(self, task_id: str) -> Optional[List[str]]:
        with self.tasks_lock:
            task = self.tasks.get(task_id)
            return task['logs'] if task else None

    def cancel_task(self, task_id: str) -> bool:
        proc = None
        with self.tasks_lock:
            task = self.tasks.get(task_id)
            if not task or task['status'] != 'running':
                return False
            task['cancelled'] = True
            task['status'] = 'cancelled'
            task['updated_at'] = datetime.now().isoformat()
            for t in task.get('tracks', []):
                if t.get('status') in ('downloading', 'queued'):
                    t['status'] = 'cancelled'
            task['current_track'] = ''
            proc = self.processes.get(task_id)

        # terminate outside lock
        try:
            if proc and proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=2)
                except Exception:
                    if proc.poll() is None:
                        proc.kill()
        except Exception:
            pass

        self._log(task_id, 'Stop requested by user')
        return True

    def delete_task(self, task_id: str) -> bool:
        with self.tasks_lock:
            task = self.tasks.get(task_id)
            if not task:
                return False
            proc = self.processes.pop(task_id, None)
        try:
            if proc and proc.poll() is None:
                proc.terminate()
        except Exception:
            pass
        with self.tasks_lock:
            self.tasks.pop(task_id, None)
        return True

    def retry_failed(self, task_id: str) -> bool:
        with self.tasks_lock:
            task = self.tasks.get(task_id)
            if not task or task['status'] != 'failed':
                return False
            # Reset and restart
            task['failed_tracks'] = 0
            task['failed_track_list'] = []
            task['status'] = 'running'
            task['updated_at'] = datetime.now().isoformat()

        import threading

        thread = threading.Thread(
            target=self.start_download, args=(task_id, task['url'], task.get('download_path'))
        )
        thread.daemon = True
        thread.start()
        return True

