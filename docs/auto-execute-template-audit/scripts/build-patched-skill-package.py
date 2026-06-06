from __future__ import annotations

import argparse
import ast
import hashlib
import json
import zipfile
from datetime import datetime, timezone
from pathlib import Path


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def template_ids(skill_root: Path) -> set[str]:
    return {path.stem for path in (skill_root / "references" / "templates").glob("TPL-*.md")}


def audit_ids(skill_root: Path) -> set[str]:
    path = skill_root / "scripts" / "audit-task-pack.py"
    module = ast.parse(path.read_text(encoding="utf-8"))
    for node in module.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "VALID_TEMPLATE_IDS":
                    return {item.value for item in node.value.elts}
    raise ValueError(f"VALID_TEMPLATE_IDS not found in {path}")


def iter_files(root: Path) -> list[Path]:
    return sorted(path for path in root.rglob("*") if path.is_file())


def zip_matches_skill(skill_root: Path, package_path: Path) -> bool:
    if not package_path.exists():
        return False
    expected = {
        path.relative_to(skill_root).as_posix(): sha256_file(path)
        for path in iter_files(skill_root)
    }
    try:
        with zipfile.ZipFile(package_path, "r") as archive:
            names = sorted(item for item in archive.namelist() if not item.endswith("/"))
            if names != sorted(expected):
                return False
            for name in names:
                digest = hashlib.sha256(archive.read(name)).hexdigest()
                if digest != expected[name]:
                    return False
        return True
    except (OSError, zipfile.BadZipFile):
        return False


def build_manifest(skill_root: Path, package_path: Path) -> dict[str, object]:
    templates = template_ids(skill_root)
    valid_ids = audit_ids(skill_root)
    files = []
    for path in iter_files(skill_root):
        relative = path.relative_to(skill_root).as_posix()
        files.append(
            {
                "path": relative,
                "size": path.stat().st_size,
                "sha256": sha256_file(path),
            }
        )
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "skillName": "task-auto-execute",
        "skillRoot": str(skill_root),
        "packagePath": str(package_path),
        "templateCount": len(templates),
        "auditIdCount": len(valid_ids),
        "missingInAudit": sorted(templates - valid_ids),
        "extraInAudit": sorted(valid_ids - templates),
        "files": files,
    }


def build_zip(skill_root: Path, package_path: Path) -> Path:
    if zip_matches_skill(skill_root, package_path):
        return package_path

    package_path.parent.mkdir(parents=True, exist_ok=True)
    try:
        if package_path.exists():
            package_path.unlink()
        actual_path = package_path
    except PermissionError:
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        actual_path = package_path.with_name(f"{package_path.stem}-{timestamp}{package_path.suffix}")

    with zipfile.ZipFile(actual_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in iter_files(skill_root):
            archive.write(path, path.relative_to(skill_root).as_posix())
    return actual_path


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--skill-root", default=r"D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill\task-auto-execute")
    parser.add_argument("--manifest-out", default=r"D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill-manifest.json")
    parser.add_argument("--zip-out", default=r"D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\task-auto-execute-patched-skill.zip")
    args = parser.parse_args()

    skill_root = Path(args.skill_root)
    manifest_out = Path(args.manifest_out)
    package_path = Path(args.zip_out)

    if not skill_root.exists():
        raise FileNotFoundError(skill_root)

    package_path = build_zip(skill_root, package_path)
    manifest = build_manifest(skill_root, package_path)
    manifest["packageSha256"] = sha256_file(package_path)
    manifest["packageSize"] = package_path.stat().st_size

    manifest_out.parent.mkdir(parents=True, exist_ok=True)
    manifest_out.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: manifest[key] for key in ["templateCount", "auditIdCount", "missingInAudit", "extraInAudit", "packagePath", "packageSha256"]}, ensure_ascii=False, indent=2))
    return 0 if manifest["templateCount"] == 58 and manifest["auditIdCount"] == 58 and not manifest["missingInAudit"] and not manifest["extraInAudit"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
