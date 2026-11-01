#!/usr/bin/env python3
"""Create smaller WebP copies for the reader; retain the generated PNG originals.

Optional asset preparation step, requires Pillow. The book builder itself uses
only the Python standard library.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
images = sorted((root / 'docs/assets/illustrations').glob('[0-9][0-9][0-9].png'))
for source in images:
    output = source.with_suffix('.webp')
    if output.exists() and output.stat().st_mtime >= source.stat().st_mtime:
        continue
    with Image.open(source) as im:
        im.convert('RGB').save(output, 'WEBP', quality=90, method=6)
original = sum(p.stat().st_size for p in images)
optimized = sum(p.with_suffix('.webp').stat().st_size for p in images)
print(f'{len(images)} images: PNG {original / 1048576:.1f} MiB -> WebP {optimized / 1048576:.1f} MiB')
