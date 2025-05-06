#!/usr/bin/env bash
set -e

VERSION=$1
TARGET_BRANCH=$2

if [ -z "$VERSION" ]; then
  echo "❌ Error: VERSION argument is required"
  exit 1
fi

if [ -z "$TARGET_BRANCH" ]; then
  echo "❌ Error: TARGET_BRANCH argument is required"
  exit 1
fi

CURRENT_VERSION=$(jq -r '.version' package.json)

if [ "$CURRENT_VERSION" == "$VERSION" ]; then
  echo "⚠️  Version $VERSION is already current. Skipping bump but continuing."
  exit 0
fi

echo "🔧 Updating version to $VERSION"
npm version "$VERSION" --no-git-tag-version

git add package.json
[ -f "package-lock.json" ] && git add package-lock.json

git commit -m "bot: bump version to $VERSION"
git push origin HEAD:$TARGET_BRANCH
