# 🎵 GroveGrab - Getting Started in 5 Minutes

The absolute fastest way to get GroveGrab running.

---

## ⏱️ 5-Minute Quick Start

### 1️⃣ Prerequisites (2 minutes)

**Install these if you don't have them:**

```powershell
# Check what you have
python --version    # Need 3.8+
node --version      # Need 16+
ffmpeg -version     # Need any version

# Don't have FFmpeg? Install it:
choco install ffmpeg
```

### 2️⃣ Get Spotify Credentials (2 minutes)

1. Go to: https://developer.spotify.com/dashboard
2. Login → Create App
3. Copy **Client ID** and **Client Secret**
4. Add Redirect URI: `http://localhost:8888/callback`
5. Click Save

### 3️⃣ Setup (30 seconds)

```powershell
# Backend
.\setup-backend.ps1

# Frontend
.\setup-frontend.ps1
```

### 4️⃣ Configure (30 seconds)

Edit `Backend\.env`:
```env
SPOTIFY_CLIENT_ID=paste_your_client_id_here
SPOTIFY_CLIENT_SECRET=paste_your_client_secret_here
```

### 5️⃣ Start (10 seconds)

```powershell
.\start-dev.ps1
```

### 6️⃣ Use It!

1. Open: http://localhost:5173
2. Click ⚙️ Settings → Enter credentials → Save
3. Paste Spotify URL
4. Click "Start Download"
5. Done! 🎉

---

## 🎯 Test It Now

Try this URL:
```
https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp
```

---

## 🆘 Something Wrong?

### Can't Start Backend?
```powershell
cd Backend
pip install -r requirements.txt
python app.py
```

### Can't Start Frontend?
```powershell
cd Client
npm install
npm run dev
```

### Download Fails?
- Check Spotify credentials
- Install FFmpeg: `choco install ffmpeg`
- Test internet connection

---

## 📚 Need More Help?

- **Full Setup Guide**: Read `SETUP_GUIDE.md`
- **Quick Commands**: See `QUICK_REFERENCE.md`
- **What Was Built**: Read `PROJECT_SUMMARY.md`
- **Step-by-Step**: Use `CHECKLIST.md`

---

**That's it! You're ready to download! 🎵**

URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health: http://localhost:5000/health
