#!/usr/bin/env python3
"""Stronger paint-over for outdoor yard cat silhouette."""
from pathlib import Path
import sys

venv_site = next(Path("/Users/vero/Documents/ChatGPT/interactive-portfolio/.tmp-venv/lib").glob("python*/site-packages"))
sys.path.insert(0, str(venv_site))
from PIL import Image, ImageFilter, ImageDraw

src = Path(
    "/Users/vero/.cursor/projects/Users-vero-Documents-ChatGPT-interactive-portfolio/assets/chapter-fortress-den.png"
)
im = Image.open(src).convert("RGBA")
w, h = im.size
cx, cy = int(w * 0.62), int(h * 0.305)
bw, bh = int(w * 0.07), int(h * 0.11)
x0, y0 = max(0, cx - bw // 2), max(0, cy - bh // 2)
x1, y1 = min(w, cx + bw // 2), min(h, cy + bh // 2)
sx0, sy0 = int(w * 0.48), int(h * 0.38)
sw, sh = x1 - x0, y1 - y0
grass = im.crop((sx0, sy0, min(w, sx0 + sw), min(h, sy0 + sh))).resize((sw, sh))
mask = Image.new("L", (sw, sh), 0)
ImageDraw.Draw(mask).ellipse((0, 0, sw - 1, sh - 1), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(2))
im.paste(grass, (x0, y0), mask)
rect = Image.new("RGBA", (sw, sh))
rect.paste(grass, (0, 0))
rmask = Image.new("L", (sw, sh), 0)
ImageDraw.Draw(rmask).rounded_rectangle(
    (int(sw * 0.15), int(sh * 0.1), int(sw * 0.85), int(sh * 0.9)), radius=8, fill=230
)
rmask = rmask.filter(ImageFilter.GaussianBlur(3))
im.paste(rect, (x0, y0), rmask)
im.save(src, "PNG")
im.save(
    "/Users/vero/Documents/ChatGPT/interactive-portfolio/site/dist/assets/chapter-fortress-candidate.png",
    "PNG",
)
zoom = im.crop((int(w * 0.52), int(h * 0.22), int(w * 0.72), int(h * 0.42)))
zoom.save(
    "/Users/vero/Documents/ChatGPT/interactive-portfolio/site/dist/assets/chapter-fortress-yard-zoom.png"
)
print("done", x0, y0, x1, y1, src.stat().st_size)
