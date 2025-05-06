#!/bin/bash
set -e

FROM_BRANCH="${1:-origin/rc}"
TO_BRANCH="${2:-HEAD}"

echo "🔍 Calculating prerelease from $FROM_BRANCH to $TO_BRANCH"

# Get all tags
TAGS=$(git tag --sort=-creatordate)

# Get latest release tag (non-prerelease)
LATEST_RELEASE=$(echo "$TAGS" | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | head -n1)

if [ -z "$LATEST_RELEASE" ]; then
  LATEST_RELEASE="v1.0.0"
fi

echo "🔖 Latest release tag: $LATEST_RELEASE"

# Get commit messages from FROM..TO (no merge commits, squash commits only)
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

# Bump version
IFS='.' read -r MAJOR MINOR PATCH <<< "$(echo "$LATEST_RELEASE" | sed 's/v//')"
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

BASE_VERSION="v$MAJOR.$MINOR.$PATCH"
echo "🎯 Target base version: $BASE_VERSION"

# Get latest beta tag for this version
LATEST_BETA=$(echo "$TAGS" | grep "^${BASE_VERSION}-beta\." | head -n1)

if [ -z "$LATEST_BETA" ]; then
  BETA=0
else
  BETA=$(echo "$LATEST_BETA" | grep -oE 'beta\.[0-9]+' | cut -d'.' -f2)
  BETA=$((BETA + 1))
fi

NEXT_BETA="${BASE_VERSION}-beta.${BETA}"
echo "🚀 Next beta version: $NEXT_BETA"
