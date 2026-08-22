#!/usr/bin/env bash
# Rebuilds canonical templates and local skill mirrors from live files.
# Usage: ./scripts/sync-templates.sh
# Byte-exact cp only: no text transcoding, no encoding risks.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
t="$root/skills/hp-docs/templates"

pairs=(
  "AGENTS.md AGENTS.md"
  "first-run.md first-run.md"
  ".docs/AGENT_PROMPT.md AGENT_PROMPT.md"
  ".docs/DEVELOPMENT.md DEVELOPMENT.md"
  ".docs/DESIGN.md DESIGN.md"
  ".docs/CHECKLIST.md CHECKLIST.md"
  ".docs/REVIEWER.md REVIEWER.md"
  # DECISIONS.md excluded on purpose: live journal holds repo-specific decisions,
  # shipped template must stay an empty journal. Edit it manually if the format changes.
  ".docs/ROADMAP.md ROADMAP.md"
  ".docs/agents-audit.prompt.md agents-audit.prompt.md"
  ".docs/features/README.md features/README.md"
  ".docs/reviews/README.md reviews/README.md"
  ".docs/answers/README.md answers/README.md"
)

for pair in "${pairs[@]}"; do
  src="$root/${pair%% *}"
  dst="$t/${pair##* }"
  [ -f "$src" ] || { echo "Missing source: $src" >&2; exit 1; }
  mkdir -p "$(dirname "$dst")"
  cp -f "$src" "$dst"
done

# Local mirror so coding agents auto-discover skills in this repo
rm -rf "$root/.agents/skills"
mkdir -p "$root/.agents/skills"
cp -R "$root/skills/." "$root/.agents/skills/"

# Verify byte-exactness
failed=0
for pair in "${pairs[@]}"; do
  src="$root/${pair%% *}"; dst="$t/${pair##* }"
  if ! cmp -s "$src" "$dst"; then echo "HASH MISMATCH: ${pair%% *}"; failed=$((failed+1)); fi
done
[ "$failed" -gt 0 ] && { echo "$failed template file(s) failed verification" >&2; exit 1; }

echo "OK: ${#pairs[@]} templates rebuilt, mirrors synced, hashes verified."
