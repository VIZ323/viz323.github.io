#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../../.." && pwd)
WEB_ROOT="$SCRIPT_DIR/../FrogHome/Web"

mkdir -p "$WEB_ROOT/src"
cp "$PROJECT_ROOT/index.html" "$WEB_ROOT/index.html"
cp "$PROJECT_ROOT/styles.css" "$WEB_ROOT/styles.css"
rsync -a --delete "$PROJECT_ROOT/src/" "$WEB_ROOT/src/"

echo "已同步 H5 资源到 iOS 工程。"
