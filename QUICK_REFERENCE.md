# 🚀 GroveGrab - Quick Reference

## 🎯 Quick Start Commands

### First Time Setup
```powershell
# 1. Setup backend
.\setup-backend.ps1

# 2. Configure credentials
# Edit Backend\.env with your Spotify API credentials

# 3. Setup frontend
.\setup-frontend.ps1

# 4. Start application
.\start-dev.ps1
```

### Daily Use
```powershell
# Start both servers
.\start-dev.ps1

# Or manually:
# Terminal 1: cd Backend && python app.py
# Terminal 2: cd Client && npm run dev
```

---

## 🔑 Spotify API Setup

1. Go to [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create app → Get Client ID & Secret
3. Add redirect URI: `http://localhost:8888/callback`
4. Edit `Backend\.env` with your credentials

---

## 📥 Download Examples

### Single Track
```
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
```

### Playlist
```
https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
```

### Album
```
https://open.spotify.com/album/4aawyAB9vmqN3uQ7FjRGTy
```

### Artist
```
https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4
```

---

## 🔧 Configuration Files

### Backend Config (`Backend\.env`)
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
DEFAULT_DOWNLOAD_PATH=Downloads/GroveGrab
AUDIO_FORMAT=mp3
AUDIO_QUALITY=320k
```

### Frontend Config (`Client\.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🎵 Audio Format Options

| Format | Quality | File Size | Use Case |
|--------|---------|-----------|----------|
| MP3 | 128k-320k | Small-Medium | General use |
| FLAC | Lossless | Large | Audiophiles |
| OGG | Variable | Small-Medium | Open source |
| OPUS | Variable | Small | Modern codec |
| M4A | AAC | Medium | Apple devices |

---

## 🌐 URLs & Ports

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | Web interface |
| Backend | http://localhost:5000 | API server |
| Health Check | http://localhost:5000/health | Server status |

---

## 🛠️ Common Commands

### Backend
```powershell
cd Backend

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py

# Update SpotDL
pip install --upgrade spotdl
```

### Frontend
```powershell
cd Client

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Build desktop app
npm run electron:build
```

---

## 🐛 Quick Troubleshooting

### Backend won't start
```powershell
# Check Python
python --version

# Reinstall dependencies
pip install -r requirements.txt

# Check FFmpeg
ffmpeg -version
```

### Frontend can't connect
```powershell
# Verify backend is running
curl http://localhost:5000/health

# Check .env file
cat Client\.env
```

### Download fails
- Verify Spotify credentials
- Check internet connection
- Install/update FFmpeg
- Try a different track

---

## 📦 Desktop App Build

```powershell
cd Client

# Install Electron deps (first time only)
npm install --save-dev electron electron-builder concurrently wait-on

# Build app
npm run electron:build

# Find installer in:
# Client\dist-electron\
```

---

## 🔒 Security Reminders

- ✅ Never commit `.env` files
- ✅ Keep API credentials private
- ✅ Don't share Client Secret
- ✅ Use `.gitignore` properly

---

## 📚 Useful Links

- **Spotify Developer Dashboard**: https://developer.spotify.com/dashboard
- **SpotDL GitHub**: https://github.com/spotDL/spotify-downloader
- **FFmpeg Download**: https://ffmpeg.org/download.html
- **Python Download**: https://www.python.org/downloads/
- **Node.js Download**: https://nodejs.org/

---

## 🎯 Features Checklist

- ✅ Download tracks, playlists, albums, artists
- ✅ Real-time progress tracking
- ✅ Retry failed downloads
- ✅ View detailed logs
- ✅ Cancel running downloads
- ✅ Custom download paths
- ✅ Multiple audio formats
- ✅ Dark mode support
- ✅ Desktop app packaging

---

## 💡 Pro Tips

1. **Batch Downloads**: Use playlists for multiple songs
2. **Quality vs Size**: 320kbps MP3 is best quality/size ratio
3. **Failed Tracks**: Some tracks may not be on YouTube
4. **Credentials**: Save `.env` files securely as backup
5. **Updates**: Regularly update SpotDL for bug fixes

---

## 📊 Project Structure

```
GroveGrab/
├── Backend/           # Python Flask server
│   ├── app.py        # Main server
│   ├── download_manager.py
│   └── requirements.txt
├── Client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── setup-backend.ps1
├── setup-frontend.ps1
└── start-dev.ps1
```

---

**Need detailed help?** See `SETUP_GUIDE.md`

**For full documentation:** See `README.md`

---

Made with ❤️ for music lovers 🎵
