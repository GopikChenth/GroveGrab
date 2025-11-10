# 📁 GroveGrab - Complete File Structure

```
GroveGrab/                                    # Root project directory
│
├── 📄 README.md                              # Main project overview & features
├── 📄 SETUP_GUIDE.md                         # Detailed step-by-step setup instructions
├── 📄 QUICK_REFERENCE.md                     # Command cheat sheet & quick help
├── 📄 PROJECT_SUMMARY.md                     # Complete summary of what was built
├── 📄 GETTING_STARTED.md                     # 5-minute quick start guide
├── 📄 CHECKLIST.md                           # Setup verification checklist
├── 📄 .gitignore                             # Git ignore rules
│
├── 🔧 setup-backend.ps1                      # Automated backend setup script
├── 🔧 setup-frontend.ps1                     # Automated frontend setup script
├── 🚀 start-dev.ps1                          # Start both servers at once
│
├── 📁 Backend/                               # Python Flask backend server
│   ├── 🐍 app.py                            # Main Flask application (REST API)
│   ├── 🐍 download_manager.py               # SpotDL integration & queue management
│   ├── 📄 requirements.txt                   # Python dependencies (Flask, SpotDL, etc.)
│   ├── 📄 .env.example                       # Template for credentials
│   ├── 📄 .env.template                      # Detailed template with comments
│   ├── 🔒 .env                              # Your actual credentials (gitignored)
│   ├── 📄 README.md                          # Backend-specific documentation
│   ├── 📄 config.json                        # Runtime configuration (auto-generated)
│   └── 📁 logs/                             # Task logs (auto-created)
│
└── 📁 Client/                                # React + Vite frontend
    ├── 📁 src/                               # Source code
    │   ├── 📁 components/                    # React components
    │   │   ├── ⚛️ ConfigModal.jsx           # Settings modal component
    │   │   ├── ⚛️ DownloadCard.jsx          # Main download form component
    │   │   ├── ⚛️ TaskItem.jsx              # Task display component
    │   │   ├── ⚛️ LogsModal.jsx             # Log viewer modal
    │   │   └── ⚛️ Navbar.jsx                # Navigation bar component
    │   │
    │   ├── 📁 services/                      # API & service layer
    │   │   └── 🔌 api.js                    # Backend API communication
    │   │
    │   ├── 📁 hooks/                         # Custom React hooks
    │   │   ├── 🎣 useTheme.js               # Theme management hook
    │   │   └── 🎣 useTaskPolling.js         # Task polling hook
    │   │
    │   ├── ⚛️ App.jsx                       # Main application component
    │   ├── ⚛️ main.jsx                      # Application entry point
    │   ├── 🎨 App.css                        # App-specific styles
    │   ├── 🎨 index.css                      # Global styles
    │   └── 📁 assets/                        # Static assets (images, icons)
    │
    ├── 📁 electron/                          # Electron desktop app files
    │   ├── ⚡ main.js                        # Electron main process
    │   └── ⚡ preload.js                     # Electron preload script
    │
    ├── 📁 public/                            # Public static files
    │   └── 🖼️ vite.svg                      # App icon
    │
    ├── 📄 package.json                       # npm dependencies & scripts
    ├── 📄 vite.config.js                     # Vite build configuration
    ├── 📄 eslint.config.js                   # ESLint configuration
    ├── 🔒 .env                               # API URL configuration (gitignored)
    ├── 📄 index.html                         # HTML entry point
    └── 📄 README.md                          # Frontend-specific documentation
```

---

## 🎯 Key Files Explained

### Root Level

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation with features & overview |
| `SETUP_GUIDE.md` | Comprehensive setup instructions with troubleshooting |
| `QUICK_REFERENCE.md` | Quick command reference & cheat sheet |
| `PROJECT_SUMMARY.md` | Complete summary of what was built |
| `GETTING_STARTED.md` | 5-minute quick start guide |
| `CHECKLIST.md` | Setup verification checklist |
| `.gitignore` | Prevents committing sensitive files |
| `setup-backend.ps1` | Automated Python backend setup |
| `setup-frontend.ps1` | Automated Node.js frontend setup |
| `start-dev.ps1` | Launches both servers simultaneously |

### Backend Files

| File | Purpose | Size |
|------|---------|------|
| `app.py` | Main Flask server with all API endpoints | ~150 lines |
| `download_manager.py` | SpotDL integration, queue, progress tracking | ~350 lines |
| `requirements.txt` | Python dependencies (Flask, SpotDL, etc.) | 4 packages |
| `.env` | Your Spotify API credentials (SECRET!) | ~10 lines |
| `.env.example` | Template for .env file | ~10 lines |
| `.env.template` | Detailed template with comments | ~100 lines |
| `README.md` | Backend API documentation | ~100 lines |

### Frontend Files

| File | Purpose | Size |
|------|---------|------|
| `App.jsx` | Main app component with state management | ~200 lines |
| `ConfigModal.jsx` | Settings UI for Spotify credentials | ~150 lines |
| `DownloadCard.jsx` | Download form with validation | ~100 lines |
| `TaskItem.jsx` | Task display with progress bar | ~150 lines |
| `LogsModal.jsx` | Log viewer with syntax highlighting | ~80 lines |
| `Navbar.jsx` | Navigation with theme toggle | ~80 lines |
| `api.js` | API service layer for backend communication | ~150 lines |
| `useTheme.js` | Dark mode hook | ~30 lines |
| `useTaskPolling.js` | Real-time task polling hook | ~50 lines |

### Configuration Files

| File | Purpose |
|------|---------|
| `Backend/.env` | Backend configuration (credentials, paths) |
| `Client/.env` | Frontend configuration (API URL) |
| `package.json` | npm dependencies, scripts, Electron config |
| `vite.config.js` | Vite build settings |
| `eslint.config.js` | Code linting rules |

---

## 📊 Project Statistics

```
Total Files:        ~35 files
Total Lines:        ~2,500+ lines of code
Backend Code:       ~500 lines (Python)
Frontend Code:      ~1,200+ lines (JavaScript/JSX)
Documentation:      ~2,000+ lines (Markdown)
Languages:          Python, JavaScript, JSX, CSS, PowerShell
Frameworks:         Flask, React, Vite, Tailwind CSS
Dependencies:       ~20 npm packages, 4 pip packages
```

---

## 🔍 File Dependencies

### Backend Dependencies
```
app.py
  ↓
download_manager.py
  ↓
SpotDL → YouTube → FFmpeg → Audio Files
  ↑
.env (credentials)
```

### Frontend Dependencies
```
index.html
  ↓
main.jsx
  ↓
App.jsx
  ├→ ConfigModal.jsx
  ├→ DownloadCard.jsx
  ├→ TaskItem.jsx
  ├→ LogsModal.jsx
  ├→ Navbar.jsx
  └→ api.js → Backend API
```

---

## 🎨 Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── Theme Toggle
│   └── Settings Button
│
├── DownloadCard
│   ├── URL Input
│   └── Download Button
│
├── Task List
│   └── TaskItem (multiple)
│       ├── Progress Bar
│       ├── Stats
│       └── Action Buttons
│
├── ConfigModal (conditional)
│   ├── Credentials Form
│   └── Settings Form
│
└── LogsModal (conditional)
    └── Log Display
```

---

## 🗂️ Generated Files

These files are created automatically during runtime:

```
Backend/
├── config.json          # Created when you save settings
├── logs/                # Created when downloads start
│   └── *.log           # Individual task logs
└── __pycache__/        # Python bytecode cache

Client/
├── node_modules/        # Created by npm install
├── dist/               # Created by npm run build
└── dist-electron/      # Created by npm run electron:build
```

**Note**: All generated files are in `.gitignore`

---

## 🔒 Sensitive Files (Never Commit!)

```
⚠️ Backend/.env
⚠️ Backend/config.json
⚠️ Client/.env
```

These files contain:
- Spotify API credentials
- Download paths
- User preferences

---

## 📦 Build Outputs

### Web Build
```
Client/dist/
├── index.html
├── assets/
│   ├── index-*.js
│   └── index-*.css
└── vite.svg
```

### Desktop Build
```
Client/dist-electron/
├── GroveGrab Setup 1.0.0.exe    # Windows installer
├── win-unpacked/                 # Unpacked app files
└── builder-*.yaml               # Build metadata
```

---

## 🎯 Entry Points

| Type | Entry Point | Purpose |
|------|-------------|---------|
| Backend | `Backend/app.py` | Flask server startup |
| Frontend (Dev) | `Client/src/main.jsx` | React app entry |
| Frontend (Build) | `Client/index.html` | HTML template |
| Desktop | `Client/electron/main.js` | Electron entry |

---

## 🔧 Scripts Location

### PowerShell Scripts (Root)
- `setup-backend.ps1` - Backend setup automation
- `setup-frontend.ps1` - Frontend setup automation
- `start-dev.ps1` - Start both servers

### npm Scripts (Client/package.json)
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run electron:dev` - Run as desktop app (dev)
- `npm run electron:build` - Build desktop app

### Python Scripts (Backend)
- `python app.py` - Start backend server

---

## 📝 Documentation Files

```
README.md              # Main overview (you are here!)
SETUP_GUIDE.md         # Detailed setup instructions
QUICK_REFERENCE.md     # Command cheat sheet
PROJECT_SUMMARY.md     # What was built
GETTING_STARTED.md     # 5-minute quick start
CHECKLIST.md           # Verification checklist
Backend/README.md      # Backend API docs
Client/README.md       # Frontend component docs
```

---

## 🎓 Where to Find Things

| Looking for... | Go to... |
|----------------|----------|
| How to setup | `SETUP_GUIDE.md` |
| Quick commands | `QUICK_REFERENCE.md` |
| API endpoints | `Backend/README.md` |
| Component docs | `Client/README.md` |
| What was built | `PROJECT_SUMMARY.md` |
| 5-min start | `GETTING_STARTED.md` |
| Verify setup | `CHECKLIST.md` |
| Main info | `README.md` |

---

**This structure is designed to be:**
- ✅ Easy to navigate
- ✅ Well documented
- ✅ Modular and maintainable
- ✅ Production-ready
- ✅ Beginner-friendly
