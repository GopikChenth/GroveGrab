# Start both Backend and Frontend servers

Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host "🚀 Starting GroveGrab Application"
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host ""

$rootDir = $PSScriptRoot

# Start Backend server in a new window
Write-Host "Starting Backend server..."
$backendDir = Join-Path $rootDir "Backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; python app.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 2

# Start Frontend dev server in a new window
Write-Host "Starting Frontend dev server..."
$clientDir = Join-Path $rootDir "Client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientDir'; npm run dev"

Write-Host ""
Write-Host "✅ Both servers are starting in separate windows"
Write-Host ""
Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5173 (or check the frontend window)"
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
