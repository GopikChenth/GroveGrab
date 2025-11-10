# 🎵 GroveGrab - Complete Setup Guide

This guide will walk you through setting up GroveGrab from scratch.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Spotify API Credentials](#getting-spotify-api-credentials)
3. [Installing Dependencies](#installing-dependencies)
4. [Configuring the Application](#configuring-the-application)
5. [Running the Application](#running-the-application)
6. [Building Desktop App](#building-desktop-app)
7. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

Before starting, ensure you have the following installed:

### Required Software

#### Python 3.8+
```powershell
# Check if Python is installed
python --version

# If not installed, download from:
# https://www.python.org/downloads/
```

#### Node.js 16+
```powershell
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/
```

#### FFmpeg
FFmpeg is required by SpotDL to convert audio files.

**Option 1: Using Chocolatey (Recommended)**
```powershell
# Install Chocolatey if not already installed
# https://chocolatey.org/install

# Install FFmpeg
choco install ffmpeg
```

**Option 2: Manual Installation**
1. Download FFmpeg from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Extract to a folder (e.g., `C:\ffmpeg`)
3. Add to PATH:
   - Open System Properties → Environment Variables
   - Edit PATH variable
   - Add `C:\ffmpeg\bin`

**Verify FFmpeg Installation**
```powershell
ffmpeg -version
```

---

## 2. Getting Spotify API Credentials

### Step 1: Create a Spotify Developer Account
1. Go to [https://developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account (or create one)

### Step 2: Create an App
1. Click **"Create app"**
2. Fill in the details:
   - **App name**: GroveGrab (or any name)
   - **App description**: Personal music downloader
   - **Redirect URI**: `http://localhost:8888/callback`
   - **API/SDKs**: Check "Web API"
3. Click **"Save"**

### Step 3: Get Your Credentials
1. Click on your newly created app
2. Click **"Settings"**
3. Copy your:
   - **Client ID** (visible)
   - **Client Secret** (click "View client secret")
4. Verify **Redirect URIs** includes: `http://localhost:8888/callback`

⚠️ **Keep these credentials private!** Never share them or commit them to Git.

---

## 3. Installing Dependencies

### Automated Setup (Recommended)

#### Setup Backend
```powershell
# Run from the GroveGrab root directory
.\setup-backend.ps1
```

This script will:
- Check Python installation
- Create a virtual environment (optional)
- Install all Python dependencies
- Check FFmpeg installation
- Create .env file

#### Setup Frontend
```powershell
# Run from the GroveGrab root directory
.\setup-frontend.ps1
```

This script will:
- Check Node.js installation
- Install all npm dependencies
- Create .env file

### Manual Setup

If the automated scripts don't work, follow these steps:

#### Backend
```powershell
cd Backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create .env file
Copy-Item .env.example .env
```

#### Frontend
```powershell
cd Client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" | Out-File -FilePath .env -Encoding utf8
```

---

## 4. Configuring the Application

### Backend Configuration

Edit `Backend\.env` with your Spotify credentials:

```env
# Spotify API Credentials
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback

# Download Settings
DEFAULT_DOWNLOAD_PATH=Downloads/GroveGrab
AUDIO_FORMAT=mp3
AUDIO_QUALITY=320k

# Server Settings
FLASK_PORT=5000
FLASK_DEBUG=True
```

**Replace** `your_client_id_here` and `your_client_secret_here` with your actual credentials from Step 2.

### Frontend Configuration

The `Client\.env` file should already be created:

```env
VITE_API_URL=http://localhost:5000
```

No changes needed unless you're running the backend on a different port.

---

## 5. Running the Application

### Quick Start (Recommended)

```powershell
# From the GroveGrab root directory
.\start-dev.ps1
```

This will:
1. Start the backend server in a new window
2. Start the frontend dev server in a new window
3. Open both on their respective ports

### Manual Start

If you prefer to start services manually:

#### Terminal 1: Backend
```powershell
cd Backend

# If using virtual environment
.\venv\Scripts\Activate.ps1

# Start backend
python app.py
```

Backend will be available at: `http://localhost:5000`

#### Terminal 2: Frontend
```powershell
cd Client

# Start frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173` (or another port shown in terminal)

### Using the Application

1. Open your browser to the frontend URL (usually `http://localhost:5173`)
2. You'll see a warning if credentials aren't configured
3. Click the **⚙️ Settings** button in the navbar
4. Enter your Spotify API credentials:
   - Client ID
   - Client Secret
   - Redirect URI (default: `http://localhost:8888/callback`)
5. Click **"Save Configuration"**
6. Enter a Spotify URL in the download form:
   - Track: `https://open.spotify.com/track/...`
   - Playlist: `https://open.spotify.com/playlist/...`
   - Album: `https://open.spotify.com/album/...`
   - Artist: `https://open.spotify.com/artist/...`
7. Click **"Start Download"**
8. Watch the progress in real-time!

---

## 6. Building Desktop App

To create a standalone desktop application:

### Step 1: Install Electron Dependencies
```powershell
cd Client
npm install --save-dev electron electron-builder concurrently wait-on
```

### Step 2: Build the Frontend
```powershell
npm run build
```

### Step 3: Build Desktop App
```powershell
npm run electron:build
```

The installer will be created in `Client\dist-electron\`

### Step 4: Install the App
1. Navigate to `Client\dist-electron\`
2. Run the installer (e.g., `GroveGrab Setup 1.0.0.exe`)
3. Follow the installation wizard
4. Launch GroveGrab from your Start Menu or Desktop

**Note**: The desktop app bundles both frontend and backend into a single executable.

---

## 7. Troubleshooting

### Backend Issues

#### "Python not found"
```powershell
# Make sure Python is installed and in PATH
python --version

# If not, reinstall Python and check "Add to PATH" during installation
```

#### "pip not found"
```powershell
# pip should come with Python, try:
python -m pip --version

# Use python -m pip instead of pip if needed
python -m pip install -r requirements.txt
```

#### "No module named 'flask'"
```powershell
# Make sure you're in the Backend directory
cd Backend

# Install dependencies
pip install -r requirements.txt

# If using virtual environment, make sure it's activated
.\venv\Scripts\Activate.ps1
```

#### "Port 5000 already in use"
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change the port in Backend\.env
# FLASK_PORT=5001
```

### Frontend Issues

#### "npm not found"
```powershell
# Make sure Node.js is installed
node --version
npm --version

# If not, reinstall Node.js from https://nodejs.org/
```

#### "Cannot connect to backend"
- Verify backend is running: `http://localhost:5000/health`
- Check `Client\.env` has correct API URL
- Check firewall isn't blocking connections
- Try disabling antivirus temporarily

#### "Port 5173 already in use"
```powershell
# Vite will automatically use the next available port
# Check the terminal output for the actual port
```

### SpotDL Issues

#### "FFmpeg not found"
```powershell
# Verify FFmpeg is installed
ffmpeg -version

# If not found, install it:
choco install ffmpeg

# Or download manually and add to PATH
```

#### "Unable to download track"
- Some tracks may not be available on YouTube (SpotDL's source)
- Check your internet connection
- Verify Spotify credentials are correct
- Try a different track to test

#### "Rate limit exceeded"
- This is why we use your own API credentials!
- If still happening, wait a few minutes and try again
- Consider downloading smaller batches

### Spotify API Issues

#### "Invalid credentials"
- Double-check your Client ID and Secret
- Make sure there are no extra spaces
- Verify you copied the entire string

#### "Redirect URI mismatch"
- Go to Spotify Developer Dashboard
- Open your app → Settings
- Add `http://localhost:8888/callback` to Redirect URIs
- Make sure it exactly matches (including http:// and /callback)

### Download Issues

#### "Downloads are slow"
- SpotDL downloads from YouTube, speed depends on:
  - Your internet connection
  - YouTube's servers
  - FFmpeg conversion speed
- Consider downloading during off-peak hours

#### "Downloaded files are missing metadata"
- Metadata comes from Spotify API
- If missing, check your credentials
- Try enabling metadata preload before downloading

#### "Audio quality is poor"
- Change audio quality in Settings (⚙️)
- MP3 320kbps is the highest quality available
- Consider using FLAC format for lossless audio

---

## 📞 Need More Help?

If you're still having issues:

1. **Check the logs**:
   - Backend logs: Terminal running `python app.py`
   - Frontend logs: Browser Developer Console (F12)
   - Task logs: Click the 📄 icon on any task

2. **Common solutions**:
   - Restart both backend and frontend
   - Clear browser cache
   - Delete and recreate .env files
   - Reinstall dependencies

3. **System requirements**:
   - Windows 10/11
   - 4GB RAM minimum (8GB recommended)
   - 500MB free disk space (plus space for downloads)
   - Stable internet connection

---

## 🎉 Success!

If you've made it this far and everything is working, congratulations! 🎵

You can now:
- ✅ Download Spotify tracks, playlists, albums, and artists
- ✅ Track download progress in real-time
- ✅ Manage multiple downloads
- ✅ View detailed logs
- ✅ Retry failed downloads
- ✅ Use your own Spotify API credentials

**Enjoy your music! 🎶**

---

**Pro Tips:**

- Save your `.env` files in a secure location
- Regularly update SpotDL: `pip install --upgrade spotdl`
- Use playlists for batch downloading
- Check out SpotDL documentation for advanced features: [https://github.com/spotDL/spotify-downloader](https://github.com/spotDL/spotify-downloader)
