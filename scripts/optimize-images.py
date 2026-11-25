#!/usr/bin/env python3
"""Generate page-focused WebP assets and add safe image loading attributes."""

from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "images" / "optimized"


def target_pages() -> list[Path]:
    pages = [ROOT / "index.html", ROOT / "news.html", ROOT / "cases.html", ROOT / "contact.html"]
    pages.extend(sorted(ROOT.glob("news-detail-*.html")))
    return pages


def settings(page: Path, source: str) -> dict[str, int | bool]:
    relative = source.removeprefix("images/")
    if relative.startswith("news/") and page.name in {"index.html", "news.html"}:
        return {"width": 1000, "aspect": 2.0, "quality": 78}
    if relative.startswith("cases/"):
        return {"width": 1400, "quality": 80}
    if relative.startswith("news/"):
        return {"width": 1400, "quality": 80}
    if relative.startswith("contact/"):
        return {"width": 1000, "quality": 88}
    return {"width": 1000, "quality": 82}


def output_path(source: str) -> Path:
    source_path = Path(source)
    relative = source_path.relative_to("images")
    return OUTPUT / relative.with_suffix(".webp")


def optimize(source: str, config: dict[str, int | float | bool]) -> tuple[str, int, int]:
    source_path = ROOT / source
    destination = output_path(source)
    destination.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source_path) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        aspect = config.get("aspect")
        if aspect:
            target_height = round(image.width / float(aspect))
            if image.height > target_height:
                top = max(0, (image.height - target_height) // 2)
                image = image.crop((0, top, image.width, top + target_height))
        width = int(config["width"])
        if image.width > width:
            height = round(image.height * width / image.width)
            image = image.resize((width, height), Image.Resampling.LANCZOS)
        image.save(
            destination,
            "WEBP",
            quality=int(config["quality"]),
            method=6,
            optimize=True,
        )
        return (
            destination.relative_to(ROOT).as_posix(),
            image.width,
            image.height,
        )


def set_attribute(tag: str, name: str, value: str) -> str:
    attribute = re.compile(rf"\s{re.escape(name)}=(['\"]).*?\1", re.IGNORECASE)
    replacement = f' {name}="{value}"'
    if attribute.search(tag):
        return attribute.sub(replacement, tag, count=1)
    return tag[:-1].rstrip() + replacement + ">"


def add_class(tag: str, class_name: str) -> str:
    class_attribute = re.search(r"\sclass=([\"'])(.*?)\1", tag, re.IGNORECASE)
    if class_attribute:
        classes = class_attribute.group(2).split()
        if class_name not in classes:
            classes.append(class_name)
        return re.sub(
            r"\sclass=([\"']).*?\1",
            f' class="{" ".join(classes)}"',
            tag,
            count=1,
            flags=re.IGNORECASE,
        )
    return tag[:-1].rstrip() + f' class="{class_name}">'


generated: dict[str, tuple[str, int, int]] = {}
changed = [0]

for page in target_pages():
    html = page.read_text()
    image_index = [0]

    def replace_image(match: re.Match[str]) -> str:
        tag = match.group(0)
        source_match = re.search(r'\ssrc=(["\'])(.*?)\1', tag, re.IGNORECASE)
        if not source_match:
            return tag
        source = source_match.group(2).split("?")[0]
        if not source.startswith("images/") or source.startswith("images/optimized/") or source.startswith("images/clients/"):
            return tag
        if not (ROOT / source).is_file():
            return tag

        config = settings(page, source)
        if source not in generated:
            generated[source] = optimize(source, config)
        optimized, width, height = generated[source]

        tag = re.sub(
            r'\ssrc=(["\']).*?\1',
            f' src="{optimized}"',
            tag,
            count=1,
            flags=re.IGNORECASE,
        )
        if page.name == "contact.html" and source.startswith("images/contact/"):
            tag = add_class(tag, "contact-qr")
        tag = set_attribute(tag, "width", str(width))
        tag = set_attribute(tag, "height", str(height))
        tag = set_attribute(tag, "decoding", "async")
        if page.name == "index.html" or page.name == "news.html" or page.name == "cases.html" or page.name == "contact.html":
            tag = set_attribute(tag, "loading", "lazy")
        elif image_index[0] == 0:
            tag = set_attribute(tag, "loading", "eager")
            tag = set_attribute(tag, "fetchpriority", "high")
        else:
            tag = set_attribute(tag, "loading", "lazy")
        image_index[0] += 1
        changed[0] += 1
        return tag

    updated = re.sub(r"<img\b[^>]*>", replace_image, html, flags=re.IGNORECASE)
    if updated != html:
        page.write_text(updated)

print(
    {
        "pages": len(target_pages()),
        "images_used": len(generated),
        "image_tags_updated": changed[0],
        "optimized_bytes": sum(path.stat().st_size for path in OUTPUT.rglob("*.webp")),
    }
)
