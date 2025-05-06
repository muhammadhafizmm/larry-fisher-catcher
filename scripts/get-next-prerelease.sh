#!/bin/bash
set -e

FROM_BRANCH="${1:-origin/rc}"
TO_BRANCH="${2:-HEAD}"

echo "🔍 Calculating prerelease from $FROM_BRANCH to $TO_BRANCH"

# Fetch tags
git fetch --tags

# Get all tags (sorted by date)
TAGS=$(git tag --sort=-creatordate)

# Get latest release tag (non-prerelease)
LATEST_RELEASE=$(echo "$TAGS" | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | tail -n1)
[ -z "$LATEST_RELEASE" ] && LATEST_RELEASE="v1.0.0"

echo "🔖 Latest release tag: $LATEST_RELEASE"

# Get commit messages from FROM..TO (no merge commits)
COMMITS=$(git log "$FROM_BRANCH..$TO_BRANCH" --no-merges --pretty=format:"%s")

# Determine semver bump
SEMVER_TYPE="patch"
if echo "$COMMITS" | grep -qE 'BREAKING CHANGE|!:'; then
  SEMVER_TYPE="major"
elif echo "$COMMITS" | grep -qE '^feat:'; then
  SEMVER_TYPE="minor"
elif echo "$COMMITS" | grep -qE '^fix:'; then
  SEMVER_TYPE="patch"
fi

echo "🔧 Detected semver bump: $SEMVER_TYPE"

# Parse version
IFS='.' read -r MAJOR MINOR PATCH <<< "$(echo "$LATEST_RELEASE" | sed 's/^v//')"

# Determine target base version
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

# Check if there is already a beta for the current base version
EXISTING_BETA=$(echo "$TAGS" | grep "^${BASE_VERSION}-beta\." | tail -n1)

if [ -n "$EXISTING_BETA" ]; then
  if git merge-base --is-ancestor "$EXISTING_BETA" "$TO_BRANCH"; then
    BETA=$(echo "$EXISTING_BETA" | grep -oE 'beta\.[0-9]+' | cut -d'.' -f2)
    BETA=$((BETA + 1))
    NEXT_BETA="${BASE_VERSION}-beta.${BETA}"
    echo "🚀 Continuing beta series: $NEXT_BETA"
    echo "BETA_VERSION=$NEXT_BETA"
    exit 0
  fi
fi

# No beta tag yet, or old one is outdated
NEXT_BETA="${BASE_VERSION}-beta.0"
echo "🚀 Starting new beta series: $NEXT_BETA"
echo "BETA_VERSION=$NEXT_BETA"
