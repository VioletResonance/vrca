# Define file and directory names
$HTML_FILE = "avatars.html"
$IMG_DIR = "images"

# Create image directory if it doesn't exist
if (-not (Test-Path $IMG_DIR)) {
  New-Item -ItemType Directory -Path $IMG_DIR | Out-Null
}

if (-not (Test-Path $HTML_FILE)) {
  Write-Host "[!] HTML file not found: $HTML_FILE"
  exit 1
}

$REPLACEMENTS = @()

Write-Host "[~] Searching for avatar tokens..."

# Extract unique urls with tokens from HTML file
$avatar_tokens = Select-String -Path $HTML_FILE -Pattern '/go/vrchat/[A-Za-z0-9_-]+' | ForEach-Object { $_.Matches.Value -replace '^/go/vrchat/', '' } | Sort-Object -Unique

if ($avatar_tokens.Count -eq 0) {
  Write-Host "[!] Avatar tokens not found"
  exit 0
}

foreach ($avatar_token in $avatar_tokens) {
  Write-Host "[+] Avatar token: $avatar_token"

  # Resolve redirect to VRChat avatar
  $avatar_url = (Invoke-WebRequest -Uri "https://vrcdb.com/go/vrchat/$avatar_token").BaseResponse.ResponseUri.AbsoluteUri

  # Extract avatar ID
  $avatar_id = if ($avatar_url -match 'avtr_[^/?]*') { $matches[0] } else { $null }

  if (-not $avatar_id) {
    Write-Host "[!] Failed extracting avatar ID: $avatar_token"
    continue
  }

  Write-Host "[+] Avatar ID: $avatar_id"

  $avatar_image_path = Join-Path $IMG_DIR "$avatar_id.webp"

  if ((Test-Path $avatar_image_path -PathType Leaf) -and (Get-Item $avatar_image_path).Length -gt 0) {
    Write-Host "[=] Image already exists"
  }
  else {
    Write-Host "[>] Downloading image..."

    Invoke-WebRequest -Uri "https://vrcdb.com/img/avatar?token=$avatar_token" -OutFile $avatar_image_path -Headers @{
      "User-Agent" = "Mozilla/5.0";
      "Referer" = "https://vrcdb.com/"
    }
  }

  $REPLACEMENTS += @{Pattern = "/go/vrchat/$avatar_token"; Replace = $avatar_url}
  $REPLACEMENTS += @{Pattern = "/img/avatar?token=$avatar_token"; Replace = $avatar_image_path}

  Start-Sleep -Milliseconds 500
}

# Replace avatar redirect URL with resolved link and remote image URL with local path
Write-Host "[~] Updating links..."

$html = Get-Content $HTML_FILE -Raw

foreach ($r in $REPLACEMENTS) {$html = $html.Replace($($r.Pattern), $($r.Replace))}

Set-Content -Path "$HTML_FILE.tmp" -Value $html

Move-Item -Path "$HTML_FILE.tmp" -Destination $HTML_FILE -Force

Write-Host "[v] HTML updated: $HTML_FILE"
