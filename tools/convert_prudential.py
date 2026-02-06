from pathlib import Path
import sys

try:
    from PIL import Image
except Exception:
    print('Pillow não encontrado. Instale com: pip install pillow')
    raise

SRC_DIR = Path('assets/prudential')
OUT_DIR = SRC_DIR

files = [
    ('postit-prudential.jpg', 'prudential-impact@1200w.webp', 'prudential-impact@800w.webp', 'prudential-impact@400w.webp', 'prudential-impact.jpg'),
    ('conflit-decision.jpg', 'prudential-conflict@1200w.webp', 'prudential-conflict@800w.webp', 'prudential-conflict@400w.webp', 'prudential-conflict.jpg'),
    ('prudential-evidence.jpg', 'prudential-evidence@1200w.webp', 'prudential-evidence@800w.webp', 'prudential-evidence@400w.webp', 'prudential-evidence.jpg'),
    ('porfolio-prudential.png', 'portfolio-prudential@1200w.webp', 'portfolio-prudential@800w.webp', 'portfolio-prudential@400w.webp', 'portfolio-prudential.jpg'),
]

for entry in files:
    # entry: (src_name, webp_1200, webp_800, webp_400, jpg_outname)
    if len(entry) != 5:
        print('Entrada inesperada no arquivo list:', entry)
        continue
    src_name, webp_1200, webp_800, webp_400, jpg_outname = entry
    src = SRC_DIR / src_name
    if not src.exists():
        print('Fonte não encontrada:', src)
        continue
    im = Image.open(src).convert('RGB')
    ratio = im.height / im.width

    # Special handling for portfolio image: generate large responsive sizes and a mobile-focused crop
    if 'porfolio' in src_name.lower() or 'portfolio' in src_name.lower():
        base = 'portfolio-prudential'
        large_sizes = [2560, 1440, 1200, 1024, 800, 400]
        for w in large_sizes:
            im_copy = im.copy()
            im_copy.thumbnail((w, int(w * ratio)), Image.LANCZOS)
            out_path = OUT_DIR / f"{base}@{w}w.webp"
            im_copy.save(out_path, 'WEBP', quality=90 if w>=1200 else 88, method=6)
            print('Saved', out_path)

        # mobile art-directed crop: focus on right-center area where the family silhouette sits
        # New crop box: slightly more left, include full top area so baby's head isn't cut
        left = int(im.width * 0.20)
        upper = int(im.height * 0.00)
        right = int(im.width * 0.98)
        lower = int(im.height * 0.95)
        try:
            crop = im.crop((left, upper, right, lower))
            crop_ratio = crop.height / crop.width
            crop.thumbnail((400, int(400 * crop_ratio)), Image.LANCZOS)
            out_mobile = OUT_DIR / f"{base}-mobile@400w.webp"
            crop.save(out_mobile, 'WEBP', quality=86, method=6)
            print('Saved', out_mobile)
            # Art-directed crops for large breakpoints (keep baby's head visible)
            try:
                # Define per-breakpoint crop boxes that progressively move the window down
                coords = {
                    1024: (left, int(im.height * 0.06), right, lower),
                    1440: (left, int(im.height * 0.12), right, lower),
                    2560: (left, int(im.height * 0.18), right, lower),
                }
                for cw, box in coords.items():
                    c = im.crop(box)
                    c_ratio = c.height / c.width
                    c.thumbnail((cw, int(cw * c_ratio)), Image.LANCZOS)
                    out_crop = OUT_DIR / f"{base}@{cw}w-crop.webp"
                    c.save(out_crop, 'WEBP', quality=90 if cw>=1200 else 88, method=6)
                    print('Saved', out_crop)
            except Exception as e:
                print('Crop sizes generation failed for', src, e)
        except Exception as e:
            print('Crop failed for', src, e)

        # optimized jpg fallback (resized to 1600px)
        im_jpg = im.copy()
        im_jpg.thumbnail((1600, int(1600 * ratio)), Image.LANCZOS)
        out_jpg = OUT_DIR / jpg_outname
        im_jpg.save(out_jpg, 'JPEG', quality=90, optimize=True)
        print('Saved', out_jpg)
        continue

    # Default processing for other images (1200/800/400)
    sizes = [
        (1200, webp_1200, 90),
        (800, webp_800, 88),
        (400, webp_400, 86),
    ]

    for w, outname, q in sizes:
        im_copy = im.copy()
        im_copy.thumbnail((w, int(w * ratio)), Image.LANCZOS)
        out_path = OUT_DIR / outname
        im_copy.save(out_path, 'WEBP', quality=q, method=6)
        print('Saved', out_path)

    # optimized jpg fallback (resized to 1000px)
    im_jpg = im.copy()
    im_jpg.thumbnail((1000, int(1000 * ratio)), Image.LANCZOS)
    out_jpg = OUT_DIR / jpg_outname
    im_jpg.save(out_jpg, 'JPEG', quality=90, optimize=True)
    print('Saved', out_jpg)

print('Conversão prudential concluída.')
