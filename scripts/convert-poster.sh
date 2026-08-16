#!/usr/bin/env bash
# Convert an image to a Cineflix small poster: 300x450 WebP
# Usage:
#   ./scripts/convert-poster.sh path/to/poster.jpg
#   ./scripts/convert-poster.sh path/to/poster.jpg custom_name
#   ./scripts/convert-poster.sh path/to/poster.jpg custom_name /path/to/outdir

set -euo pipefail

WIDTH=300
HEIGHT=450
QUALITY=80
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/assets/images/small"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <image> [output_name] [output_dir]" >&2
  exit 1
fi

INPUT="$1"
if [[ ! -f "$INPUT" ]]; then
  echo "File not found: $INPUT" >&2
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp is required (brew install webp)" >&2
  exit 1
fi

BASENAME="${2:-$(basename "${INPUT%.*}")}"
BASENAME="${BASENAME%.webp}"
OUT_DIR="${3:-$OUT_DIR}"
OUTPUT="$OUT_DIR/${BASENAME}.webp"

mkdir -p "$OUT_DIR"

cwebp -quiet -q "$QUALITY" -resize "$WIDTH" "$HEIGHT" "$INPUT" -o "$OUTPUT"

echo "Wrote $OUTPUT (${WIDTH}x${HEIGHT})"
