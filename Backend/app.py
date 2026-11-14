import logging
import os
import sys
import threading
import uuid
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from download_manager import DownloadManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if getattr(sys, 'frozen', False):
    FRONTEND_DIR = Path(sys._MEIPASS) / 'frontend'
else:
    FRONTEND_DIR = Path(__file__).resolve().parent.parent / 'Client' / 'dist'

app = Flask(__name__, static_folder=str(FRONTEND_DIR) if FRONTEND_DIR.exists() else None)
CORS(app)

download_manager = DownloadManager()


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/config', methods=['GET', 'POST'])
def handle_config():
    if request.method == 'GET':
        config = download_manager.get_config()
        return jsonify({
            'has_credentials': config.get('has_credentials', False),
            'client_id': config.get('client_id', ''),
            'redirect_uri': config.get('redirect_uri', 'http://localhost:8888/callback'),
            'default_download_path': config.get('default_download_path', ''),
            'audio_format': config.get('audio_format', 'mp3'),
            'audio_quality': config.get('audio_quality', '320k')
        })

    data = request.json or {}
    success = download_manager.update_config(
        client_id=data.get('client_id'),
        client_secret=data.get('client_secret'),
        redirect_uri=data.get('redirect_uri'),
        download_path=data.get('download_path') or data.get('default_download_path'),
        audio_format=data.get('audio_format'),
        audio_quality=data.get('audio_quality')
    )

    if success:
        return jsonify({'message': 'Configuration updated successfully'})
    return jsonify({'error': 'Failed to update configuration'}), 500


@app.route('/api/download', methods=['POST'])
def start_download():
    data = request.json or {}
    url = data.get('url', '').strip()
    download_path = data.get('download_path')

    if not url:
        return jsonify({'error': 'URL is required'}), 400

    task_id = str(uuid.uuid4())
    thread = threading.Thread(
        target=download_manager.start_download,
        args=(task_id, url, download_path)
    )
    thread.daemon = True
    thread.start()

    return jsonify({'task_id': task_id, 'status': 'started'})


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify(download_manager.get_all_tasks())


@app.route('/api/tasks/<task_id>/retry', methods=['POST'])
def retry_failed(task_id):
    task_info = download_manager.reset_for_retry(task_id)
    if task_info:
        thread = threading.Thread(
            target=download_manager.start_download,
            args=(task_id, task_info['url'], task_info.get('download_path'))
        )
        thread.daemon = True
        thread.start()
        return jsonify({'message': 'Retry started'})
    return jsonify({'error': 'Failed to retry or task not found'}), 400


@app.route('/api/tasks/<task_id>/cancel', methods=['POST'])
def cancel_task(task_id):
    success = download_manager.cancel_task(task_id)
    if success:
        return jsonify({'message': 'Task cancelled'})
    return jsonify({'error': 'Failed to cancel or task not found'}), 400


@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    success = download_manager.delete_task(task_id)
    if success:
        return jsonify({'message': 'Task deleted'})
    return jsonify({'error': 'Task not found'}), 404


@app.route('/api/logs/<task_id>', methods=['GET'])
@app.route('/api/tasks/<task_id>/logs', methods=['GET'])
def get_logs(task_id):
    logs = download_manager.get_task_logs(task_id)
    if logs is not None:
        return jsonify({'logs': logs})
    return jsonify({'error': 'Task not found'}), 404


if FRONTEND_DIR.exists():
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path and (FRONTEND_DIR / path).exists():
            return send_from_directory(FRONTEND_DIR, path)
        return send_from_directory(FRONTEND_DIR, 'index.html')


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # Bind to localhost by default so the unauthenticated config/download API
    # is not exposed to the network; opt-in via HOST env var if needed.
    host = os.environ.get('HOST', '127.0.0.1')
    app.run(host=host, port=port, debug=False, threaded=True)
