from pathlib import Path
import sys

try:
    from PIL import Image
except Exception as e:
    print('Pillow não encontrado. Instale com: pip install pillow')
    raise


SRC = Path('assets/original-hero-portrait.jpg')
OUT = Path('assets')

if not SRC.exists():
    print(f'Arquivo fonte não encontrado: {SRC.resolve()}')
    sys.exit(1)

OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(SRC).convert('RGB')

def save_webp(width, filename, quality):
    ratio = im.height / im.width
    target_h = int(width * ratio)
    im2 = im.copy()
    im2.thumbnail((width, target_h), Image.LANCZOS)
    out_path = OUT / filename
    im2.save(out_path, 'WEBP', quality=quality, method=6)
    print('Saved', out_path)


save_webp(800, 'hero-portrait@800w.webp', 85)
save_webp(480, 'hero-portrait@480w.webp', 80)

# opcional: criar jpg otimizado para fallback
jpg_out = OUT / 'hero-portrait.jpg'
im_jpg = im.copy()
im_jpg.thumbnail((1000, int(1000 * im.height / im.width)), Image.LANCZOS)
im_jpg.save(jpg_out, 'JPEG', quality=85, optimize=True)
print('Saved', jpg_out)

print('Conversão concluída.')
