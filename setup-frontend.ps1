$clientDir = Join-Path $PSScriptRoot "Client"
Set-Location $clientDir

try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js found: $nodeVersion"
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH"
    exit 1
}

npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies"
    exit 1
}

if (-Not (Test-Path ".env")) {
    "VITE_API_URL=http://localhost:5000" | Out-File -FilePath ".env" -Encoding utf8
    Write-Host "✅ .env file created"
}

Write-Host "✅ Frontend setup complete!"
