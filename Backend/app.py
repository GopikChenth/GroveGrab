"""
GroveGrab - Spotify Downloader Backend
Flask server with SpotDL integration
"""
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import json
import threading
import uuid
from pathlib import Path
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Import download manager after app initialization
from download_manager import DownloadManager

# Initialize download manager
download_manager = DownloadManager()

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
            redirect_uri=data.get('redirect_uri', 'http://localhost:8888/callback'),
            download_path=data.get('download_path'),
            audio_format=data.get('audio_format', 'mp3'),
            audio_quality=data.get('audio_quality', '320k')
        )
        
        if success:
            return jsonify({'message': 'Configuration updated successfully'})
        else:
            return jsonify({'error': 'Failed to update configuration'}), 500

@app.route('/api/validate-url', methods=['POST'])
def validate_url():
    """Validate Spotify URL and get metadata"""
    data = request.json
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    result = download_manager.validate_url(url)
    
    if result.get('valid'):
        return jsonify(result)
    else:
        return jsonify({'error': result.get('error', 'Invalid URL')}), 400

@app.route('/api/preload', methods=['POST'])
def preload_metadata():
    """Preload metadata for a Spotify URL"""
    data = request.json
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    task_id = str(uuid.uuid4())
    
    # Start preload in background thread
    thread = threading.Thread(
        target=download_manager.preload_metadata,
        args=(task_id, url)
    )
    thread.daemon = True
    thread.start()
    
    return jsonify({'task_id': task_id, 'status': 'started'})

@app.route('/api/download', methods=['POST'])
def start_download():
    """Start downloading from Spotify URL"""
    data = request.json
    url = data.get('url', '').strip()
    download_path = data.get('download_path')
    
    if not url:
        return jsonify({'error': 'URL is required'}), 400
    
    task_id = str(uuid.uuid4())
    
    # Start download in background thread
    thread = threading.Thread(
        target=download_manager.start_download,
        args=(task_id, url, download_path)
    )
    thread.daemon = True
    thread.start()
    
    return jsonify({'task_id': task_id, 'status': 'started'})

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """Get all download tasks"""
    tasks = download_manager.get_all_tasks()
    return jsonify(tasks)

@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    """Get specific task status"""
    task = download_manager.get_task(task_id)
    
    if task:
        return jsonify(task)
    else:
        return jsonify({'error': 'Task not found'}), 404

@app.route('/api/tasks/<task_id>/retry', methods=['POST'])
def retry_failed(task_id):
    """Retry failed tracks in a task"""
    success = download_manager.retry_failed(task_id)
    
    if success:
        return jsonify({'message': 'Retry started'})
    else:
        return jsonify({'error': 'Failed to retry or task not found'}), 400

@app.route('/api/tasks/<task_id>/cancel', methods=['POST'])
def cancel_task(task_id):
    """Cancel a running task"""
    success = download_manager.cancel_task(task_id)
    
    if success:
        return jsonify({'message': 'Task cancelled'})
    else:
        return jsonify({'error': 'Failed to cancel or task not found'}), 400

@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Delete a task"""
    success = download_manager.delete_task(task_id)
    
    if success:
        return jsonify({'message': 'Task deleted'})
    else:
        return jsonify({'error': 'Task not found'}), 404

@app.route('/api/logs/<task_id>', methods=['GET'])
def get_logs(task_id):
    """Get logs for a specific task"""
    logs = download_manager.get_task_logs(task_id)
    
    if logs is not None:
        return jsonify({'logs': logs})
    else:
        return jsonify({'error': 'Task not found'}), 404

if __name__ == '__main__':
    print("=" * 60)
    print("GroveGrab Backend Server")
    print("=" * 60)
    print(f"Server starting on http://localhost:5000")
    print("Press CTRL+C to stop")
    print("=" * 60)
    
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)
