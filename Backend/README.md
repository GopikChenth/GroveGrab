# GroveGrab Backend

Python Flask backend for GroveGrab - Spotify downloader with SpotDL integration.

## Setup Instructions

### 1. Install Python Dependencies

```powershell
cd Backend
pip install -r requirements.txt
```

### 2. Configure Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Copy your Client ID and Client Secret
4. Add `http://localhost:8888/callback` to your app's Redirect URIs
5. Copy `.env.example` to `.env` and fill in your credentials:

```powershell
Copy-Item .env.example .env
```

Then edit `.env` with your credentials.

### 3. Run the Server

```powershell
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration with Spotify credentials

### URL Validation
- `POST /api/validate-url` - Validate Spotify URL and get metadata

### Downloads
- `POST /api/preload` - Preload metadata for a URL
- `POST /api/download` - Start download
- `GET /api/tasks` - Get all download tasks
- `GET /api/tasks/<task_id>` - Get specific task status
- `POST /api/tasks/<task_id>/retry` - Retry failed tracks
- `POST /api/tasks/<task_id>/cancel` - Cancel running task
- `DELETE /api/tasks/<task_id>` - Delete task
- `GET /api/logs/<task_id>` - Get task logs

## Features

✅ Spotify API integration with your own credentials
✅ SpotDL integration for high-quality downloads
✅ Download progress tracking
✅ Retry failed tracks
✅ Metadata preloading
✅ Concurrent downloads
✅ Detailed logging
✅ Cancellable downloads

## Troubleshooting

### SpotDL not found
Make sure SpotDL is installed:
```powershell
pip install spotdl
```

### FFmpeg not found
SpotDL requires FFmpeg. Install it:
```powershell
# Using chocolatey
choco install ffmpeg

# Or download from: https://ffmpeg.org/download.html
```
