#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
IOS_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
SOURCE="$IOS_ROOT/AppStore/AppIconSource.svg"
DESTINATION="$IOS_ROOT/FrogHome/Assets.xcassets/AppIcon.appiconset/AppIcon.png"
TEMP_PNG=$(mktemp -t frog-home-icon).png
TEMP_JPG=$(mktemp -t frog-home-icon).jpg
TEMP_OPTIMIZED=$(mktemp -t frog-home-icon).png

cleanup() {
  rm -f "$TEMP_PNG" "$TEMP_JPG" "$TEMP_OPTIMIZED"
}
trap cleanup EXIT

sips -s format png "$SOURCE" --out "$TEMP_PNG" >/dev/null
sips -z 1024 1024 "$TEMP_PNG" --out "$TEMP_PNG" >/dev/null
sips -s format jpeg -s formatOptions 100 "$TEMP_PNG" --out "$TEMP_JPG" >/dev/null
sips -s format png "$TEMP_JPG" --out "$DESTINATION" >/dev/null
xcrun pngcrush -q -brute "$DESTINATION" "$TEMP_OPTIMIZED"
mv "$TEMP_OPTIMIZED" "$DESTINATION"

echo "已生成 1024×1024、无透明通道的 App Store 图标。"
