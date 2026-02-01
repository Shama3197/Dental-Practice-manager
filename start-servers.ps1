# Function to check if a port is in use
function Test-PortInUse {
    param($port)
    $connection = New-Object System.Net.Sockets.TcpClient
    try {
        $connection.Connect("127.0.0.1", $port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to check MongoDB connection
function Test-MongoDBConnection {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method GET -UseBasicParsing
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

# Function to start backend server
function Start-BackendServer {
    Write-Host "Starting backend server..." -ForegroundColor Cyan
    Set-Location -Path "tracker-backend"
    
    # Check if MongoDB is running
    if (Test-PortInUse -port 27017) {
        Write-Host "MongoDB is running" -ForegroundColor Green
    } else {
        Write-Host "Warning: MongoDB might not be running. Please ensure MongoDB is started." -ForegroundColor Yellow
    }
    
    # Start the backend server
    try {
        $env:NODE_ENV = "development"
        npm start
    }
    catch {
        Write-Host "Error starting backend server: $_" -ForegroundColor Red
        exit 1
    }
}

# Function to start frontend server
function Start-FrontendServer {
    Write-Host "Starting frontend server..." -ForegroundColor Cyan
    Set-Location -Path "tracker-frontend"
    
    # Check if backend is running
    $maxAttempts = 5
    $attempt = 0
    $backendReady = $false
    
    while (-not $backendReady -and $attempt -lt $maxAttempts) {
        $attempt++
        Write-Host "Waiting for backend server... Attempt $attempt of $maxAttempts" -ForegroundColor Yellow
        Start-Sleep -Seconds 5
        $backendReady = Test-MongoDBConnection
    }
    
    if (-not $backendReady) {
        Write-Host "Warning: Backend server might not be ready. Frontend will start anyway." -ForegroundColor Yellow
    }
    
    # Start the frontend server
    try {
        $env:NODE_ENV = "development"
        npm run dev
    }
    catch {
        Write-Host "Error starting frontend server: $_" -ForegroundColor Red
        exit 1
    }
}

# Main script execution
Write-Host "Starting Dental Practice Manager servers..." -ForegroundColor Green

# Start backend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD'; .\start-servers.ps1 -BackendOnly"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 5

# Start frontend server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD'; .\start-servers.ps1 -FrontendOnly"

# If no parameters provided, show help
if ($args.Count -eq 0) {
    Write-Host "`nServers started in separate windows. Close the windows to stop the servers." -ForegroundColor Green
    Write-Host "Frontend will be available at: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
    exit
}

# Handle parameters for individual server starts
if ($args[0] -eq "-BackendOnly") {
    Start-BackendServer
}
elseif ($args[0] -eq "-FrontendOnly") {
    Start-FrontendServer
} 