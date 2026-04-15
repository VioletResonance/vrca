#!/bin/bash
set -euo pipefail

# Define file and directory names
HTML_FILE="avatars.html"
IMG_DIR="images"

# Create image directory if it doesn't exist
mkdir -p "$IMG_DIR"

if [ ! -f "$HTML_FILE" ]; then
  echo "[!] HTML file not found: $HTML_FILE"
  exit 1
fi

REPLACEMENTS=""

echo "[~] Searching for avatar tokens..."

# Extract unique tokens from HTML file
avatar_tokens=$(grep -oE '/go/vrchat/[A-Za-z0-9_-]+' "$HTML_FILE" | sed 's|^/go/vrchat/||' | sort -u)

if [ -z "$avatar_tokens" ]; then
  echo "[!] Avatar tokens not found"
  exit 0
fi

for avatar_token in $avatar_tokens; do
  echo "[+] Avatar token: $avatar_token"

  # Resolve redirect to VRChat avatar
  avatar_url=$(curl -Ls -o /dev/null -w '%{url_effective}' "https://vrcdb.com/go/vrchat/$avatar_token")

  # Extract avatar ID
  avatar_id=$(echo "$avatar_url" | grep -o 'avtr_[^/?]*' || true)

  if [ -z "$avatar_id" ]; then
    echo "[!] Failed extracting avatar ID: $avatar_token"
    continue
  fi

  echo "[+] Avatar ID: $avatar_id"

  avatar_image_path="$IMG_DIR/$avatar_id.webp"

  if [ -s "$avatar_image_path" ]; then
    echo "[=] Image already exists"
  else
    echo "[~] Downloading image..."

    curl -fsSL "https://vrcdb.com/img/avatar?token=$avatar_token" \
      -H "User-Agent: Mozilla/5.0" \
      -H "Referer: https://vrcdb.com/" \
      -o "$avatar_image_path"
  fi

  REPLACEMENTS+="s|/go/vrchat/$avatar_token|$avatar_url|g;"
  REPLACEMENTS+="s|/img/avatar?token=$avatar_token|$avatar_image_path|g;"

  sleep 0.5
done

# Replace avatar redirect URL with resolved link and remote image URL with local path
echo "[~] Updating links..."

sed "$REPLACEMENTS" "$HTML_FILE" > "$HTML_FILE.tmp"

mv "$HTML_FILE.tmp" "$HTML_FILE"

echo "[v] HTML updated: $HTML_FILE"
