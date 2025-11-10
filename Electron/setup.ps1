# GroveGrab Electron Setup Script
# Installs dependencies and prepares for development

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   GroveGrab Electron Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/5] Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  OK - Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR - Node.js not found!" -ForegroundColor Red
    Write-Host "  Install from: https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Install npm dependencies
Write-Host "[2/5] Installing npm dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "  OK - Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ERROR - Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Check if backend is ready
Write-Host "[3/5] Checking backend..." -ForegroundColor Yellow
$backendPath = "..\Backend"
if (Test-Path "$backendPath\.venv") {
    Write-Host "  OK - Backend virtual environment found" -ForegroundColor Green
} else {
    Write-Host "  WARNING - Backend not set up" -ForegroundColor Yellow
    Write-Host "  Run this in Backend folder:" -ForegroundColor Yellow
    Write-Host "    python -m venv .venv" -ForegroundColor White
    Write-Host "    .venv\Scripts\activate" -ForegroundColor White
    Write-Host "    pip install -r requirements.txt" -ForegroundColor White
}
Write-Host ""

# Check if frontend is built
Write-Host "[4/5] Checking frontend..." -ForegroundColor Yellow
$frontendDist = "..\Client\dist"
if (Test-Path $frontendDist) {
    Write-Host "  OK - Frontend dist found" -ForegroundColor Green
} else {
    Write-Host "  INFO - Building frontend..." -ForegroundColor Cyan
    Push-Location "..\Client"
    npm install
    npm run build
    Pop-Location
    if (Test-Path $frontendDist) {
        Write-Host "  OK - Frontend built successfully" -ForegroundColor Green
    } else {
        Write-Host "  ERROR - Frontend build failed" -ForegroundColor Red
    }
}
Write-Host ""

# Check for logo
Write-Host "[5/5] Checking assets..." -ForegroundColor Yellow
if (Test-Path "assets\icon.png") {
    Write-Host "  OK - Logo found (icon.png)" -ForegroundColor Green
} else {
    Write-Host "  INFO - Logo not found" -ForegroundColor Cyan
    Write-Host "  Place your logo in: assets\icon.png (512x512 recommended)" -ForegroundColor Cyan
    Write-Host "  You can use the GroveGrab logo provided" -ForegroundColor Cyan
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Add your logo to assets\icon.png" -ForegroundColor White
Write-Host "  2. Run: npm start (to test)" -ForegroundColor White
Write-Host "  3. Run: npm run build:win (to build)" -ForegroundColor White
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Yellow
Write-Host "  See README.md for full instructions" -ForegroundColor White
Write-Host ""
