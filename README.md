# 🎵 GroveGrab

<div align="center">

![GroveGrab Banner](https://img.shields.io/badge/GroveGrab-v1.0.0-8A2BE2?style=for-the-badge&logo=spotify&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Electron](https://img.shields.io/badge/Electron-Desktop-47A248?style=for-the-badge&logo=electron&logoColor=white)

**A powerful, modern desktop application for downloading Spotify tracks, playlists, albums, and artists in high-quality audio.**

[Features](#-key-features) • [Installation](#-download--installation) • [Getting Spotify Credentials](#-getting-spotify-api-credentials) • [Developer Setup](#-developer-setup) • [Architecture](#-architecture)

---

</div>

## ✨ Key Features

- 🔑 **Custom API Credentials** — Use your own Spotify Client ID & Secret to bypass rate limits and restrictions.
- 🎧 **High Quality Audio Output** — Download in **MP3 (up to 320kbps)**, **FLAC**, **OGG**, **OPUS**, or **M4A**.
- 🎶 **Full Spotify URL Support** — Works seamlessly with tracks, playlists, albums, and artist top tracks.
- ⚡ **Real-Time Progress & Logs** — Live track progress indicators, queue management, and detailed task execution logs.
- 🔄 **Smart Retry & Skip** — Skips already-downloaded tracks automatically (`--overwrite skip`) and retries failed downloads.
- 🎨 **Modern Dark-Mode UI** — Built with React + Tailwind CSS for a fast, responsive user interface.
- 📦 **Portable Standalone Build** — Available as an installer or zero-install portable executable.

---

## ⚡ Quick Architecture Overview

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      GroveGrab Desktop                      │
 ├──────────────────────────────┬──────────────────────────────┤
 │   Frontend (React + Vite)    │    Backend (Python + Flask)  │
 │   • Tailwind CSS UI          │    • REST API Endpoints      │
 │   • Real-Time Task Polling   │    • SpotDL Engine           │
 │   • Queue & Settings Modal   │    • Process Queue Manager   │
 └──────────────┬───────────────┴──────────────┬───────────────┘
                │                              │
                ▼                              ▼
      Electron Native Window           FFmpeg / YouTube API
```

---

## 📦 Download & Installation

### Option 1: Standalone Executable (Recommended)
> **No Python, Node.js, or setup required!**

1. Download **`GroveGrab.exe`** from the [GitHub Releases](https://github.com/GopikChenth/GroveGrab/releases) page.
2. Run `GroveGrab.exe`.
3. Open Settings (⚙️) and input your [Spotify API Credentials](#-getting-spotify-api-credentials).
4. Paste any Spotify link and click **Start Download**!

---

## 🔑 Getting Spotify API Credentials

To ensure fast and unrestricted downloading, GroveGrab uses official Spotify Client API tokens:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Log in with your Spotify account and click **Create App**.
3. Fill in the app details:
   - **App Name**: `GroveGrab`
   - **App Description**: `Personal music downloader`
   - **Redirect URI**: `http://localhost:8888/callback`
4. Save the app and copy your **Client ID** and **Client Secret**.
5. Click the Settings icon (⚙️) in GroveGrab and paste your credentials.

---

## 🛠️ Developer Setup

### Prerequisites
- **Python 3.8+**
- **Node.js 16+**
- **FFmpeg** (Required by `spotdl` for audio conversion)
  - Windows: `choco install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org/)
  - Linux: `sudo apt install ffmpeg`
  - macOS: `brew install ffmpeg`

### 1. Clone the Repository
```bash
git clone https://github.com/GopikChenth/GroveGrab.git
cd GroveGrab
```

### 2. Setup Backend (Flask)
```powershell
# Using PowerShell setup script
.\setup-backend.ps1

# Or manually:
cd Backend
pip install -r requirements.txt
python app.py
```

### 3. Setup Frontend (React + Vite)
```powershell
# Using PowerShell setup script
.\setup-frontend.ps1

# Or manually:
cd Client
npm install
npm run dev
```

### 4. Run Desktop App (Electron)
```bash
cd Client
npm run electron:start
```

---

## 🎛️ Supported Formats & Settings

| Audio Format | Supported Bitrates / Quality | Notes |
| :--- | :--- | :--- |
| **MP3** | `128k`, `192k`, `256k`, **`320k`** | Default format; recommended for maximum compatibility |
| **FLAC** | Lossless | Highest audio fidelity |
| **OGG** | Variable | Vorbis container format |
| **OPUS** | Variable | High efficiency audio codec |
| **M4A** | Variable | AAC container format |

---

## 📡 REST API Reference

The Python backend exposes the following local REST API endpoints on `http://localhost:5000`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Check backend server health status |
| `GET / POST` | `/api/config` | Fetch or update Spotify credentials and default download path |
| `POST` | `/api/validate-url` | Validate Spotify track/playlist/album URL format |
| `POST` | `/api/preload` | Preload track metadata before downloading |
| `POST` | `/api/download` | Trigger a new background download task |
| `GET` | `/api/tasks` | List all active and completed tasks |
| `GET` | `/api/tasks/:id` | Get status and progress for a specific task |
| `POST` | `/api/tasks/:id/cancel` | Cancel an active download task |
| `POST` | `/api/tasks/:id/retry` | Retry failed tracks in a task |
| `DELETE` | `/api/tasks/:id` | Remove task entry from queue |
| `GET` | `/api/logs/:id` | Fetch task execution logs |

---

## 🔒 Security Notice

- ⚠️ **Never commit your `.env` file** — It contains your private Spotify API keys.
- Keep your **Client Secret** private and do not share it publicly.

---

## ⚖️ Legal Disclaimer

GroveGrab is developed for **educational and personal use only**. Users are responsible for complying with Spotify's and YouTube's Terms of Service and local copyright laws.

---

## 🙏 Credits & Acknowledgments

- **[SpotDL](https://github.com/spotDL/spotify-downloader)** — Core Spotify downloading engine.
- **[Flask](https://flask.palletsprojects.com/)** — Python web backend.
- **[React](https://react.dev/) & [Vite](https://vitejs.dev/)** — Modern frontend stack.
- **[Electron](https://www.electronjs.org/)** — Desktop cross-platform shell.

---

<div align="center">

Made with ❤️ by [GopikChenth](https://github.com/GopikChenth)

</div>
