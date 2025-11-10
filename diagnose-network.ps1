# GroveGrab Network Diagnostic Tool
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   GroveGrab Network Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Internet Connectivity
Write-Host "[1/6] Testing internet connectivity..." -ForegroundColor Yellow
$pingGoogle = Test-Connection -ComputerName google.com -Count 2 -Quiet
if ($pingGoogle) {
    Write-Host "  ✓ Internet connection: OK" -ForegroundColor Green
} else {
    Write-Host "  ✗ Internet connection: FAILED" -ForegroundColor Red
    Write-Host "    → Check your network connection" -ForegroundColor Red
}
Write-Host ""

# Test 2: DNS Resolution
Write-Host "[2/6] Testing DNS resolution..." -ForegroundColor Yellow
try {
    $dnsSpotify = Resolve-DnsName api.spotify.com -ErrorAction Stop
    Write-Host "  ✓ Spotify API DNS: OK ($($dnsSpotify[0].IPAddress))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Spotify API DNS: FAILED" -ForegroundColor Red
    Write-Host "    → Try changing DNS to 8.8.8.8 (Google DNS)" -ForegroundColor Red
}

try {
    $dnsYouTube = Resolve-DnsName music.youtube.com -ErrorAction Stop
    Write-Host "  ✓ YouTube Music DNS: OK ($($dnsYouTube[0].IPAddress))" -ForegroundColor Green
} catch {
    Write-Host "  ✗ YouTube Music DNS: FAILED" -ForegroundColor Red
    Write-Host "    → Try changing DNS to 8.8.8.8 (Google DNS)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Current DNS Servers
Write-Host "[3/6] Checking current DNS servers..." -ForegroundColor Yellow
$dnsServers = Get-DnsClientServerAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" }
foreach ($dns in $dnsServers) {
    if ($dns.ServerAddresses.Count -gt 0) {
        Write-Host "  Interface: $($dns.InterfaceAlias)" -ForegroundColor Cyan
        foreach ($server in $dns.ServerAddresses) {
            Write-Host "    DNS Server: $server" -ForegroundColor White
        }
    }
}
Write-Host ""

# Test 4: Backend Server
Write-Host "[4/6] Checking backend server..." -ForegroundColor Yellow
try {
    $backend = Invoke-WebRequest -Uri "http://localhost:5000/health" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✓ Backend server: RUNNING" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Backend server: NOT RESPONDING" -ForegroundColor Red
    Write-Host "    → Start backend: cd Backend; .\.venv\Scripts\Activate.ps1; python app.py" -ForegroundColor Red
}
Write-Host ""

# Test 5: Frontend Server
Write-Host "[5/6] Checking frontend server..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  ✓ Frontend server: RUNNING" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Frontend server: NOT RESPONDING" -ForegroundColor Red
    Write-Host "    → Start frontend: cd Client; npm run dev" -ForegroundColor Red
}
Write-Host ""

# Test 6: Port Check
Write-Host "[6/6] Checking port availability..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "  ℹ Port 5000 (Backend): IN USE (PID: $($port5000.OwningProcess))" -ForegroundColor Cyan
} else {
    Write-Host "  ℹ Port 5000 (Backend): AVAILABLE" -ForegroundColor Yellow
}

$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host "  ℹ Port 5173 (Frontend): IN USE (PID: $($port5173.OwningProcess))" -ForegroundColor Cyan
} else {
    Write-Host "  ℹ Port 5173 (Frontend): AVAILABLE" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Diagnostic Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$allGood = $pingGoogle -and $dnsSpotify -and $dnsYouTube

if ($allGood) {
    Write-Host "✓ All network tests passed!" -ForegroundColor Green
    Write-Host "  Your system is ready to download." -ForegroundColor Green
} else {
    Write-Host "✗ Some issues detected" -ForegroundColor Red
    Write-Host ""
    Write-Host "Recommended fixes:" -ForegroundColor Yellow
    Write-Host "  1. Change DNS to Google DNS (8.8.8.8)" -ForegroundColor White
    Write-Host "  2. Run: ipconfig /flushdns" -ForegroundColor White
    Write-Host "  3. Restart your network adapter" -ForegroundColor White
    Write-Host "  4. Check firewall/antivirus settings" -ForegroundColor White
    Write-Host ""
    Write-Host "For detailed instructions, see: TROUBLESHOOTING.md" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
