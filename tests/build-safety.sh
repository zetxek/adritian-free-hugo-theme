#!/usr/bin/env bash
# Build-safety test: verify Hugo builds successfully with minimal configs
# that exercise different param combinations, catching nil-pointer panics
# from direct access to params.seo.* fields.
#
# Addresses Gemini/Copilot review feedback on PR #561:
# "Directly accessing .Site.Params.seo.siteDescription will cause a
#  template rendering error (nil pointer evaluation) if a user does not
#  have the [params.seo] block defined in their hugo.toml."

set -euo pipefail

THEME_DIR="$(cd "$(dirname "$0")/.." && pwd)"
THEME_NAME="$(basename "$THEME_DIR")"
PASSED=0
FAILED=0

run_test() {
  local name="$1" config="$2"
  local tmp_site
  tmp_site="$(mktemp -d)"
  trap 'rm -rf "$tmp_site"' RETURN

  mkdir -p "$tmp_site/content"
  cat > "$tmp_site/hugo.toml" <<EOF
baseURL = 'http://localhost/'
languageCode = 'en-us'
title = 'Build Safety Test'
theme = '$THEME_NAME'
$config
EOF

  if hugo --source "$tmp_site" --themesDir "${THEME_DIR}/.." --quiet 2>&1; then
    echo "✅ $name"
    PASSED=$((PASSED + 1))
  else
    echo "❌ $name"
    FAILED=$((FAILED + 1))
  fi
}

echo "Running build-safety tests for theme: $THEME_NAME"
echo "Themes dir: ${THEME_DIR}/.."
echo ""

# Test 1: No [params] at all — bare minimum
run_test "No [params] block" ""

# Test 2: Only params.description, no [params.seo]
run_test "Only params.description (no seo block)" '
[params]
  description = "A site with only params.description"'

# Test 3: Only [params.seo], no params.description
run_test "Only params.seo.siteDescription (no params.description)" '
[params]
[params.seo]
  siteDescription = "A site with only params.seo"'

# Test 4: Both params.description and params.seo.siteDescription
run_test "Both params.description and params.seo" '
[params]
  description = "Fallback description"
[params.seo]
  siteDescription = "Primary SEO description"'

# Test 5: Empty params — siteTitle but no description
run_test "Site title but no description at all" '
[params]
  title = "Just a title"'

echo ""
echo "Results: $PASSED passed, $FAILED failed"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
