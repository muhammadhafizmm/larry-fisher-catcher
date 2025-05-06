#!/usr/bin/env bash
set -e

# Usage: ./generate-changelog.sh <FROM_BRANCH> <TO_BRANCH> <VERSION> [OUTPUT_FILE]

VERSION="$1"
OUTPUT_FILE="${2:-}"
FROM_BRANCH="${3:-origin/rc}"
TO_BRANCH="${4:-HEAD}"

if [ -z "$VERSION" ]; then
  echo "❌ Error: VERSION is required as the 3rd argument."
  exit 1
fi

# Use Indonesia time (WIB)
TODAY=$(TZ=Asia/Jakarta date +%Y-%m-%d)

echo "🔍 Generating changelog $VERSION from $FROM_BRANCH to $TO_BRANCH"

git fetch origin

DELIM=$'\x1e' # ASCII Record Separator

# Get GitHub repository URL
GIT_REMOTE=$(git remote get-url origin)
if [[ "$GIT_REMOTE" =~ ^git@github.com:(.*)\.git$ ]]; then
  REPO_URL="https://github.com/${BASH_REMATCH[1]}"
elif [[ "$GIT_REMOTE" =~ ^https://github.com/(.*?)(\.git)?$ ]]; then
  REPO_URL="https://github.com/${BASH_REMATCH[1]}"
else
  echo "⚠️  Unable to parse GitHub repository URL from remote: $GIT_REMOTE"
  REPO_URL=""
fi

# Get commits
COMMITS=$(git log "$FROM_BRANCH..$TO_BRANCH" --no-merges \
  --pretty=format:"%s${DELIM}%h${DELIM}%b" | sed '/^\*/d')

# Init sections
FEAT=""
FIX=""
INFRA=""
MAJOR=""
OTHER=""

while IFS= read -r COMMIT_LINE; do
  SUBJECT_ORIG=$(echo "$COMMIT_LINE" | cut -d"$DELIM" -f1 | sed 's/^[[:space:]]*//')
  SHORT=$(echo "$COMMIT_LINE" | cut -d"$DELIM" -f2)
  BODY=$(echo "$COMMIT_LINE" | cut -d"$DELIM" -f3- | tr '\n' ' ')

  [[ -z "$SUBJECT_ORIG" || -z "$SHORT" ]] && continue # skip if malformed

  # Detect breaking change
  IS_BREAKING=false
  if [[ "$SUBJECT_ORIG" =~ !: ]] || echo "$BODY" | grep -q "BREAKING CHANGE:"; then
    IS_BREAKING=true
  fi

  # Normalize subject
  if [[ $SUBJECT_ORIG =~ ^\[FEATURE\][[:space:]]* ]]; then
    SUBJECT="feat:${SUBJECT_ORIG#\[FEATURE\]}"
  elif [[ $SUBJECT_ORIG =~ ^\[FIX\][[:space:]]* ]]; then
    SUBJECT="fix:${SUBJECT_ORIG#\[FIX\]}"
  elif [[ $SUBJECT_ORIG =~ ^\[INFRA\][[:space:]]* ]]; then
    SUBJECT="infra:${SUBJECT_ORIG#\[INFRA\]}"
  else
    SUBJECT="$SUBJECT_ORIG"
  fi

  # Final line with hash or GitHub link
  if [ -n "$REPO_URL" ]; then
    LINE="- ${SUBJECT}\n  [\`${SHORT}\`](${REPO_URL}/commit/${SHORT})"
  else
    LINE="- ${SUBJECT}\n  \`${SHORT}\`"
  fi

  # Group
  if [[ "$IS_BREAKING" == true ]]; then
    MAJOR+="${LINE}\n"
  elif [[ $SUBJECT =~ ^feat: ]]; then
    FEAT+="${LINE}\n"
  elif [[ $SUBJECT =~ ^fix: ]]; then
    FIX+="${LINE}\n"
  elif [[ $SUBJECT =~ ^infra: ]]; then
    INFRA+="${LINE}\n"
  else
    OTHER+="${LINE}\n"
  fi
done <<< "$COMMITS"

# Build markdown
OUT="## $VERSION ($TODAY)"$'\n\n'
[ -n "$MAJOR" ] && OUT+="### 🚨 Breaking Changes"$'\n'"$MAJOR"$'\n'
[ -n "$FEAT" ] && OUT+="### ✨ Feat"$'\n'"$FEAT"$'\n'
[ -n "$FIX" ] && OUT+="### 🐛 Fix"$'\n'"$FIX"$'\n'
[ -n "$INFRA" ] && OUT+="### 🔧 Infra"$'\n'"$INFRA"$'\n'
[ -n "$OTHER" ] && OUT+="### 🗃 Other"$'\n'"$OTHER"$'\n'

OUT=$(echo -e "$OUT" | awk 'BEGIN{RS="";ORS="\n\n"} {gsub(/\n+$/, ""); print}')

# Output
if [ -n "$OUTPUT_FILE" ]; then
  # Convert output file name to lowercase for case-insensitive comparison
  filename_lower=$(basename "$OUTPUT_FILE" | tr '[:upper:]' '[:lower:]')

  if [ "$filename_lower" = "changelog.md" ]; then
    # If the output file is changelog.md (case-insensitive)

    if [ -f "$OUTPUT_FILE" ]; then
      # If the file exists, remove the first line and prepend "# Changelog" + $OUT
      tail -n +2 "$OUTPUT_FILE" > "${OUTPUT_FILE}.tmp"
      echo -e "# Changelog\n\n$OUT\n" > "$OUTPUT_FILE"
      cat "${OUTPUT_FILE}.tmp" >> "$OUTPUT_FILE"
      rm "${OUTPUT_FILE}.tmp"
      echo "✅ $OUTPUT_FILE updated with new changelog at the top"
    else
      # If the file does not exist, create it with "# Changelog" and $OUT
      echo -e "# Changelog\n\n$OUT" > "$OUTPUT_FILE"
      echo "✅ $OUTPUT_FILE created"
    fi
  else
    # If the output file is not changelog.md, create it with "# Changelog" and $OUT
    echo -e "# Changelog\n\n$OUT" > "$OUTPUT_FILE"
    echo "✅ $OUTPUT_FILE created"
  fi
else
  # If no output file is specified, print $OUT to the terminal
  echo -e "$OUT"
fi

