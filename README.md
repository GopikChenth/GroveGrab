# 🎵 GroveGrab - Spotify Downloader

A complete desktop application for downloading Spotify songs and playlists using SpotDL with your own Spotify API credentials.

## ✨ Features

- ✅ **Your Own API Credentials** - Use your Spotify Client ID and Secret to avoid rate limits
- ✅ **Download Everything** - Supports tracks, playlists, albums, and artists
- ✅ **High Quality Audio** - Download in MP3 (up to 320kbps), FLAC, OGG, OPUS, or M4A
- ✅ **Progress Tracking** - Real-time progress bars and download status
- ✅ **Retry Failed Tracks** - Automatically retry failed downloads
- ✅ **Metadata Preloading** - Preview track information before downloading
- ✅ **Modern UI** - Clean, responsive interface with dark mode support
- ✅ **Detailed Logs** - View detailed logs for each download task
- ✅ **Queue Management** - Manage multiple downloads simultaneously

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download Node.js](https://nodejs.org/)
3. **FFmpeg** - Required by SpotDL
   - Windows (Chocolatey): `choco install ffmpeg`
   - Or download from [FFmpeg.org](https://ffmpeg.org/download.html)
4. **Spotify API Credentials**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create an app (or use existing)
   - Copy your Client ID and Client Secret
   - Add `http://localhost:8888/callback` to Redirect URIs

## 🚀 Quick Start

### Step 1: Setup Backend

```powershell
# Run the backend setup script
.\setup-backend.ps1
```

This will:
- Install Python dependencies
- Create a virtual environment (optional)
- Set up configuration files
- Check for FFmpeg

### Step 2: Configure Spotify Credentials

Edit `Backend\.env` and add your Spotify API credentials:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
```

### Step 3: Setup Frontend

```powershell
# Run the frontend setup script
.\setup-frontend.ps1
```

This will:
- Install npm dependencies
- Create environment configuration

### Step 4: Start the Application

```powershell
# Start both backend and frontend servers
.\start-dev.ps1
```

Or start them manually:

```powershell
# Terminal 1 - Backend
cd Backend
python app.py

# Terminal 2 - Frontend
cd Client
npm run dev
```

### Step 5: Use the Application

1. Open your browser to `http://localhost:5173`
2. Click the settings icon (⚙️) to configure your Spotify credentials
3. Paste a Spotify URL (playlist, album, track, or artist)
4. Click "Start Download"
5. Watch the progress in real-time!

## 📦 Project Structure

```
GroveGrab/
├── Backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── download_manager.py # SpotDL integration & download logic
│   ├── requirements.txt    # Python dependencies
│   ├── .env                # Configuration (create from .env.example)
│   └── README.md           # Backend documentation
│
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ConfigModal.jsx       # Settings modal
│   │   │   ├── DownloadCard.jsx      # Download input form
│   │   │   ├── TaskItem.jsx          # Task display component
│   │   │   ├── LogsModal.jsx         # Logs viewer
│   │   │   └── Navbar.jsx            # Navigation bar
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   ├── hooks/
│   │   │   └── useTaskPolling.js   # Task polling hook
│   │   └── App.jsx                 # Main app component
│   ├── package.json
│   └── README.md
│
├── setup-backend.ps1       # Backend setup script
├── setup-frontend.ps1      # Frontend setup script
├── start-dev.ps1           # Start both servers
└── README.md               # This file
```

## 🔧 Configuration Options

### Audio Settings

In the Settings modal, you can configure:

- **Audio Format**: MP3, FLAC, OGG, OPUS, M4A
- **Audio Quality**: 128kbps, 192kbps, 256kbps, 320kbps (MP3 only)
- **Download Path**: Default folder for downloads

### Environment Variables

**Backend** (`Backend/.env`):
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
DEFAULT_DOWNLOAD_PATH=Downloads/GroveGrab
AUDIO_FORMAT=mp3
AUDIO_QUALITY=320k
```

**Frontend** (`Client/.env`):
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Usage Examples

### Download a Single Track
```
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
```

### Download a Playlist
```
https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

### Download an Album
```
https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy
```

### Download Artist's Top Tracks
```
https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4
```

## 🐛 Troubleshooting

### Backend won't start
- Check if Python is installed: `python --version`
- Install dependencies: `pip install -r Backend/requirements.txt`
- Check if port 5000 is available

### FFmpeg not found
```powershell
# Windows (with Chocolatey)
choco install ffmpeg

# Or download manually from https://ffmpeg.org/download.html
```

### SpotDL errors
- Verify your Spotify credentials are correct
- Check internet connection
- Make sure FFmpeg is installed and in PATH
- Try updating SpotDL: `pip install --upgrade spotdl`

### Downloads fail or are slow
- Check your internet connection
- Verify Spotify credentials
- Some tracks may not be available on YouTube (SpotDL's source)
- Try downloading individual tracks first

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check `Client/.env` has correct API URL
- Check firewall/antivirus settings

## 📝 API Endpoints

### Configuration
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

### Downloads
- `POST /api/validate-url` - Validate Spotify URL
- `POST /api/preload` - Preload metadata
- `POST /api/download` - Start download
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task status
- `POST /api/tasks/:id/retry` - Retry failed tracks
- `POST /api/tasks/:id/cancel` - Cancel task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/logs/:id` - Get task logs

## 🔐 Security Notes

- ⚠️ **Never commit your `.env` files** - They contain sensitive credentials
- ⚠️ **Keep your Spotify credentials private**
- ⚠️ **Don't share your API keys publicly**
- The application stores credentials locally only

## 📦 Desktop App Packaging (Coming Soon)

To create a standalone desktop application:

```powershell
# Install Electron Builder
cd Client
npm install --save-dev electron electron-builder

# Build the app
npm run electron:build
```

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

## ⚖️ Legal Notice

This tool is for personal use only. Make sure you comply with:
- Spotify's Terms of Service
- YouTube's Terms of Service (SpotDL uses YouTube as audio source)
- Copyright laws in your jurisdiction

## 🙏 Credits

- **SpotDL** - [https://github.com/spotDL/spotify-downloader](https://github.com/spotDL/spotify-downloader)
- **Flask** - Backend framework
- **React** - Frontend framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling

## 📄 License

MIT License - Feel free to use for personal projects

---

**Made with ❤️ for music lovers**

If you enjoy this project, consider:
- ⭐ Starring this repository
- 🎵 Supporting the artists whose music you download
- 🔗 Checking out SpotDL and supporting their development
