# Evaluate node -v and check if it is greater or equal to 17.0.0

$nodeVersion = node -v
$nodeVersion = $nodeVersion -replace "v", ""

# debug print out the node version
# Write-Host "Node version: $nodeVersion"

# Change the directory to the folder where the script is located
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath

if ($nodeVersion -ge "17.0.0") {
    $env:NODE_OPTIONS = "--openssl-legacy-provider"
    Write-Host "Node version is greater than or equal to 17.0.0"
}

# Check if node_modules folder exists
if (Test-Path -Path "node_modules") {
    Write-Host "node_modules folder exists"
} else {
    Write-Host "node_modules folder does not exist"
    Write-Host "Installing node_modules"
    npm install
}

# Run npm start
npm start
