#!/bin/bash
set -e

FROM_BRANCH="${1:-origin/rc}"
TO_BRANCH="${2:-HEAD}"

echo "🔍 Calculating next stable release from $FROM_BRANCH to $TO_BRANCH"

# Get all tags sorted by creation date (descending)
TAGS=$(git tag --sort=-creatordate)

# Get latest stable release (no prerelease suffix)
LATEST_RELEASE=$(echo "$TAGS" | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n1)

if [ -z "$LATEST_RELEASE" ]; then
  LATEST_RELEASE="v1.0.0"
fi

echo "🔖 Latest release tag: $LATEST_RELEASE"

# Get commits between branches (excluding merges)
COMMITS=$(git log "$FROM_BRANCH..$TO_BRANCH" --no-merges --pretty=format:"%s")

# Determine semver type
SEMVER_TYPE="patch"
if echo "$COMMITS" | grep -qE 'BREAKING CHANGE|!:'; then
  SEMVER_TYPE="major"
elif echo "$COMMITS" | grep -qE '^feat:'; then
  SEMVER_TYPE="minor"
elif echo "$COMMITS" | grep -qE '^fix:'; then
  SEMVER_TYPE="patch"
fi

echo "🔧 Detected semver bump: $SEMVER_TYPE"

# Parse current version parts
IFS='.' read -r MAJOR MINOR PATCH <<< "$(echo "$LATEST_RELEASE" | sed 's/^v//')"

# Bump version accordingly
case $SEMVER_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
esac

NEXT_VERSION="v$MAJOR.$MINOR.$PATCH"
echo "🚀 Next release version: $NEXT_VERSION"

# Output for GitHub Actions
echo "version=$NEXT_VERSION" >> "$GITHUB_OUTPUT"
