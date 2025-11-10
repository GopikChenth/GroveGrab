# 🎨 GroveGrab Logo Setup

## Your Logo Image

The beautiful GroveGrab logo you provided needs to be saved as:

```
Electron/assets/icon.png
```

### Image Requirements

- **Format**: PNG with transparency
- **Size**: 512x512 pixels (or 1024x1024 for best quality)
- **Aspect Ratio**: 1:1 (square)
- **Background**: Transparent or solid color

---

## How to Add Your Logo

### Step 1: Save the Logo

1. Find the GroveGrab logo image (the one with the music note and download arrow)
2. Right-click the image
3. Save as: `icon.png`
4. Move to: `S:\Web Projects\GroveGrab\Electron\assets\icon.png`

### Step 2: Generate Platform-Specific Icons

#### For Windows (.ico)

**Option A: Online Tool (Easiest)**
1. Go to: https://cloudconvert.com/png-to-ico
2. Upload your `icon.png`
3. Download the converted `icon.ico`
4. Save to: `Electron\assets\icon.ico`

**Option B: Using ImageMagick**
```powershell
# Install ImageMagick first: https://imagemagick.org/script/download.php
cd Electron\assets
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### For macOS (.icns)

**Option A: Online Tool**
1. Go to: https://cloudconvert.com/png-to-icns
2. Upload your `icon.png`
3. Download the converted `icon.icns`
4. Save to: `Electron\assets\icon.icns`

**Option B: Using Mac**
```bash
# On macOS
./create-icns.sh icon.png
```

---

## Quick Setup (Windows)

```powershell
# 1. Navigate to Electron folder
cd "S:\Web Projects\GroveGrab\Electron"

# 2. Create assets folder if it doesn't exist
New-Item -ItemType Directory -Force -Path "assets"

# 3. Copy your logo there
# Place the GroveGrab logo as: assets\icon.png

# 4. Generate Windows icon (using online tool recommended)
# Upload assets\icon.png to https://cloudconvert.com/png-to-ico
# Download and save as assets\icon.ico
```

---

## Verify Your Logo

After adding the logo, you should have:

```
Electron/
└── assets/
    ├── icon.png     ← Base logo (512x512+ PNG)
    ├── icon.ico     ← Windows icon (generated)
    └── icon.icns    ← macOS icon (generated, optional)
```

---

## Test the Logo

```powershell
cd Electron
npm start
```

The Electron window should show your logo in:
- Window title bar icon (Windows)
- Taskbar icon
- Alt+Tab switcher
- Built installer icon

---

## Logo Usage

The logo is used for:
- **Window Icon**: Shows in title bar and taskbar
- **Installer Icon**: Shows in Windows installer
- **Desktop Shortcut**: Icon for desktop shortcut
- **Start Menu**: Icon in Start Menu
- **App List**: Icon in Windows Apps & Features

---

## Common Issues

### "Icon not showing"

1. Clear Electron cache:
```powershell
rm -rf node_modules/.cache
```

2. Rebuild:
```powershell
npm run build:win
```

### "Icon looks blurry"

- Use a higher resolution PNG (1024x1024)
- Ensure the logo has clean edges
- Avoid too much detail in small areas

### "Icon has white background"

- Save PNG with transparency
- Or use a dark/colored background that matches the app theme

---

## 🎨 Design Tips

### For Best Results:

1. **Simple Design**: Works well at small sizes (16x16 to 512x512)
2. **High Contrast**: Stands out on light and dark backgrounds
3. **Centered Content**: Important elements in the center
4. **Padding**: Leave ~10% padding around edges
5. **Transparent Background**: Works on any taskbar color

### The GroveGrab Logo

Your logo is perfect because it:
- ✅ Simple and recognizable
- ✅ Beautiful gradient colors
- ✅ Clear music + download symbolism
- ✅ Works at any size
- ✅ Transparent background
- ✅ Professional design

---

## 🚀 Next Steps

After adding your logo:

1. **Test**: `npm start`
2. **Build**: `npm run build:win`
3. **Check**: Look at the installer icon
4. **Install**: Test the installed app icon
5. **Admire**: Enjoy your professional app! 🎉

---

**Remember**: The logo file should be named exactly `icon.png` and placed in the `Electron\assets\` folder.
