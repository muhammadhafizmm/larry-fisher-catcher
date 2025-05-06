#!/usr/bin/env bash
set -e

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "❌ Error: VERSION argument is required"
  exit 1
fi

echo "🔧 Updating version to $VERSION"

# Update version in package.json (and package-lock.json if exists)
npm version "$VERSION" --no-git-tag-version

# Commit and push changes
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"

git add package.json
[ -f "package-lock.json" ] && git add package-lock.json

git commit -m "[infra] bump version to $VERSION"

# Push to origin/staging-experimental
git push origin HEAD:staging-experimental
