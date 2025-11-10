# 🍇 GroveGrab Electron App

> Desktop application with native window for GroveGrab

---

## 🎯 What is This?

This folder contains the **Electron wrapper** for GroveGrab that:
- ✅ Creates a **native desktop window** (no browser needed)
- ✅ Automatically starts **both backend and frontend** servers
- ✅ Bundles everything into a **single executable**
- ✅ Provides **better user experience** with native features
- ✅ Handles **connection errors** gracefully

---

## 🚀 Quick Start

### 1️⃣ Install Dependencies

```powershell
cd Electron
npm install
```

### 2️⃣ Run in Development Mode

```powershell
npm start
```

This will:
1. Start the Electron window
2. Load the app from http://localhost:5173
3. Backend must be running separately

### 3️⃣ Full Development Mode (All-in-One)

```powershell
npm run dev
```

This will:
1. Start backend server automatically
2. Start frontend dev server automatically
3. Launch Electron window
4. Watch for changes

---

## 📦 Building Executables

### Windows

```powershell
npm run build:win
```

Creates:
- `dist/GroveGrab Setup 1.0.0.exe` (Installer)
- `dist/win-unpacked/` (Portable version)

### macOS

```powershell
npm run build:mac
```

Creates:
- `dist/GroveGrab-1.0.0.dmg` (Installer)
- `dist/mac/` (App bundle)

### Linux

```powershell
npm run build:linux
```

Creates:
- `dist/GroveGrab-1.0.0.AppImage` (Portable)

---

## 📂 Project Structure

```
Electron/
├── main.js              ← Main Electron process
├── preload.js           ← Preload script (security)
├── package.json         ← Dependencies & build config
├── assets/              ← Icons and images
│   ├── icon.png         ← App icon (PNG - all platforms)
│   ├── icon.ico         ← App icon (Windows)
│   └── icon.icns        ← App icon (macOS)
└── README.md            ← This file
```

---

## 🎨 Adding Your Logo

### Step 1: Add Logo to Assets

Place your logo files in the `assets/` folder:

1. **icon.png** - 512x512 PNG (for Linux and base icon)
2. **icon.ico** - Windows icon (generated from PNG)
3. **icon.icns** - macOS icon (generated from PNG)

### Step 2: Generate Icons from PNG

#### Using Online Tool (Easy)

1. Go to: https://cloudconvert.com/png-to-ico
2. Upload your `icon.png` (512x512)
3. Convert to ICO format
4. Save as `icon.ico` in assets/

For macOS:
1. Go to: https://cloudconvert.com/png-to-icns
2. Upload your `icon.png`
3. Convert to ICNS format
4. Save as `icon.icns` in assets/

#### Using Command Line (Advanced)

**Windows (ImageMagick):**
```powershell
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

**macOS:**
```bash
# Create iconset
mkdir icon.iconset
sips -z 16 16     icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32     icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32     icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64     icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128   icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256   icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256   icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512   icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512   icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# Convert to icns
iconutil -c icns icon.iconset
```

---

## ⚙️ Configuration

### Window Settings

Edit `main.js` to customize the window:

```javascript
new BrowserWindow({
  width: 1200,          // Window width
  height: 800,          // Window height
  minWidth: 800,        // Minimum width
  minHeight: 600,       // Minimum height
  icon: 'assets/icon.png',  // Window icon
  backgroundColor: '#0f172a',  // Background color
  autoHideMenuBar: true,      // Hide menu bar
  titleBarStyle: 'default'    // Title bar style
})
```

### Port Configuration

Change ports if needed:

```javascript
const BACKEND_PORT = 5000;    // Backend Flask server
const FRONTEND_PORT = 5173;   // Frontend static server
```

### Build Configuration

Edit `package.json` → `build` section:

```json
{
  "build": {
    "appId": "com.grovegrab.app",
    "productName": "GroveGrab",
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    }
  }
}
```

---

## 🔧 Features

### Native Features

- **Native Window**: Proper desktop window (not a browser)
- **Automatic Startup**: Starts backend and frontend automatically
- **Port Management**: Handles port conflicts automatically
- **Graceful Shutdown**: Properly stops all processes
- **Error Handling**: Shows native error dialogs

### Security Features

- **Context Isolation**: Enabled for security
- **No Node Integration**: Renderer process isolated
- **Preload Script**: Safe IPC communication
- **Web Security**: Enabled by default

### Developer Features

- **Hot Reload**: Frontend changes reload automatically
- **DevTools**: Open with F12 in development mode
- **Logging**: Console logs from main and renderer

---

## 🐛 Troubleshooting

### "Port already in use"

The app automatically tries to free ports 5000 and 5173. If it fails:

1. Manually stop processes:
```powershell
taskkill /F /IM python.exe
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

2. Or change ports in `main.js`

### "Failed to load app"

1. Ensure backend is built:
```powershell
cd ../Backend
pip install -r requirements.txt
```

2. Ensure frontend is built:
```powershell
cd ../Client
npm install
npm run build
```

3. Check if servers are running:
- Backend: http://localhost:5000/health
- Frontend: http://localhost:5173

### "Backend not starting"

1. Check Python is installed:
```powershell
python --version
```

2. Check virtual environment exists:
```powershell
cd ../Backend
.venv\Scripts\python.exe --version
```

3. Reinstall dependencies:
```powershell
cd ../Backend
.venv\Scripts\activate
pip install -r requirements.txt
```

### Build fails

1. Clean node_modules:
```powershell
rm -rf node_modules
npm install
```

2. Clear electron-builder cache:
```powershell
rm -rf dist
rm -rf build
```

3. Try again:
```powershell
npm run build:win
```

---

## 📊 Build Output Sizes

| Platform | Installer | Unpacked | Notes |
|----------|-----------|----------|-------|
| Windows  | ~150 MB   | ~200 MB  | NSIS installer + app |
| macOS    | ~160 MB   | ~210 MB  | DMG disk image + app |
| Linux    | ~140 MB   | ~190 MB  | AppImage portable |

### Why So Large?

The app bundles:
- Electron runtime (~100 MB)
- Python runtime (~40 MB)
- Backend dependencies (~30 MB)
- Frontend assets (~5 MB)
- Node modules (~15 MB)

---

## 🚀 Distribution

### Windows

**Installer (Recommended):**
- File: `dist/GroveGrab Setup 1.0.0.exe`
- Size: ~150 MB
- Installs to: `C:\Program Files\GroveGrab`
- Creates shortcuts: Desktop + Start Menu
- Uninstaller: Windows Settings → Apps

**Portable:**
- Folder: `dist/win-unpacked/`
- Size: ~200 MB
- No installation required
- Just ZIP and distribute

### macOS

**DMG Installer:**
- File: `dist/GroveGrab-1.0.0.dmg`
- Size: ~160 MB
- User drags to Applications folder
- Standard macOS installation

### Linux

**AppImage:**
- File: `dist/GroveGrab-1.0.0.AppImage`
- Size: ~140 MB
- No installation required
- Make executable: `chmod +x GroveGrab-1.0.0.AppImage`
- Run: `./GroveGrab-1.0.0.AppImage`

---

## 📝 Development Checklist

Before building for distribution:

### Code
- [ ] All features working
- [ ] No console errors
- [ ] Error handling complete
- [ ] Backend + frontend tested

### Assets
- [ ] Logo added to `assets/`
- [ ] Icon files generated (PNG, ICO, ICNS)
- [ ] Icons look good at all sizes

### Configuration
- [ ] App name correct in `package.json`
- [ ] Version number updated
- [ ] Build configuration tested
- [ ] All platforms build successfully

### Testing
- [ ] Tested on Windows 10
- [ ] Tested on Windows 11
- [ ] Tested on macOS (if building for Mac)
- [ ] Tested on Linux (if building for Linux)
- [ ] Fresh install tested
- [ ] Uninstall tested
- [ ] Shortcuts work

### Documentation
- [ ] README updated
- [ ] User guide prepared
- [ ] Release notes written
- [ ] Known issues documented

---

## 🆘 Support

### For Developers

- **Electron Docs**: https://electronjs.org/docs
- **Electron Builder**: https://electron.build
- **Node Integration**: Disabled for security
- **IPC Communication**: Use preload script

### For Users

- **Installation Issues**: Check antivirus settings
- **Startup Issues**: Check if ports 5000/5173 are free
- **Download Issues**: Ensure FFmpeg is installed
- **Settings**: Click gear icon → Configure

---

## 🎉 Advantages Over PyInstaller

| Feature | Electron | PyInstaller |
|---------|----------|-------------|
| **Native Window** | ✅ Real window | ⚠️ Console + browser |
| **Cross-Platform** | ✅ Win/Mac/Linux | ⚠️ Windows only |
| **File Size** | 150-200 MB | 50 MB |
| **Startup Time** | 2-3 seconds | 3-5 seconds |
| **Auto-Updates** | ✅ Easy to add | ❌ Difficult |
| **Native Dialogs** | ✅ Built-in | ❌ None |
| **Professional Look** | ✅ Very polished | ⚠️ Basic |
| **Installer** | ✅ NSIS/DMG | ⚠️ Need Inno Setup |

---

## 📚 Additional Resources

- **Electron Documentation**: https://electronjs.org
- **Electron Builder**: https://electron.build
- **Icon Generation**: https://cloudconvert.com
- **Electron Fiddle**: https://electronjs.org/fiddle

---

## 🏆 Final Steps

1. **Add your logo** to `assets/` folder
2. **Install dependencies**: `npm install`
3. **Test in dev mode**: `npm start`
4. **Build for Windows**: `npm run build:win`
5. **Test the installer**
6. **Distribute** to users!

---

**Electron App Version**: 1.0.0  
**Last Updated**: November 10, 2025  
**Electron Version**: 28.0.0
