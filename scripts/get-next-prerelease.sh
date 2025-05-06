#!/bin/bash
set -e

FROM_BRANCH="${1:-origin/rc}"
TO_BRANCH="${2:-HEAD}"

echo "🔍 Calculating prerelease from $FROM_BRANCH to $TO_BRANCH"

git fetch --tags

# All tags sorted semver
TAGS=$(git tag | sort -V)

# Get latest release tag (stable only)
LATEST_RELEASE=$(echo "$TAGS" | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | tail -n1)
[ -z "$LATEST_RELEASE" ] && LATEST_RELEASE="v1.0.0"
echo "🔖 Latest stable release: $LATEST_RELEASE"

# Get commit messages
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

# Parse LATEST_RELEASE version
IFS='.' read -r MAJOR MINOR PATCH <<< "$(echo "$LATEST_RELEASE" | sed 's/^v//')"

# Bump version
case $SEMVER_TYPE in
  major)
    MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor)
    MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch)
    PATCH=$((PATCH + 1)) ;;
esac

CURRENT_BASE="v$MAJOR.$MINOR.$PATCH"
echo "🎯 Current base version (from commits): $CURRENT_BASE"

# Get latest beta version and its base
LATEST_BETA=$(echo "$TAGS" | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+-beta\.[0-9]+$' | sort -V | tail -n1)

LATEST_BETA_BASE=""
LATEST_BETA_NUM=0

if [ -n "$LATEST_BETA" ]; then
  LATEST_BETA_BASE=$(echo "$LATEST_BETA" | sed -E 's/-beta\.[0-9]+$//')
  LATEST_BETA_NUM=$(echo "$LATEST_BETA" | grep -oE 'beta\.[0-9]+' | cut -d'.' -f2)
  echo "📦 Latest beta tag: $LATEST_BETA"
fi

# Function to compare two semver strings
semver_gt() {
  [ "$(printf "%s\n%s\n" "$1" "$2" | sort -V | tail -n1)" != "$2" ]
}

# Decide which base to use
if [ -n "$LATEST_BETA_BASE" ] && semver_gt "$LATEST_BETA_BASE" "$CURRENT_BASE"; then
  BASE_VERSION="$LATEST_BETA_BASE"
  BETA=$((LATEST_BETA_NUM + 1))
  echo "🔁 Continuing from higher beta base: $BASE_VERSION (next beta.$BETA)"
else
  BASE_VERSION="$CURRENT_BASE"
  # Get highest beta for this base
  LAST_BETA=$(echo "$TAGS" | grep "^${BASE_VERSION}-beta\." | grep -oE 'beta\.[0-9]+' | cut -d'.' -f2 | sort -nr | head -n1)

  if [ -n "$LAST_BETA" ]; then
    BETA=$((LAST_BETA + 1))
  else
    BETA=0
  fi

  echo "🆕 Starting or continuing beta from: $BASE_VERSION (next beta.$BETA)"
fi

NEXT_BETA="${BASE_VERSION}-beta.${BETA}"
echo "🚀 Next beta version: $NEXT_BETA"
echo "BETA_VERSION=$NEXT_BETA"
