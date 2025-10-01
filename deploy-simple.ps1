# Deploy script for Lambda function
$ErrorActionPreference = "Stop"

Write-Host "Building Lambda deployment package..." -ForegroundColor Green

# Remove existing deploy directory and recreate
if (Test-Path "deploy") {
    Remove-Item -Recurse -Force "deploy"
}
New-Item -ItemType Directory -Name "deploy"

# Copy compiled JS files
Copy-Item -Recurse "dist\*" "deploy\"

# Create production package.json in deploy directory
$packageContent = @"
{
  "name": "fast-food-auth-lambda",
  "version": "0.1.0",
  "main": "index.js",
  "dependencies": {}
}
"@

$packageContent | Out-File -FilePath "deploy\package.json" -Encoding UTF8

# Create ZIP package
if (Test-Path "deploy\fast-food-auth-lambda.zip") {
    Remove-Item "deploy\fast-food-auth-lambda.zip"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory("$PWD\deploy", "$PWD\deploy\fast-food-auth-lambda.zip")

Write-Host "Lambda package created successfully!" -ForegroundColor Cyan
Write-Host "Package location: deploy\fast-food-auth-lambda.zip" -ForegroundColor Cyan
