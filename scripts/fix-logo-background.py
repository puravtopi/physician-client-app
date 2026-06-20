"""Remove solid background from logo.png and save with transparency."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "public" / "assets" / "images" / "logo.png"


def sample_background_color(img: Image.Image) -> tuple[int, int, int]:
    width, height = img.size
    points = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
        (width // 2, 0),
        (0, height // 2),
    ]
    pixels = [img.getpixel(point)[:3] for point in points]
    return max(set(pixels), key=pixels.count)


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> int:
    return sum(abs(a[i] - b[i]) for i in range(3))


def main() -> None:
    img = Image.open(LOGO_PATH).convert("RGBA")
    background = sample_background_color(img)
    threshold = 30

    data = img.getdata()
    new_data = []
    for pixel in data:
        rgb = pixel[:3]
        if color_distance(rgb, background) <= threshold:
            new_data.append((rgb[0], rgb[1], rgb[2], 0))
        else:
            new_data.append(pixel)

    img.putdata(new_data)
    img.save(LOGO_PATH, "PNG")
    print(f"Background color: #{background[0]:02X}{background[1]:02X}{background[2]:02X}")
    print(f"Updated: {LOGO_PATH}")


if __name__ == "__main__":
    main()
