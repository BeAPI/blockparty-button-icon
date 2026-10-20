#!/usr/bin/env bash
#
# When .plugin-data version changes between base and head commits, verify
# the release tag is unused and that every versioned file is updated consistently.
#
# Usage (from repository root):
#   ./tests/bin/check-release-version.sh
#     (default: merge-base of main|origin/main|master with HEAD → HEAD, for local runs)
#   BASE_SHA=<base> HEAD_SHA=<head> ./tests/bin/check-release-version.sh
#   ./tests/bin/check-release-version.sh <base_sha> <head_sha>
#
# GitHub Actions sets BASE_SHA and HEAD_SHA on the pull request; arguments override env.
#

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
cd "$ROOT"

if [ $# -ge 2 ]; then
	BASE_SHA=$1
	HEAD_SHA=$2
fi

if [ -z "${BASE_SHA:-}" ] || [ -z "${HEAD_SHA:-}" ]; then
	if [ $# -eq 0 ] && git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
		HEAD_SHA=$(git -C "$ROOT" rev-parse HEAD)
		base_ref=
		for r in main origin/main master origin/master; do
			if git -C "$ROOT" rev-parse -q --verify "$r" >/dev/null 2>&1; then
				base_ref=$r
				break
			fi
		done
		if [ -n "$base_ref" ] && MB=$(git -C "$ROOT" merge-base "$base_ref" HEAD 2>/dev/null); then
			BASE_SHA=$MB
			echo "Using ${base_ref}..HEAD: merge-base ${BASE_SHA:0:7} → head ${HEAD_SHA:0:7}" >&2
		fi
	fi
fi

if [ -z "${BASE_SHA:-}" ] || [ -z "${HEAD_SHA:-}" ]; then
	echo "Usage: BASE_SHA=<commit> HEAD_SHA=<commit> $0" >&2
	echo "   or: $0 <base_sha> <head_sha>" >&2
	echo "   or: $0  (in a git repo, compares merge-base of main|origin/main|... with HEAD)" >&2
	exit 1
fi

if [ ! -f .plugin-data ]; then
	echo "No .plugin-data in working tree. Skipping release and tag checks."
	exit 0
fi

NEW_VER=$(jq -r .version .plugin-data)

# Missing .plugin-data on the base branch means this is the first release.
FIRST_RELEASE=0
if ! git cat-file -e "${BASE_SHA}:.plugin-data" 2>/dev/null; then
	FIRST_RELEASE=1
	OLD_VER=
	echo "No .plugin-data at merge base (first release). Skipping version-bump diff requirements."
else
	OLD_VER=$(git show "${BASE_SHA}:.plugin-data" | jq -r .version)
fi

if [ "$FIRST_RELEASE" -eq 0 ] && [ "$OLD_VER" = "$NEW_VER" ]; then
	echo "No version change in .plugin-data (${NEW_VER}). Skipping release and tag checks."
	exit 0
fi

if [ "$FIRST_RELEASE" -eq 1 ]; then
	echo "First release: ${NEW_VER}"
else
	echo "Version bump detected: ${OLD_VER} -> ${NEW_VER}"
fi

if git show-ref --verify --quiet "refs/tags/${NEW_VER}"; then
	echo "::error::Tag '${NEW_VER}' already exists. Bump .plugin-data to a version that is not released yet."
	exit 1
fi

have_diff() {
	[ -n "$(git diff --name-only "${BASE_SHA}" "${HEAD_SHA}" -- "$1")" ]
}

# Subsequent bumps must touch every versioned path that exists in the tree.
# First release skips this gate: files may already match the initial version.
if [ "$FIRST_RELEASE" -eq 0 ]; then
	missing=()
	for f in \
		.plugin-data \
		package.json \
		blockparty-button-icon.php \
		readme.txt \
		.wordpress-org/blueprints/blueprint.json \
		CHANGELOG.md
	do
		if [ ! -e "$f" ]; then
			continue
		fi
		if ! have_diff "$f"; then
			missing+=("$f")
		fi
	done

	while IFS= read -r -d '' f; do
		if ! have_diff "$f"; then
			missing+=("$f (block.json)")
		fi
	done < <(find ./src -name block.json -print0 2>/dev/null)

	if [ ${#missing[@]} -ne 0 ]; then
		echo "::error::This PR bumps the plugin version. The following required paths must be modified (diff vs base branch):"
		printf '  - %s\n' "${missing[@]}"
		exit 1
	fi
fi

# Consistency: declared version must match .plugin-data everywhere the file exists.
fail=0
if [ -f package.json ] && [ "$(jq -r .version package.json)" != "$NEW_VER" ]; then
	echo "::error::package.json version must equal ${NEW_VER} (from .plugin-data)"
	fail=1
fi

while IFS= read -r -d '' f; do
	if [ "$(jq -r .version "$f")" != "$NEW_VER" ]; then
		echo "::error::${f} version must equal ${NEW_VER} (from .plugin-data)"
		fail=1
	fi
done < <(find ./src -name block.json -print0 2>/dev/null)

if [ -f .wordpress-org/blueprints/blueprint.json ]; then
	BP_REF=$(jq -r '.steps[] | select(.pluginData) | .pluginData.ref' .wordpress-org/blueprints/blueprint.json | head -1)
	if [ "$BP_REF" != "$NEW_VER" ]; then
		echo "::error::.wordpress-org/blueprints/blueprint.json pluginData.ref must be '${NEW_VER}' (got '${BP_REF}')"
		fail=1
	fi

	BP_REF_TYPE=$(jq -r '.steps[] | select(.pluginData) | .pluginData.refType' .wordpress-org/blueprints/blueprint.json | head -1)
	if [ "$BP_REF_TYPE" != "tag" ]; then
		echo "::error::.wordpress-org/blueprints/blueprint.json pluginData.refType must be 'tag' (got '${BP_REF_TYPE}')"
		fail=1
	fi
fi

if [ -f blockparty-button-icon.php ]; then
	if ! grep -F "* Version:" blockparty-button-icon.php | head -1 | grep -qF "$NEW_VER"; then
		echo "::error::blockparty-button-icon.php plugin header Version must be ${NEW_VER}"
		fail=1
	fi

	if ! grep -qF "define( 'BLOCKPARTY_BUTTON_ICON_VERSION', '$NEW_VER' );" blockparty-button-icon.php; then
		echo "::error::blockparty-button-icon.php define BLOCKPARTY_BUTTON_ICON_VERSION must be '${NEW_VER}'"
		fail=1
	fi
fi

if [ -f readme.txt ]; then
	if ! grep -E "^Stable tag:" readme.txt | grep -qF "$NEW_VER"; then
		echo "::error::readme.txt Stable tag must be ${NEW_VER}"
		fail=1
	fi

	if ! grep -qF "= ${NEW_VER} =" readme.txt; then
		echo "::error::readme.txt Changelog must include '= ${NEW_VER} =' section"
		fail=1
	fi
fi

if [ -f CHANGELOG.md ] && ! grep -qF "$NEW_VER" CHANGELOG.md; then
	echo "::error::CHANGELOG.md must mention the release version ${NEW_VER} (e.g. a [${NEW_VER}] section header)"
	fail=1
fi

exit "$fail"
