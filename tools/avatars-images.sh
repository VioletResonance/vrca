#!/bin/bash

# Define file and directory names
HTML_FILE="avatars.html"                              # Source HTML file
TMP_FILE="avatars-tmp.html"                           # Temporary file for edited HTML
IMG_DIR="images"                                      # Directory to store downloaded images

# Create image directory if it doesn't exist
mkdir -p "$IMG_DIR"

echo "[~] Image search..."

# Extract unique image URLs from HTML file and iterate over them
grep -o 'https://thumb\.avtrdb\.com/avtr_[^"]*\.webp' "$HTML_FILE" | sort -u | while read -r url; do

  filename=$(basename "$url")                         # Get filename from URL
  local_path="$IMG_DIR/$filename"                     # Define local path to save image

  if [ -f "$local_path" ]; then
    echo "[=] Already exist: $filename"               # Skip if already downloaded
  else
    echo "[>] Downloading: $filename"                 # Otherwise, download the image
    curl -s -L "$url" \
      -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0" \
      -H "Accept: image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5" \
      -H "Accept-Encoding: gzip, deflate, br, zstd" \
      -H "Accept-Language: en-US,en;q=0.5" \
      -H "Host: thumb.avtrdb.com" \
      -H "Referer: https://vrcdb.com/" \
      -H "DNT: 1" \
      -H "Sec-GPC: 1" \
      -o "$local_path"
  fi
done

# Replace all remote image URLs in HTML with local paths
echo "[~] Replacing links in HTML..."
sed "s|https://thumb.avtrdb.com/|$IMG_DIR/|g" "$HTML_FILE" > "$TMP_FILE"

# Overwrite original HTML file with updated version
mv "$TMP_FILE" "$HTML_FILE"

echo "[v] Updated HTML saved: $HTML_FILE"
