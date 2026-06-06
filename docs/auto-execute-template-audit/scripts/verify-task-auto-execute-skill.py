from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def verify_target(manifest: dict[str, object], target_root: Path) -> dict[str, object]:
    missing: list[str] = []
    changed: list[str] = []
    extra = sorted(
        path.relative_to(target_root).as_posix()
        for path in target_root.rglob("*")
        if path.is_file()
    ) if target_root.exists() else []
    expected_paths = {item["path"] for item in manifest["files"]}

    for item in manifest["files"]:
        relative = item["path"]
        path = target_root / relative
        if not path.exists():
            missing.append(relative)
            continue
        actual_hash = sha256_file(path)
        if actual_hash != item["sha256"]:
            changed.append(relative)

    extra = [item for item in extra if item not in expected_paths and "__pycache__/" not in item]
    return {
        "targetRoot": str(target_root),
        "exists": target_root.exists(),
        "missing": missing,
        "changed": changed,
        "extra": extra,
        "verdict": "PASS" if target_root.exists() and not missing and not changed else "FAIL",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", default=r"D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill-manifest.json")
    parser.add_argument("--target-root", action="append", required=True)
    args = parser.parse_args()

    manifest = json.loads(Path(args.manifest).read_text(encoding="utf-8"))
    results = [verify_target(manifest, Path(root)) for root in args.target_root]
    print(json.dumps({"results": results}, ensure_ascii=False, indent=2))
    return 0 if all(item["verdict"] == "PASS" for item in results) else 1


if __name__ == "__main__":
    raise SystemExit(main())
