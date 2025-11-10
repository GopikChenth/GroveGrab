# ❓ GroveGrab - Frequently Asked Questions

Common questions and answers about GroveGrab.

---

## 🎵 General Questions

### What is GroveGrab?
GroveGrab is a complete desktop application for downloading Spotify songs and playlists using SpotDL with your own Spotify API credentials to avoid rate limits.

### Is GroveGrab free?
Yes! GroveGrab is completely free and open-source. However, you need:
- A free Spotify Developer account (free)
- FFmpeg (free)
- Python and Node.js (both free)

### Is this legal?
This tool is for **personal use only**. You should:
- ✅ Own a Spotify subscription
- ✅ Use it for offline listening only
- ✅ Respect copyright laws
- ❌ Don't distribute downloaded content
- ❌ Don't use for commercial purposes

Always comply with Spotify's and YouTube's Terms of Service.

### Why do I need my own Spotify API credentials?
Using your own credentials:
- Avoids rate limits from shared accounts
- Ensures better reliability
- Gives you full control
- Is free and easy to set up

---

## 🔧 Setup Questions

### Do I need to pay for Spotify API?
No! Spotify's API is completely free for personal use. You just need to create a developer account and an app.

### What operating systems are supported?
Currently optimized for **Windows 10/11**. Can work on Mac/Linux with minor adjustments to scripts.

### How much disk space do I need?
- Application: ~500MB
- Downloads: Depends on how much you download
  - Average song: 3-10MB (MP3 320kbps)
  - Average playlist: 50-500MB

### Do I need a Spotify Premium account?
No, but having Premium is recommended for:
- Better quality metadata
- Supporting artists
- Legal access to music

---

## 🎯 Usage Questions

### What can I download?
You can download:
- ✅ Individual tracks
- ✅ Full playlists
- ✅ Complete albums
- ✅ Artist's top tracks

### What audio formats are supported?
- **MP3** - Most compatible (128k-320kbps)
- **FLAC** - Lossless quality
- **OGG** - Open source format
- **OPUS** - Modern codec
- **M4A** - AAC format

### What's the best quality setting?
- **For most users**: MP3 320kbps
- **For audiophiles**: FLAC (lossless)
- **For small files**: MP3 192kbps

### Where are files downloaded?
Default: `Downloads/GroveGrab` in your user folder

You can change this in:
1. Settings modal (⚙️)
2. Per-download in the download form
3. `Backend/.env` file

### How fast are downloads?
Speed depends on:
- Your internet connection
- YouTube server speed
- FFmpeg conversion speed
- Number of tracks

Typical: 1-2 songs per minute

---

## 🐛 Troubleshooting

### "Python not found"
**Solution**: Install Python from https://python.org and add to PATH during installation.

### "FFmpeg not found"
**Solution**: 
```powershell
choco install ffmpeg
```
Or download from https://ffmpeg.org

### "Invalid credentials"
**Solutions**:
1. Check for typos in Client ID/Secret
2. Verify no extra spaces
3. Confirm credentials from Spotify Dashboard
4. Make sure app is not in development mode

### "Redirect URI mismatch"
**Solution**: In Spotify Developer Dashboard:
1. Go to your app → Settings
2. Add exactly: `http://localhost:8888/callback`
3. Save changes

### "Cannot connect to backend"
**Solutions**:
1. Make sure backend is running: `cd Backend && python app.py`
2. Check if port 5000 is available
3. Verify `Client/.env` has correct API URL
4. Check firewall settings

### "Downloads fail or are slow"
**Solutions**:
1. Check internet connection
2. Verify Spotify credentials
3. Update SpotDL: `pip install --upgrade spotdl`
4. Some tracks may not be on YouTube
5. Try a different track first

### "Track not found"
**Reasons**:
- Song not available on YouTube
- Song title/artist mismatch
- Region restrictions
- Removed from YouTube

**Solution**: Try a different track or adjust search terms

### "No metadata on downloaded files"
**Solutions**:
1. Verify Spotify credentials are correct
2. Try preloading metadata first
3. Update SpotDL
4. Check Spotify API status

---

## 🔒 Security & Privacy

### Where are my credentials stored?
Locally only:
- `Backend/.env` - Encrypted by your OS
- `Backend/config.json` - On your computer
- Never sent anywhere except Spotify API

### Is my data tracked?
**No!** GroveGrab:
- ❌ No telemetry
- ❌ No analytics
- ❌ No cloud storage
- ❌ No data collection
- ✅ 100% local

### Can I delete my data?
Yes, simply:
1. Delete `Backend/.env`
2. Delete `Backend/config.json`
3. Delete the GroveGrab folder

### Should I commit .env files to Git?
**Never!** The `.gitignore` prevents this, but:
- ❌ Don't commit `.env` files
- ❌ Don't share credentials
- ❌ Don't post screenshots with credentials
- ✅ Keep backups securely offline

---

## 📦 Desktop App Questions

### How do I create a desktop app?
```powershell
cd Client
npm install --save-dev electron electron-builder concurrently wait-on
npm run electron:build
```

### Does the desktop app need Python/Node?
The packaged app bundles everything, but you still need:
- ✅ FFmpeg installed separately
- ✅ Internet connection

### Can I distribute the desktop app?
For personal use only. Don't distribute due to:
- Legal concerns
- Spotify/YouTube ToS
- Copyright restrictions

---

## 🎨 Customization

### Can I change the theme?
Yes! Dark mode toggle is in the navbar.

### Can I change download paths?
Yes, three ways:
1. Settings modal (⚙️)
2. Per-download in the form
3. Edit `Backend/.env`

### Can I change the UI?
Yes! Edit files in `Client/src/components/`
- React + Tailwind CSS
- Well-documented code
- Easy to customize

### Can I add features?
Absolutely! The code is:
- ✅ Well-structured
- ✅ Commented
- ✅ Modular
- ✅ Open for extension

---

## 🔧 Advanced

### Can I run on a different port?
**Backend**: Edit `Backend/.env`
```env
FLASK_PORT=8000
```

**Frontend**: Vite auto-assigns next available port

Then update `Client/.env`:
```env
VITE_API_URL=http://localhost:8000
```

### Can I use a database?
Currently uses in-memory storage. You can add:
- SQLite for local storage
- PostgreSQL for advanced features
- MongoDB for flexible schema

### Can I add authentication?
Yes! You can add:
- User accounts
- Login system
- Multi-user support
- Cloud sync

### Can I deploy this online?
⚠️ **Not recommended** due to:
- Legal concerns
- Spotify/YouTube ToS violations
- Bandwidth costs
- Copyright issues

Use for personal, local use only.

### Can I integrate with cloud storage?
Yes! You can add:
- Dropbox integration
- Google Drive sync
- OneDrive backup
- S3 storage

See `PROJECT_SUMMARY.md` for extension ideas.

---

## 📊 Performance

### How many downloads can run simultaneously?
Currently: 1 at a time (can be changed)

To modify: Edit `download_manager.py` and add queue management.

### Can I schedule downloads?
Not currently, but you can add:
- Task scheduler
- Queue system
- Time-based downloads

### Can I pause/resume downloads?
Not currently. Downloads are either:
- Running
- Completed
- Failed (can retry)
- Cancelled

---

## 🆘 Getting Help

### Where do I find documentation?
- `README.md` - Main overview
- `SETUP_GUIDE.md` - Detailed setup
- `QUICK_REFERENCE.md` - Commands
- `PROJECT_SUMMARY.md` - What was built
- `WORKFLOW.md` - How it works
- `FAQ.md` - This file!

### How do I report bugs?
Check:
1. Task logs (click 📄 icon)
2. Backend terminal output
3. Browser console (F12)
4. `SETUP_GUIDE.md` troubleshooting section

### How do I get more help?
1. Read all documentation files
2. Check troubleshooting sections
3. Review error messages carefully
4. Test with simple track first
5. Verify all prerequisites

---

## 🎓 Learning Resources

### How does SpotDL work?
SpotDL:
1. Gets metadata from Spotify API
2. Searches for song on YouTube
3. Downloads audio from YouTube
4. Converts with FFmpeg
5. Embeds metadata

Learn more: https://github.com/spotDL/spotify-downloader

### What technologies are used?
**Backend**:
- Python 3.8+
- Flask (web framework)
- SpotDL (downloader)

**Frontend**:
- React 19 (UI)
- Vite (build tool)
- Tailwind CSS (styling)

**Desktop**:
- Electron (wrapper)

### Can I contribute?
This is a personal project, but you can:
- Fork and customize
- Learn from the code
- Build your own version
- Add features you need

---

## 💡 Tips & Tricks

### Best Practices
1. **Test first**: Try a single track before downloading playlists
2. **Use preload**: Check metadata before downloading
3. **Organize**: Set custom download paths per playlist
4. **Monitor logs**: Check logs if something seems wrong
5. **Update regularly**: Keep SpotDL updated

### Power User Tips
1. Create shortcuts for common tasks
2. Use specific audio formats per genre
3. Organize downloads by playlists
4. Backup your `.env` files
5. Use dark mode at night 😎

### Optimization
1. Close other programs for faster conversion
2. Use SSD for faster file writes
3. Hardwire internet (no Wi-Fi) for stability
4. Download during off-peak hours

---

## 🔮 Future Features

### Planned
- [ ] Download scheduler
- [ ] Batch operations
- [ ] Download history
- [ ] Playlist comparison
- [ ] Cloud storage integration

### Ideas
- [ ] Mobile app
- [ ] Browser extension
- [ ] Lyrics integration
- [ ] Auto-tagging
- [ ] Duplicate detection

Want to add a feature? Fork and customize!

---

## 📞 Quick Links

| Resource | Link |
|----------|------|
| Spotify Dashboard | https://developer.spotify.com/dashboard |
| SpotDL GitHub | https://github.com/spotDL/spotify-downloader |
| FFmpeg | https://ffmpeg.org/download.html |
| Python | https://python.org/downloads |
| Node.js | https://nodejs.org |

---

## ✅ Quick Checklist

- [ ] Read `GETTING_STARTED.md` for 5-min setup
- [ ] Got Spotify API credentials
- [ ] Installed Python, Node.js, FFmpeg
- [ ] Ran setup scripts
- [ ] Configured `.env` files
- [ ] Started both servers
- [ ] Tested with a single track
- [ ] Everything working!

---

**Still have questions?**

Check the other documentation files or review the troubleshooting sections!

**Happy downloading! 🎵**
