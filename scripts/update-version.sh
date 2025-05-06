#!/usr/bin/env bash
set -e

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "❌ Error: Version is required"
  exit 1
fi

# Strip "v" if present (e.g., v1.2.3 -> 1.2.3)
CLEAN_VERSION=$(echo "$VERSION" | sed 's/^v//')

echo "🔧 Updating package.json version to $CLEAN_VERSION"

# Use jq to safely update package.json version
tmp_file=$(mktemp)
jq --arg ver "$CLEAN_VERSION" '.version = $ver' package.json > "$tmp_file" && mv "$tmp_file" package.json

echo "✅ package.json updated to version $CLEAN_VERSION"
