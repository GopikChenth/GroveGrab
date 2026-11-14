$backendDir = Join-Path $PSScriptRoot "Backend"
Set-Location $backendDir

try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion"
} catch {
    Write-Host "❌ Python is not installed or not in PATH"
    exit 1
}

if (-Not (Test-Path "requirements.txt")) {
    Write-Host "❌ requirements.txt not found"
    exit 1
}

Write-Host "Would you like to create a virtual environment? (Y/N)"
$createVenv = Read-Host
if ($createVenv -eq "Y" -or $createVenv -eq "y") {
    python -m venv venv
    & ".\venv\Scripts\Activate.ps1"
}

pip install -r requirements.txt

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies"
    exit 1
}

try {
    $ffmpegVersion = ffmpeg -version 2>&1 | Select-String "ffmpeg version" | Select-Object -First 1
    Write-Host "✅ FFmpeg found: $ffmpegVersion"
} catch {
    Write-Host "⚠️ FFmpeg is not installed or not in PATH (required by SpotDL for audio conversion)"
}

if (-Not (Test-Path ".env") -and (Test-Path ".env.example")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created"
}

Write-Host "✅ Backend setup complete!"
