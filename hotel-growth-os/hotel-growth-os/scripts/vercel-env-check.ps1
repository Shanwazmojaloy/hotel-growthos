param (
    [string]$TeamId
)

# Read token from .env.local if not set in session
if (-not $env:VERCEL_TOKEN -and (Test-Path ".env.local")) {
    Get-Content .env.local | Where-Object { $_ -and -not$_.StartsWith('#') } | ForEach-Object {
        $key, $val =$_ -split '=', 2
        if ($key.Trim() -eq "VERCEL_TOKEN") {
            $env:VERCEL_TOKEN =$val.Trim()
        }
    }
}

if (-not $env:VERCEL_TOKEN) {
    Write-Error "VERCEL_TOKEN is missing. Set `$env:VERCEL_TOKEN or add VERCEL_TOKEN=... in .env.local"
    return
}

# Clean any hidden CRLF or quote characters from header string
$cleanToken = $env:VERCEL_TOKEN.Trim().Replace("`r", "").Replace("`n", "").Trim('"').Trim("'")

$queryStr = ""
if ($TeamId) {
    $queryStr = "?teamId=$TeamId"
}

try {
    Write-Host "Fetching projects from Vercel..." -ForegroundColor Cyan
    $projects = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects$queryStr" -Headers @{ Authorization = "Bearer $cleanToken" }
    $project = $projects.projects | Where-Object { $_.name -eq "hotel-growthos" }

    if (-not $project) {
        Write-Host "Project 'hotel-growthos' not found." -ForegroundColor Yellow
        Write-Host "Available projects: $($projects.projects.name -join ', ')" -ForegroundColor Gray
        return
    }

    $PID_VAL = $project.id
    Write-Host "Project ID: $PID_VAL" -ForegroundColor Green

    # Get Environment Variables
    $envList = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$PID_VAL/env$queryStr" -Headers @{ Authorization = "Bearer $cleanToken" }
    Write-Host "`nEnvironment Variables:" -ForegroundColor Yellow
    $envList.envs | ForEach-Object { Write-Host " - $($_.key) [$($_.target -join ',')]" }

} catch {
    Write-Error "API Request Failed: $($_.Exception.Message)"
}
