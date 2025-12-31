# Define file and directory names
$HTML_FILE = "avatars.html"                           # Source HTML file
$TMP_FILE = "avatars-tmp.html"                        # Temporary file for edited HTML
$IMG_DIR = "images"                                   # Directory to store downloaded images

# Create image directory if it doesn't exist
if (-not (Test-Path $IMG_DIR)) {
  New-Item -ItemType Directory -Path $IMG_DIR
}

Write-Host "[~] Image search..."

# Extract unique image URLs from HTML file and iterate over them
$urls = Select-String -Path $HTML_FILE -Pattern 'https://thumb\.avtrdb\.com/avtr_[^"]*\.webp' |
        ForEach-Object { $_.Matches.Value } | Sort-Object -Unique

foreach ($url in $urls) {
  $filename = [System.IO.Path]::GetFileName($url)     # Get filename from URL
  $local_path = Join-Path $IMG_DIR $filename          # Define local path to save image

  if (Test-Path $local_path) {
    Write-Host "[=] Already exist: $filename"         # Skip if already downloaded
  } else {
    Write-Host "[>] Downloading: $filename"           # Otherwise, download the image
    Invoke-WebRequest -Uri $url -OutFile $local_path -Headers @{
      'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0'
      'Accept' = 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5'
      'Accept-Encoding' = 'gzip, deflate, br, zstd'
      'Accept-Language' = 'en-US,en;q=0.5'
      'Host' = 'thumb.avtrdb.com'
      'Referer' = 'https://vrcdb.com/'
      'DNT' = '1'
      'Sec-GPC' = '1'
    }
  }
}

# Replace all remote image URLs in HTML with local paths
Write-Host "[~] Replacing links in HTML..."
(Get-Content $HTML_FILE) | ForEach-Object { $_ -replace 'https://thumb.avtrdb.com/', "$IMG_DIR/" } | Set-Content $TMP_FILE

# Overwrite original HTML file with updated version
Move-Item -Force -Path $TMP_FILE -Destination $HTML_FILE

Write-Host "[v] Updated HTML saved: $HTML_FILE"
