#!/bin/bash
# SessionStart hook for Claude Code on the web.
#
# The repo stores all images (png/jpg/webp/ico) and 3mf models in Git LFS, but the
# remote container ships without git-lfs. Without it the working tree only contains
# ~130 byte LFS pointer files, so `astro build` fails as soon as Sharp tries to
# process an "image" that is really a text pointer.
#
# This hook installs git-lfs, materialises the real binaries, and installs node deps.
set -euo pipefail

# Only run in Claude Code on the web - local machines already have their own setup.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

if ! command -v git-lfs >/dev/null 2>&1; then
  echo "Installing git-lfs..."
  SUDO=""
  if [ "$(id -u)" -ne 0 ]; then
    SUDO="sudo"
  fi
  export DEBIAN_FRONTEND=noninteractive
  # Third-party PPAs in the base image are blocked by the egress proxy and make
  # `apt-get update` noisy/non-zero; the Ubuntu archive we need still refreshes.
  $SUDO apt-get update -qq || true
  $SUDO apt-get install -y -qq git-lfs
fi

# Register the LFS filters for this repo only (idempotent).
git lfs install --local

# Replace pointer files with the real objects. --include= --exclude= overrides any
# repo/global include-exclude filters so every tracked object is fetched.
echo "Fetching Git LFS objects..."
git lfs pull --include="*" --exclude=""

# Sanity check: a materialised PNG must not still be an LFS pointer.
sample="$(git lfs ls-files -n | head -1 || true)"
if [ -n "$sample" ] && [ -f "$sample" ] && head -c 40 "$sample" | grep -q "git-lfs.github.com"; then
  echo "WARNING: $sample is still a Git LFS pointer - image builds will fail." >&2
fi

echo "Installing node dependencies..."
export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
corepack enable >/dev/null 2>&1 || true
pnpm install

echo "Session setup complete."
