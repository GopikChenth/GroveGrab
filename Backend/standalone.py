"""
GroveGrab Standalone Application
Combines Flask backend with embedded frontend in a single executable
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import sys
import json
import threading
import uuid
import webbrowser
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Determine if running as PyInstaller bundle
if getattr(sys, 'frozen', False):
    # Running as compiled executable
    BASE_DIR = Path(sys._MEIPASS)
    FRONTEND_DIR = BASE_DIR / 'frontend'
else:
    # Running as script
    BASE_DIR = Path(__file__).parent
    FRONTEND_DIR = BASE_DIR.parent / 'Client' / 'dist'

print(f"Base directory: {BASE_DIR}")
print(f"Frontend directory: {FRONTEND_DIR}")

app = Flask(__name__, static_folder=str(FRONTEND_DIR))
CORS(app)

# Import download manager
try:
    from download_manager import DownloadManager
    download_manager = DownloadManager()
except ImportError as e:
    logger.error(f"Failed to import DownloadManager: {e}")
    download_manager = None

# ============================================================================
# API Routes
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/config', methods=['GET', 'POST'])
def handle_config():
    """Get or update Spotify API configuration"""
    if not download_manager:
        return jsonify({'error': 'Download manager not initialized'}), 500
    
    if request.method == 'GET':
        config = download_manager.get_config()
        return jsonify({
            'has_credentials': config.get('has_credentials', False),
            'default_download_path': config.get('default_download_path', ''),
            'audio_format': config.get('audio_format', 'mp3'),
            'audio_quality': config.get('audio_quality', '320k')
        })
    
    elif request.method == 'POST':
        data = request.json
        success = download_manager.update_config(
            client_id=data.get('client_id'),
            client_secret=data.get('client_secret'),
            default_download_path=data.get('default_download_path'),
            audio_format=data.get('audio_format'),
            audio_quality=data.get('audio_quality')
        )
        
        if success:
            return jsonify({'message': 'Configuration updated successfully'})
        else:
            return jsonify({'error': 'Failed to update configuration'}), 500

@app.route('/api/download', methods=['POST'])
def start_download():
    """Start a new download task"""
    if not download_manager:
        return jsonify({'error': 'Download manager not initialized'}), 500
    
    data = request.json
    url = data.get('url')
    download_path = data.get('download_path')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    try:
        task_id = download_manager.start_download(url, download_path)
        return jsonify({
            'task_id': task_id,
            'message': 'Download started'
        })
    except Exception as e:
        logger.error(f"Download error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all download tasks"""
    if not download_manager:
        return jsonify([]), 500
    
    tasks = download_manager.get_all_tasks()
    return jsonify(tasks)

@app.route('/api/tasks/<task_id>', methods=['GET', 'DELETE'])
def handle_task(task_id):
    """Get or delete a specific task"""
    if not download_manager:
        return jsonify({'error': 'Download manager not initialized'}), 500
    
    if request.method == 'GET':
        task = download_manager.get_task(task_id)
        if task:
            return jsonify(task)
        else:
            return jsonify({'error': 'Task not found'}), 404
    
    elif request.method == 'DELETE':
        success = download_manager.delete_task(task_id)
        if success:
            return jsonify({'message': 'Task deleted'})
        else:
            return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<task_id>/cancel', methods=['POST'])
def cancel_task(task_id):
    """Cancel a running task"""
    if not download_manager:
        return jsonify({'error': 'Download manager not initialized'}), 500
    
    success = download_manager.cancel_task(task_id)
    if success:
        return jsonify({'message': 'Task cancelled'})
    else:
        return jsonify({'error': 'Failed to cancel task'}), 400

@app.route('/api/tasks/<task_id>/retry', methods=['POST'])
def retry_task(task_id):
    """Retry a failed task"""
    if not download_manager:
        return jsonify({'error': 'Download manager not initialized'}), 500
    
    new_task_id = download_manager.retry_task(task_id)
    if new_task_id:
        return jsonify({
            'task_id': new_task_id,
            'message': 'Task retried'
        })
    else:
        return jsonify({'error': 'Failed to retry task'}), 400

@app.route('/api/tasks/<task_id>/logs', methods=['GET'])
def get_logs(task_id):
    """Get logs for a specific task"""
    if not download_manager:
        return jsonify({'error': 'Download manager not initialized'}), 500
    
    logs = download_manager.get_task_logs(task_id)
    
    if logs is not None:
        return jsonify({'logs': logs})
    else:
        return jsonify({'error': 'Task not found'}), 404

# ============================================================================
# Frontend Routes
# ============================================================================

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Serve frontend files"""
    if path and (FRONTEND_DIR / path).exists():
        return send_from_directory(FRONTEND_DIR, path)
    else:
        return send_from_directory(FRONTEND_DIR, 'index.html')

# ============================================================================
# Main Entry Point
# ============================================================================

def open_browser():
    """Open browser after a short delay"""
    import time
    time.sleep(1.5)
    webbrowser.open('http://localhost:5000')

if __name__ == '__main__':
    print("=" * 60)
    print("GroveGrab - Spotify Downloader")
    print("=" * 60)
    print(f"Server starting on http://localhost:5000")
    print("Opening browser...")
    print("Press CTRL+C to stop")
    print("=" * 60)
    
    # Open browser in separate thread
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Start Flask server
    app.run(host='127.0.0.1', port=5000, debug=False, threaded=True)
