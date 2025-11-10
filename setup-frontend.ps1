# Frontend Setup Script for GroveGrab

Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host "🎨 GroveGrab Frontend Setup"
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..."
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion"
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH"
    Write-Host "Please install Node.js from https://nodejs.org/"
    exit 1
}

# Check if npm is installed
Write-Host "Checking npm installation..."
try {
    $npmVersion = npm --version 2>&1
    Write-Host "✅ npm found: $npmVersion"
} catch {
    Write-Host "❌ npm is not installed"
    exit 1
}

# Navigate to Client directory
$clientDir = Join-Path $PSScriptRoot "Client"
Set-Location $clientDir

# Install npm dependencies
Write-Host ""
Write-Host "Installing npm dependencies..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully"
} else {
    Write-Host "❌ Failed to install dependencies"
    exit 1
}

# Check if .env exists
Write-Host ""
if (-Not (Test-Path ".env")) {
    Write-Host "Creating .env file..."
    "VITE_API_URL=http://localhost:5000" | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created"
} else {
    Write-Host "✅ .env file already exists"
}

Write-Host ""
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host "✅ Frontend setup complete!"
Write-Host "=" -NoNewline; Write-Host ("=" * 59)
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Run: cd Client"
Write-Host "  2. Run: npm run dev"
Write-Host ""
