#!/usr/bin/env python3
"""Paint over outdoor yard cat in Fortress chapter candidate."""
from pathlib import Path
import subprocess
import sys

def ensure_pillow():
    try:
        from PIL import Image, ImageFilter, ImageDraw  # noqa: F401
        return
    except ImportError:
        pass
    venv = Path(__file__).resolve().parents[1] / ".tmp-venv"
    if not (venv / "bin" / "python").exists():
        subprocess.check_call([sys.executable, "-m", "venv", str(venv)])
    pip = venv / "bin" / "pip"
    subprocess.check_call([str(pip), "install", "pillow", "-q"])
    sys.path.insert(0, str(next((venv / "lib").glob("python*/site-packages"))))


ensure_pillow()
from PIL import Image, ImageFilter, ImageDraw

src = Path(
    "/Users/vero/.cursor/projects/Users-vero-Documents-ChatGPT-interactive-portfolio/assets/chapter-fortress-den.png"
)
# Normalize to PNG first via sips if needed
tmp = Path("/tmp/chapter-fortress-den-patch-src.png")
subprocess.check_call(
    ["sips", "-s", "format", "png", str(src), "--out", str(tmp)],
    stdout=subprocess.DEVNULL,
)

im = Image.open(tmp).convert("RGBA")
w, h = im.size
cx, cy = int(w * 0.62), int(h * 0.31)
bw, bh = max(8, int(w * 0.045)), max(8, int(h * 0.08))
x0, y0 = max(0, cx - bw // 2), max(0, cy - bh // 2)
x1, y1 = min(w, cx + bw // 2), min(h, cy + bh // 2)
sx0, sy0 = int(w * 0.55), int(h * 0.33)
sx1, sy1 = min(w, sx0 + (x1 - x0)), min(h, sy0 + (y1 - y0))
grass = im.crop((sx0, sy0, sx1, sy1)).resize((x1 - x0, y1 - y0))
mask = Image.new("L", (x1 - x0, y1 - y0), 0)
ImageDraw.Draw(mask).ellipse((2, 2, x1 - x0 - 3, y1 - y0 - 3), fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(4))
im.paste(grass, (x0, y0), mask)

im.save(src, "PNG")
cand = Path(
    "/Users/vero/Documents/ChatGPT/interactive-portfolio/site/dist/assets/chapter-fortress-candidate.png"
)
im.save(cand, "PNG")
zoom = im.crop((int(w * 0.52), int(h * 0.22), int(w * 0.72), int(h * 0.42)))
zoom.save(
    "/Users/vero/Documents/ChatGPT/interactive-portfolio/site/dist/assets/chapter-fortress-yard-zoom.png"
)
print("patched", src, im.size, src.stat().st_size)
