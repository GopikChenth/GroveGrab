# ✅ GroveGrab Setup Checklist

Use this checklist to ensure you have everything set up correctly.

---

## 📋 Pre-Setup Checklist

- [ ] **Python 3.8+** installed and in PATH
  ```powershell
  python --version
  ```

- [ ] **Node.js 16+** installed and in PATH
  ```powershell
  node --version
  ```

- [ ] **FFmpeg** installed and in PATH
  ```powershell
  ffmpeg -version
  ```

- [ ] **Spotify Developer Account** created
  - Go to: https://developer.spotify.com/dashboard

---

## 🔑 Spotify API Setup

- [ ] Logged into Spotify Developer Dashboard
- [ ] Created new app (or selected existing one)
- [ ] Copied **Client ID**
- [ ] Copied **Client Secret** (click "View client secret")
- [ ] Added Redirect URI: `http://localhost:8888/callback`
- [ ] Saved credentials securely

---

## 🖥️ Backend Setup

- [ ] Ran `.\setup-backend.ps1` successfully
- [ ] Created `Backend\.env` file (from `.env.example`)
- [ ] Added Spotify Client ID to `Backend\.env`
- [ ] Added Spotify Client Secret to `Backend\.env`
- [ ] Verified Redirect URI in `Backend\.env`
- [ ] Tested backend start: `cd Backend && python app.py`
- [ ] Backend accessible at http://localhost:5000
- [ ] Health check responds: http://localhost:5000/health

---

## 🎨 Frontend Setup

- [ ] Ran `.\setup-frontend.ps1` successfully
- [ ] Created `Client\.env` file
- [ ] Verified API URL in `Client\.env`: `VITE_API_URL=http://localhost:5000`
- [ ] Tested frontend start: `cd Client && npm run dev`
- [ ] Frontend accessible at http://localhost:5173

---

## 🚀 Application Testing

- [ ] Both backend and frontend running
- [ ] Opened browser to http://localhost:5173
- [ ] Clicked Settings icon (⚙️) in navbar
- [ ] Entered Spotify credentials in settings modal
- [ ] Clicked "Save Configuration"
- [ ] Saw success message (no errors)
- [ ] Entered a test Spotify URL (e.g., a single track)
- [ ] Clicked "Start Download"
- [ ] Saw download task appear
- [ ] Progress bar updating
- [ ] Download completed successfully
- [ ] Files saved to download folder

---

## 📦 Desktop App (Optional)

- [ ] Installed Electron dependencies:
  ```powershell
  cd Client
  npm install --save-dev electron electron-builder concurrently wait-on
  ```

- [ ] Built desktop app:
  ```powershell
  npm run electron:build
  ```

- [ ] Found installer in `Client\dist-electron\`
- [ ] Installed app
- [ ] Launched app from Start Menu
- [ ] App runs without errors

---

## 🧪 Feature Testing

### Download Features
- [ ] Downloaded a single track
- [ ] Downloaded a playlist
- [ ] Downloaded an album
- [ ] Downloaded artist's top tracks

### Task Management
- [ ] Viewed task progress in real-time
- [ ] Clicked logs icon to view detailed logs
- [ ] Cancelled a running download
- [ ] Retried a failed download
- [ ] Deleted a completed task

### Configuration
- [ ] Changed download path in settings
- [ ] Changed audio format (MP3, FLAC, etc.)
- [ ] Changed audio quality (320kbps, etc.)
- [ ] Settings persisted after restart

### UI Features
- [ ] Toggled dark mode
- [ ] Responsive design works on smaller window
- [ ] All buttons respond correctly
- [ ] Error messages display properly

---

## 🐛 Troubleshooting Completed

If you encountered issues, mark what you fixed:

- [ ] Fixed Python PATH issue
- [ ] Fixed Node.js PATH issue
- [ ] Installed FFmpeg
- [ ] Fixed port conflicts
- [ ] Fixed firewall/antivirus blocking
- [ ] Fixed Spotify credential errors
- [ ] Fixed redirect URI mismatch
- [ ] Updated SpotDL
- [ ] Cleared npm cache
- [ ] Reinstalled dependencies

---

## 📚 Documentation Read

- [ ] Read `README.md` (overview)
- [ ] Read `SETUP_GUIDE.md` (detailed setup)
- [ ] Read `QUICK_REFERENCE.md` (commands)
- [ ] Read `PROJECT_SUMMARY.md` (what was built)
- [ ] Bookmarked Spotify Developer Dashboard
- [ ] Saved credentials securely

---

## 🔒 Security Checklist

- [ ] Never committed `.env` files to Git
- [ ] `.gitignore` properly configured
- [ ] Spotify credentials kept private
- [ ] No credentials shared in screenshots
- [ ] Backup of `.env` files created
- [ ] Understanding of legal/ethical use

---

## ✅ Final Verification

### Backend is Working
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] API endpoints return data
- [ ] No Python errors in console

### Frontend is Working
- [ ] Page loads without errors
- [ ] Can configure settings
- [ ] Can start downloads
- [ ] Real-time updates working
- [ ] No JavaScript errors in console

### Downloads are Working
- [ ] SpotDL executing correctly
- [ ] FFmpeg converting audio
- [ ] Files appearing in download folder
- [ ] Metadata being applied
- [ ] Quality matches settings

### Everything Integrated
- [ ] Frontend connects to backend
- [ ] Backend uses Spotify API
- [ ] SpotDL downloads from YouTube
- [ ] Progress updates in real-time
- [ ] Logs display correctly
- [ ] All features functional

---

## 🎉 Success Criteria

You're done when:

✅ You can paste a Spotify URL
✅ Click "Start Download"
✅ Watch progress in real-time
✅ Find the downloaded file
✅ File has correct metadata
✅ Quality matches your settings
✅ Everything works without errors

---

## 📝 Notes & Issues

Use this space to track any issues or notes:

```
Issue: ___________________________________________
Solution: _________________________________________
Date: _____________________________________________

Issue: ___________________________________________
Solution: _________________________________________
Date: _____________________________________________

Issue: ___________________________________________
Solution: _________________________________________
Date: _____________________________________________
```

---

## 🎯 Next Steps After Setup

Once everything is working:

1. **Test thoroughly** with different types of content
2. **Adjust settings** to your preferences
3. **Create shortcuts** for start-dev.ps1
4. **Build desktop app** if you want standalone version
5. **Backup your .env files** securely
6. **Explore customization** options
7. **Consider contributing** improvements

---

## 🆘 Still Having Issues?

If you're stuck:

1. Check the `SETUP_GUIDE.md` troubleshooting section
2. Review logs in both backend and frontend
3. Verify all prerequisites are installed
4. Try restarting both servers
5. Check firewall/antivirus settings
6. Verify internet connection
7. Test with a simple single track first

---

## 📞 Common Issue Quick Links

| Issue | Solution Location |
|-------|------------------|
| Python not found | SETUP_GUIDE.md → Troubleshooting → Backend |
| FFmpeg not found | SETUP_GUIDE.md → Prerequisites → FFmpeg |
| Port in use | SETUP_GUIDE.md → Troubleshooting → Backend |
| Can't connect | SETUP_GUIDE.md → Troubleshooting → Frontend |
| Invalid credentials | SETUP_GUIDE.md → Spotify API Setup |
| Download fails | SETUP_GUIDE.md → Troubleshooting → SpotDL |

---

**Once all boxes are checked, you're ready to enjoy GroveGrab! 🎵🎉**

Date Setup Completed: _______________

Tested By: _______________

Working Perfectly: ✅
