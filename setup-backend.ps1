# Python Backend Setup Script for GroveGrab

Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host "🎵 GroveGrab Backend Setup"
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..."
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion"
} catch {
    Write-Host "❌ Python is not installed or not in PATH"
    Write-Host "Please install Python from https://www.python.org/downloads/"
    exit 1
}

# Navigate to Backend directory
$backendDir = Join-Path $PSScriptRoot "Backend"
Set-Location $backendDir

# Check if requirements.txt exists
if (-Not (Test-Path "requirements.txt")) {
    Write-Host "❌ requirements.txt not found"
    exit 1
}

# Create virtual environment (optional but recommended)
Write-Host ""
Write-Host "Would you like to create a virtual environment? (Y/N)"
$createVenv = Read-Host
if ($createVenv -eq "Y" -or $createVenv -eq "y") {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    Write-Host "✅ Virtual environment created"
    
    Write-Host "Activating virtual environment..."
    & ".\venv\Scripts\Activate.ps1"
    Write-Host "✅ Virtual environment activated"
}

# Install Python dependencies
Write-Host ""
Write-Host "Installing Python dependencies..."
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully"
} else {
    Write-Host "❌ Failed to install dependencies"
    exit 1
}

# Check if FFmpeg is installed
Write-Host ""
Write-Host "Checking FFmpeg installation..."
try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-String "ffmpeg version" | Select-Object -First 1
    Write-Host "✅ FFmpeg found: $ffmpegVersion"
} catch {
    Write-Host "⚠️ FFmpeg is not installed or not in PATH"
    Write-Host "SpotDL requires FFmpeg to convert audio files."
    Write-Host "Install FFmpeg using one of these methods:"
    Write-Host "  1. Chocolatey: choco install ffmpeg"
    Write-Host "  2. Download from: https://ffmpeg.org/download.html"
}

# Check if .env exists
Write-Host ""
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..."
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created"
    Write-Host ""
    Write-Host "⚠️ IMPORTANT: Edit .env and add your Spotify API credentials"
    Write-Host "   Get them from: https://developer.spotify.com/dashboard"
} else {
    Write-Host "✅ .env file already exists"
}

Write-Host ""
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host "✅ Backend setup complete!"
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Edit Backend\.env with your Spotify API credentials"
Write-Host "  2. Run: cd Backend"
Write-Host "  3. Run: python app.py"
Write-Host ""
