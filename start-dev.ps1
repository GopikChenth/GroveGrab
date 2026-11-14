$rootDir = $PSScriptRoot

Write-Host "🚀 Starting GroveGrab..."

$backendDir = Join-Path $rootDir "Backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendDir'; python app.py"

Start-Sleep -Seconds 2

$clientDir = Join-Path $rootDir "Client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientDir'; npm run dev"

Write-Host "Backend: http://localhost:5000"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
