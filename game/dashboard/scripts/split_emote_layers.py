#!/usr/bin/env python3
"""Split avatar_wave_celebrate_spritesheet into wave/celebrate sheets + paper-doll layers.

Layers: feet → body → hands → head (same slots as walk sheets).
Magenta (#FF00FF) is preserved as chroma key.
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
AVATARS = ROOT / "src" / "assets" / "avatars"
SOURCE = AVATARS / "avatar_wave_celebrate_spritesheet.png"

CHROMA = (255, 0, 255, 255)
COLUMNS = 8
SOURCE_ROWS = 2
FRAME_W = 192
FRAME_H = 512  # 1024 / 2

ANIMATIONS = {
    "wave_s": {"row": 0, "frames": 8, "frameDurationMs": 100},
    "celebrate_s": {"row": 1, "frames": 8, "frameDurationMs": 90},
}

LAYERS = ("feet", "body", "hands", "head")


def is_chroma(r: int, g: int, b: int, tol: int = 45) -> bool:
    return (r - 255) ** 2 + g**2 + (b - 255) ** 2 <= tol * tol


def is_near_black(r: int, g: int, b: int) -> bool:
    return r + g + b < 48


def is_blue_tunic(r: int, g: int, b: int) -> bool:
    return b >= 100 and b > r + 25 and b >= g + 15


def is_gold_buckle(r: int, g: int, b: int) -> bool:
    return r >= 180 and g >= 130 and b <= 110 and r >= g


def is_peach_skin(r: int, g: int, b: int) -> bool:
    return r >= 210 and g >= 150 and 70 <= b <= 190 and r > g >= b - 10


def is_dark_boot(r: int, g: int, b: int) -> bool:
    return r <= 95 and g <= 60 and b <= 45 and r >= g >= b - 5 and r + g + b >= 30


def is_mid_brown(r: int, g: int, b: int) -> bool:
    """Hair / belt / beige legs — disambiguate spatially."""
    if is_peach_skin(r, g, b) or is_blue_tunic(r, g, b) or is_gold_buckle(r, g, b):
        return False
    if is_dark_boot(r, g, b) or is_near_black(r, g, b):
        return False
    return (
        40 <= r <= 160
        and 20 <= g <= 100
        and b <= 70
        and r > g
        and g >= b - 5
        and (r - b) >= 25
    )


def content_ys(pixels: list[tuple[int, int, int, int]], w: int, h: int) -> tuple[int, int] | None:
    ymin, ymax = h, -1
    for y in range(h):
        row = y * w
        for x in range(w):
            r, g, b, a = pixels[row + x]
            if a < 200 or is_chroma(r, g, b):
                continue
            ymin = min(ymin, y)
            ymax = max(ymax, y)
    if ymax < 0:
        return None
    return ymin, ymax


def flood(
    seeds: list[int],
    allowed: list[bool],
    w: int,
    h: int,
) -> list[bool]:
    """4-connected flood through `allowed` pixels starting from seeds."""
    seen = [False] * (w * h)
    stack = [i for i in seeds if allowed[i]]
    for i in stack:
        seen[i] = True
    while stack:
        i = stack.pop()
        x = i % w
        y = i // w
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            j = ny * w + nx
            if seen[j] or not allowed[j]:
                continue
            seen[j] = True
            stack.append(j)
    return seen


def nearest_label(
    i: int,
    labels: list[str | None],
    interior: list[bool],
    w: int,
    h: int,
    radius: int = 4,
) -> str | None:
    """Vote using nearby *interior* labels only (never other outline pixels)."""
    x = i % w
    y = i // w
    votes: dict[str, int] = {}
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            nx, ny = x + dx, y + dy
            if nx < 0 or ny < 0 or nx >= w or ny >= h:
                continue
            j = ny * w + nx
            if not interior[j]:
                continue
            lab = labels[j]
            if not lab:
                continue
            dist = abs(dx) + abs(dy)
            votes[lab] = votes.get(lab, 0) + (radius + 1 - dist)
    if not votes:
        return None
    return max(votes, key=votes.get)


def classify_frame(frame: Image.Image) -> dict[str, Image.Image]:
    frame = frame.convert("RGBA")
    w, h = frame.size
    src = list(frame.getdata())
    n = w * h

    extents = content_ys(src, w, h)
    labels: list[str | None] = [None] * n
    interior = [False] * n

    if extents is None:
        return {name: Image.new("RGBA", (w, h), CHROMA) for name in LAYERS}

    ymin, ymax = extents
    height = max(1, ymax - ymin)
    head_band = ymin + int(height * 0.55)
    feet_band = ymin + int(height * 0.70)
    belt_lo = ymin + int(height * 0.40)
    belt_hi = ymin + int(height * 0.70)

    live = [False] * n
    peach = [False] * n
    hairish = [False] * n
    outline = [False] * n

    for i, (r, g, b, a) in enumerate(src):
        if a < 200 or is_chroma(r, g, b):
            continue
        live[i] = True
        y = i // w
        if is_near_black(r, g, b):
            outline[i] = True
            continue
        if is_blue_tunic(r, g, b) or is_gold_buckle(r, g, b):
            labels[i] = "body"
            interior[i] = True
        elif is_peach_skin(r, g, b):
            peach[i] = True
        elif is_dark_boot(r, g, b):
            # Dark hair shares boot-like RGB — only trust boots near the ground.
            if y >= feet_band:
                labels[i] = "feet"
                interior[i] = True
            else:
                hairish[i] = True
        elif is_mid_brown(r, g, b):
            if y <= head_band:
                hairish[i] = True
            elif belt_lo <= y <= belt_hi:
                x = i % w
                near_blue = False
                for dy in range(-3, 4):
                    for dx in range(-3, 4):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < w and 0 <= ny < h and labels[ny * w + nx] == "body":
                            near_blue = True
                            break
                    if near_blue:
                        break
                if near_blue:
                    labels[i] = "body"
                    interior[i] = True
                elif y >= feet_band:
                    labels[i] = "feet"
                    interior[i] = True
                else:
                    hairish[i] = True
            else:
                labels[i] = "feet"
                interior[i] = True

    # Hair region = mid/dark browns seeded in the upper band.
    hair_seeds = [i for i, v in enumerate(hairish) if v]
    hair_only = flood(hair_seeds, hairish, w, h)
    for i, v in enumerate(hair_only):
        if v:
            labels[i] = "head"
            interior[i] = True

    # Face = peach overlapping the hair front rectangle; remaining peach = hands.
    if hair_seeds:
        hx = [i % w for i, v in enumerate(hair_only) if v]
        hy = [i // w for i, v in enumerate(hair_only) if v]
        min_x, max_x = min(hx), max(hx)
        min_y, max_y = min(hy), max(hy)
        hair_h = max(1, max_y - min_y)
        face_top = min_y + int(hair_h * 0.28)
        face_bot = max_y + max(12, int(height * 0.06))
        pad_x = max(2, int((max_x - min_x) * 0.08))
        for i, v in enumerate(peach):
            if not v:
                continue
            x = i % w
            y = i // w
            if (min_x - pad_x) <= x <= (max_x + pad_x) and face_top <= y <= face_bot:
                labels[i] = "head"
                interior[i] = True

        # Keep only the largest peach blob on the head; side/raised hands become hands.
        face_idx = [i for i, v in enumerate(peach) if v and labels[i] == "head"]
        if face_idx:
            remaining = set(face_idx)
            components: list[list[int]] = []
            while remaining:
                start = remaining.pop()
                stack = [start]
                comp = [start]
                seen = {start}
                while stack:
                    i = stack.pop()
                    x = i % w
                    y = i // w
                    for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                        if nx < 0 or ny < 0 or nx >= w or ny >= h:
                            continue
                        j = ny * w + nx
                        if j in seen or j not in remaining:
                            continue
                        seen.add(j)
                        remaining.discard(j)
                        stack.append(j)
                        comp.append(j)
                components.append(comp)
            components.sort(key=len, reverse=True)
            for comp in components[1:]:
                for i in comp:
                    labels[i] = "hands"
                    interior[i] = True


    # Remaining peach = hands (incl. wave / celebrate raised arms).
    for i, v in enumerate(peach):
        if v and labels[i] is None:
            labels[i] = "hands"
            interior[i] = True

    # Skin should never stay on body/feet (highlight mis-buckets).
    for i, v in enumerate(peach):
        if not v:
            continue
        if labels[i] in ("body", "feet"):
            labels[i] = "hands"
            interior[i] = True

    # Any leftover non-outline live pixels.
    for i in range(n):
        if not live[i] or outline[i] or labels[i] is not None:
            continue
        y = i // w
        if y <= head_band:
            labels[i] = "head"
        elif y >= feet_band:
            labels[i] = "feet"
        else:
            labels[i] = "body"
        interior[i] = True

    # Outlines: nearest interior label only (prevents silhouette-wide flood).
    for i in range(n):
        if not outline[i] or labels[i] is not None:
            continue
        lab = nearest_label(i, labels, interior, w, h, radius=5)
        if lab is None:
            y = i // w
            if y <= head_band:
                lab = "head"
            elif y >= feet_band:
                lab = "feet"
            else:
                lab = "body"
        labels[i] = lab

    out: dict[str, Image.Image] = {}
    for name in LAYERS:
        layer_px = [CHROMA] * n
        for i, lab in enumerate(labels):
            if lab == name:
                layer_px[i] = src[i]
        img = Image.new("RGBA", (w, h))
        img.putdata(layer_px)
        out[name] = img
    return out


def paste_row(sheet: Image.Image, frames: list[Image.Image], row: int = 0) -> None:
    for col, fr in enumerate(frames):
        sheet.paste(fr, (col * FRAME_W, row * FRAME_H))


def write_meta(
    path: Path,
    *,
    image: str,
    animation: str,
    slot: str | None,
    notes: str,
) -> None:
    anim = ANIMATIONS[animation]
    meta = {
        "image": image,
        "imageWidth": FRAME_W * COLUMNS,
        "imageHeight": FRAME_H,
        "columns": COLUMNS,
        "rows": 1,
        "frameWidth": FRAME_W,
        "frameHeight": FRAME_H,
        "chromaKey": "#FF00FF",
        "animations": {
            animation: {
                "row": 0,
                "frames": anim["frames"],
                "frameDurationMs": anim["frameDurationMs"],
            }
        },
        "directions": {"s": "front / toward camera"},
        "notes": notes,
    }
    if slot:
        meta["slot"] = slot
    path.write_text(json.dumps(meta, indent=2) + "\n")


def main() -> None:
    src = Image.open(SOURCE).convert("RGBA")
    assert src.size == (FRAME_W * COLUMNS, FRAME_H * SOURCE_ROWS), src.size

    for anim_name, spec in ANIMATIONS.items():
        prefix = "wave" if anim_name == "wave_s" else "celebrate"
        row = spec["row"]
        full_frames: list[Image.Image] = []
        layer_frames: dict[str, list[Image.Image]] = {k: [] for k in LAYERS}

        for col in range(COLUMNS):
            box = (
                col * FRAME_W,
                row * FRAME_H,
                (col + 1) * FRAME_W,
                (row + 1) * FRAME_H,
            )
            frame = src.crop(box)
            full_frames.append(frame)
            parts = classify_frame(frame)
            for layer in LAYERS:
                layer_frames[layer].append(parts[layer])

        full_path = AVATARS / f"avatar_{prefix}_spritesheet.png"
        full_sheet = Image.new("RGBA", (FRAME_W * COLUMNS, FRAME_H), CHROMA)
        paste_row(full_sheet, full_frames)
        full_sheet.save(full_path)
        write_meta(
            AVATARS / f"avatar_{prefix}_spritesheet.json",
            image=full_path.name,
            animation=anim_name,
            slot=None,
            notes=(
                f"Full-body {prefix} sheet sliced from avatar_wave_celebrate_spritesheet. "
                "Prefer composing avatar_{prefix}_* layer sheets at runtime."
            ),
        )
        print(f"wrote {full_path.name}")

        for layer in LAYERS:
            out = AVATARS / f"avatar_{prefix}_{layer}_spritesheet.png"
            sheet = Image.new("RGBA", (FRAME_W * COLUMNS, FRAME_H), CHROMA)
            paste_row(sheet, layer_frames[layer])
            sheet.save(out)
            write_meta(
                AVATARS / f"avatar_{prefix}_{layer}_spritesheet.json",
                image=out.name,
                animation=anim_name,
                slot=layer,
                notes=(
                    f"Layer '{layer}' for {anim_name} from avatar_wave_celebrate_spritesheet. "
                    "Compose feet→body→hands→head."
                ),
            )
            print(f"wrote {out.name}")

    combined_meta = {
        "image": "avatar_wave_celebrate_spritesheet.png",
        "imageWidth": FRAME_W * COLUMNS,
        "imageHeight": FRAME_H * SOURCE_ROWS,
        "columns": COLUMNS,
        "rows": SOURCE_ROWS,
        "frameWidth": FRAME_W,
        "frameHeight": FRAME_H,
        "chromaKey": "#FF00FF",
        "notes": (
            "Source sheet for emote split. Runtime prefers avatar_wave_* and "
            "avatar_celebrate_* layer sheets."
        ),
        "animations": ANIMATIONS,
        "directions": {"s": "front / toward camera"},
    }
    (AVATARS / "avatar_wave_celebrate_spritesheet.json").write_text(
        json.dumps(combined_meta, indent=2) + "\n"
    )
    print("done")


if __name__ == "__main__":
    main()
