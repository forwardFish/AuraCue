import json
import os
import sys

import cv2
import numpy as np


OUT_DIR = sys.argv[1]
SIZE = (430, 800)


def imread(path):
    data = np.fromfile(path, dtype=np.uint8)
    return cv2.imdecode(data, cv2.IMREAD_COLOR)


def imwrite(path, image):
    cv2.imencode(".png", image)[1].tofile(path)


def resize_to_viewport(image):
    return cv2.resize(image, SIZE, interpolation=cv2.INTER_AREA)


def annotate(image, boxes, title):
    canvas = image.copy()
    cv2.rectangle(canvas, (0, 0), (SIZE[0], 24), (245, 241, 255), -1)
    cv2.putText(canvas, title, (8, 17), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (95, 40, 20), 1, cv2.LINE_AA)
    colors = [
        (255, 0, 255), (0, 180, 255), (255, 0, 0), (0, 200, 0),
        (0, 255, 255), (180, 0, 255), (255, 160, 0), (0, 120, 255)
    ]
    for idx, box in enumerate(boxes):
        color = colors[idx % len(colors)]
        x = int(round(box["x"]))
        y = int(round(box["y"]))
        w = int(round(box["w"]))
        h = int(round(box["h"]))
        cv2.rectangle(canvas, (x, y), (x + w, y + h), color, 1)
        label = f'{box["name"]} {x},{y},{w},{h}'
        cv2.putText(canvas, label[:38], (x, max(12, y - 3)), cv2.FONT_HERSHEY_SIMPLEX, 0.31, color, 1, cv2.LINE_AA)
    return canvas


def reference_boxes_for(page_id):
    # Manual first-pass boxes: broad regions used to make side-by-side review readable.
    common = [
        {"name": "status", "x": 30, "y": 18, "w": 370, "h": 28},
        {"name": "logo", "x": 150, "y": 35, "w": 130, "h": 72},
        {"name": "title", "x": 40, "y": 110, "w": 350, "h": 56},
        {"name": "cta", "x": 45, "y": 690, "w": 340, "h": 44},
        {"name": "bottom_nav", "x": 26, "y": 740, "w": 375, "h": 50},
    ]
    dense = {
        "P0-06B": [
            {"name": "top_pill", "x": 145, "y": 75, "w": 142, "h": 24},
            {"name": "title", "x": 56, "y": 101, "w": 318, "h": 42},
            {"name": "subtitle", "x": 61, "y": 140, "w": 308, "h": 16},
            {"name": "tag_1", "x": 25, "y": 174, "w": 147, "h": 32},
            {"name": "tag_2", "x": 184, "y": 174, "w": 95, "h": 32},
            {"name": "tag_3", "x": 291, "y": 174, "w": 112, "h": 32},
            {"name": "card", "x": 149, "y": 214, "w": 132, "h": 190},
            {"name": "row_1", "x": 27, "y": 376, "w": 376, "h": 45},
            {"name": "row_2", "x": 27, "y": 423, "w": 376, "h": 45},
            {"name": "row_3", "x": 27, "y": 470, "w": 376, "h": 45},
            {"name": "row_4", "x": 27, "y": 517, "w": 376, "h": 45},
            {"name": "style_panel", "x": 27, "y": 567, "w": 376, "h": 157},
            {"name": "cta", "x": 45, "y": 690, "w": 340, "h": 42},
            {"name": "bottom_nav", "x": 26, "y": 740, "w": 375, "h": 50},
        ],
    }
    return dense.get(page_id, common)


def actual_boxes(dom_path):
    data = json.load(open(dom_path, "r", encoding="utf-8"))
    boxes = []
    for group in data.get("elements", {}).values():
        for item in group:
            if item["w"] > 0 and item["h"] > 0:
                boxes.append({k: item[k] for k in ("name", "x", "y", "w", "h")})
    return boxes[:22]


summary = []
for filename in sorted(os.listdir(OUT_DIR)):
    if not filename.endswith("-actual.png"):
        continue
    page_id = filename.replace("-actual.png", "")
    actual_path = os.path.join(OUT_DIR, filename)
    ref_path = os.path.join(OUT_DIR, f"{page_id}-reference.png")
    dom_path = os.path.join(OUT_DIR, f"{page_id}-dom.json")
    if not os.path.exists(ref_path) or not os.path.exists(dom_path):
        continue

    ref_img = resize_to_viewport(imread(ref_path))
    actual_img = resize_to_viewport(imread(actual_path))
    ref_boxes = reference_boxes_for(page_id)
    act_boxes = actual_boxes(dom_path)
    ref_annotated = annotate(ref_img, ref_boxes, f"REFERENCE {page_id}")
    act_annotated = annotate(actual_img, act_boxes, f"ACTUAL {page_id}")
    side = np.hstack([ref_img, actual_img])
    annotated_side = np.hstack([ref_annotated, act_annotated])
    diff = cv2.absdiff(ref_img, actual_img)
    heat = cv2.applyColorMap(cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY), cv2.COLORMAP_MAGMA)
    overlay = cv2.addWeighted(actual_img, 0.72, heat, 0.28, 0)

    imwrite(os.path.join(OUT_DIR, f"{page_id}-side-by-side.png"), side)
    imwrite(os.path.join(OUT_DIR, f"{page_id}-reference-annotated.png"), ref_annotated)
    imwrite(os.path.join(OUT_DIR, f"{page_id}-actual-annotated.png"), act_annotated)
    imwrite(os.path.join(OUT_DIR, f"{page_id}-annotated-side-by-side.png"), annotated_side)
    imwrite(os.path.join(OUT_DIR, f"{page_id}-diff-overlay.png"), overlay)

    rms = float(np.sqrt(np.mean((ref_img.astype(np.float32) - actual_img.astype(np.float32)) ** 2)))
    summary.append({"page": page_id, "rms": round(rms, 2)})

with open(os.path.join(OUT_DIR, "batch-summary.json"), "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print(os.path.join(OUT_DIR, "batch-summary.json"))
