# GroveGrab Troubleshooting Guide

## 🔴 Network/DNS Errors

### Problem: DNS Resolution Failed
**Error messages you might see:**
- `Failed to resolve 'api.spotify.com'`
- `Failed to resolve 'music.youtube.com'`
- `[Errno 11001] getaddrinfo failed`
- `ConnectionResetError`

### Solution:

#### 1. **Check Your Internet Connection**
- Make sure you're connected to the internet
- Try opening a web browser and visiting a website
- Ping test: Open PowerShell and run:
  ```powershell
  ping google.com
  ping api.spotify.com
  ```

#### 2. **DNS Issues - Change DNS Server**
If ping fails for specific domains, your DNS server might be blocking them:

**Option A: Use Google DNS (8.8.8.8)**
1. Open **Control Panel** → **Network and Sharing Center**
2. Click your network connection → **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**
4. Choose **Use the following DNS server addresses:**
   - Preferred DNS: `8.8.8.8`
   - Alternate DNS: `8.8.4.4`
5. Click **OK** and restart your connection

**Option B: Use Cloudflare DNS (1.1.1.1)**
- Preferred DNS: `1.1.1.1`
- Alternate DNS: `1.0.0.1`

**Quick PowerShell Fix (Run as Administrator):**
```powershell
# Set DNS to Google DNS
netsh interface ip set dns "Wi-Fi" static 8.8.8.8
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

# Flush DNS cache
ipconfig /flushdns
```

#### 3. **Firewall/Antivirus Blocking**
- Temporarily disable Windows Firewall/Antivirus to test
- Add exceptions for:
  - `api.spotify.com`
  - `music.youtube.com`
  - `youtube.com`

#### 4. **VPN/Proxy Issues**
- If using VPN, try disconnecting and reconnecting
- Disable any proxy settings
- Check if your network/ISP blocks Spotify/YouTube

#### 5. **Flush DNS and Reset Network**
```powershell
# Run as Administrator
ipconfig /flushdns
ipconfig /release
ipconfig /renew
netsh winsock reset
netsh int ip reset
# Restart computer
```

---

## 🔴 Backend Server Not Running

### Problem: Frontend shows "Failed to fetch" errors

### Solution:

#### 1. **Restart Backend Server**
```powershell
cd "S:\Web Projects\GroveGrab\Backend"
.\.venv\Scripts\Activate.ps1
python app.py
```

#### 2. **Check if Port 5000 is Already in Use**
```powershell
netstat -ano | findstr :5000
```
If something is using port 5000, kill it:
```powershell
# Get PID from netstat output, then:
taskkill /PID <PID_NUMBER> /F
```

---

## 🔴 No Progress/Updates Showing

### Problem: Download starts but UI doesn't update

### Solution:

1. **Check Browser Console** (F12)
   - Look for error messages
   - Check Network tab for failed requests

2. **Verify Backend is Running**
   - Backend terminal should show active logs
   - Visit http://localhost:5000/health in browser
   - Should see: `{"status": "ok"}`

3. **Hard Refresh Frontend**
   - Press `Ctrl + Shift + R` (Chrome/Edge)
   - Or clear cache and reload

4. **Check CORS Configuration**
   - Backend should have `flask-cors` installed
   - `app.py` should have CORS enabled

---

## 🔴 SpotDL Command Fails

### Problem: Downloads fail immediately

### Solution:

1. **Verify SpotDL Installation**
```powershell
.\.venv\Scripts\Activate.ps1
spotdl --version
```

2. **Test SpotDL Manually**
```powershell
spotdl "https://open.spotify.com/track/..." --client-id YOUR_ID --client-secret YOUR_SECRET
```

3. **Reinstall SpotDL**
```powershell
pip uninstall spotdl
pip install spotdl
```

4. **Check FFmpeg**
```powershell
ffmpeg -version
```
If not found, install FFmpeg and add to PATH

---

## 🔴 Credentials Not Working

### Problem: "Please configure your Spotify API credentials"

### Solution:

1. **Verify Credentials in Settings**
   - Click Settings icon in navbar
   - Ensure Client ID and Client Secret are filled
   - Click "Save Configuration"

2. **Get New Credentials**
   - Visit: https://developer.spotify.com/dashboard
   - Create new app or use existing
   - Copy Client ID and Client Secret
   - Add `http://localhost:8888/callback` to Redirect URIs

3. **Check Backend Config**
   - File: `Backend/config.json`
   - Should contain your credentials
   - Verify `has_credentials: true`

---

## 🔴 Downloads Go to Wrong Folder

### Problem: Can't find downloaded files

### Solution:

1. **Check Download Path in Settings**
   - Default: `M:\Songs` (from your .env)
   - Change in Settings modal

2. **Verify Folder Exists**
   - Create folder manually if needed
   - Ensure you have write permissions

3. **Check Task Details**
   - In Download Queue, each task shows download path
   - Click "View Logs" to see exact location

---

## 📝 Quick Restart Guide

### Full System Restart:

```powershell
# 1. Stop everything
# Press Ctrl+C in both terminals

# 2. Restart Backend
cd "S:\Web Projects\GroveGrab\Backend"
.\.venv\Scripts\Activate.ps1
python app.py

# 3. Restart Frontend (in new terminal)
cd "S:\Web Projects\GroveGrab\Client"
npm run dev

# 4. Open browser
# Visit: http://localhost:5173
```

---

## 🆘 Still Having Issues?

### Collect Debug Information:

1. **Backend Logs**
   - Copy all output from backend terminal
   - Check `Backend/logs/*.txt` files

2. **Browser Console**
   - Press F12 → Console tab
   - Copy all error messages

3. **Network Status**
   ```powershell
   ping api.spotify.com
   nslookup api.spotify.com
   ipconfig /all
   ```

4. **System Info**
   - Windows version
   - Python version: `python --version`
   - Node version: `node --version`

---

## ✅ Prevention Tips

1. **Use Stable Internet Connection**
   - Wired connection is more stable than Wi-Fi
   - Avoid downloads during network congestion

2. **Keep Dependencies Updated**
   ```powershell
   pip install --upgrade spotdl flask flask-cors
   ```

3. **Monitor System Resources**
   - SpotDL can be memory-intensive
   - Close other heavy applications

4. **Regular Backups**
   - Config file: `Backend/config.json`
   - Downloaded songs folder

---

## 📚 Useful Commands

```powershell
# Check if backend is responding
curl http://localhost:5000/health

# Check if frontend is running
curl http://localhost:5173

# View all Python packages
pip list

# Check port usage
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Restart network adapter
netsh interface set interface "Wi-Fi" disabled
netsh interface set interface "Wi-Fi" enabled
```
