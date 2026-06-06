from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


MOJIBAKE = ["\ufffd", "????", "锛", "鈥", "涓", "浠", "娣", "鐨", "楠"]
VALID_TEMPLATE_IDS = {
    "TPL-ORCH-T00",
    "TPL-INTAKE",
    "TPL-REQ-MATRIX",
    "TPL-UI-MAP",
    "TPL-REF-MAP",
    "TPL-SCAFFOLD",
    "TPL-BACKEND-FOUNDATION",
    "TPL-API-DOMAIN",
    "TPL-DATA-IMPORT",
    "TPL-BUSINESS-ENGINE",
    "TPL-FRONTEND-SHELL",
    "TPL-FRONTEND-PAGE",
    "TPL-FRONTEND-COMPONENT",
    "TPL-ADMIN-WORKFLOW",
    "TPL-CONTRACT",
    "TPL-LOCAL-SMOKE",
    "TPL-LOCAL-ONLY-GUARD",
    "TPL-VISUAL-COMPARE",
    "TPL-VISUAL-REPAIR",
    "TPL-OWNER-SCENARIO",
    "TPL-OWNER-E2E",
    "TPL-API-DB-E2E",
    "TPL-EXTERNAL-DATA",
    "TPL-REPORT-GUARD",
    "TPL-FINAL-GATE",
    "TPL-REPAIR",
    "TPL-DEV-FEATURE",
    "TPL-DATA-MODEL-MIGRATION",
    "TPL-PAGE-CLICK-API",
    "TPL-TEST-UNIT",
    "TPL-TEST-INTEGRATION",
    "TPL-TEST-E2E",
    "TPL-CRAWLER-PIPELINE",
    "TPL-AI-PROVIDER",
    "TPL-SCHEDULER-JOB",
    "TPL-PAYMENT-ENTITLEMENT",
    "TPL-EXPORT-DOWNLOAD",
    "TPL-AUTH-IDENTITY",
    "TPL-PERFORMANCE",
    "TPL-SECURITY",
    "TPL-ACCESSIBILITY",
    "TPL-OBSERVABILITY",
    "TPL-DEPLOY-ENV",
    "TPL-RELEASE-RUNBOOK",
    "TPL-DOCS-HANDOFF",
    "TPL-CODE-REVIEW",
    "TPL-LEGACY-MIGRATION",
    "TPL-HARNESS-EVIDENCE-GATE",
    "TPL-SCREENSHOT-PIXEL-HARNESS",
    "TPL-DESIGN-TOKEN-ASSET-INVENTORY",
    "TPL-MINIAPP-SHELL",
    "TPL-MINIAPP-PAGE",
    "TPL-ASYNC-JOB-WORKFLOW",
    "TPL-REPORT-CARD-RENDERER",
    "TPL-QUOTA-RATE-LIMIT",
    "TPL-METRIC-DELTA-ENGINE",
    "TPL-ALERT-REPORTING",
    "TPL-LOCALE-ENCODING-GUARD",
}
TASK_TEMPLATE_RE = re.compile(r"(?:Task Template ID|任务模板 ID)\s*\|\s*`?(TPL-[A-Z0-9-]+)`?", re.I)
REQUIRED_TASK_SECTIONS = [
    "## Task Template Selection",
    "## Codex Exec",
    "## Dependency And Resume Gate",
    "## Stop Prevention Rules",
    "## Failure To Repair Routing",
    "## Result JSON",
    "## HANDOFF",
]
ZH_REQUIRED_TASK_SECTIONS = [
    "## 0. 任务模板选择",
    "## 执行命令",
    "## 依赖与续跑门槛",
    "## 防停止规则",
    "## 失败修复路由",
    "## 结果 JSON",
    "## HANDOFF",
]
PLACEHOLDER_RE = re.compile(r"<(Project|slug|TASK|absolute|future|task name|project root)[^>]*>", re.I)


def has_cjk(text: str) -> bool:
    return any("\u4e00" <= ch <= "\u9fff" for ch in text)


def read_utf8(path: Path) -> tuple[str | None, str | None]:
    data = path.read_bytes()
    if data.startswith(b"\xef\xbb\xbf"):
        return None, "UTF-8 BOM is not allowed"
    try:
        return data.decode("utf-8"), None
    except UnicodeDecodeError as exc:
        return None, f"not valid UTF-8: {exc}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", required=True)
    parser.add_argument("--slug", required=True)
    parser.add_argument("--language", default="auto")
    parser.add_argument("--template-root")
    parser.add_argument("--json-out")
    args = parser.parse_args()

    root = Path(args.project_root)
    base = root / "docs" / "auto-execute"
    task_dir = base / f"{args.slug}-tasks"
    template_root = Path(args.template_root) if args.template_root else Path(__file__).resolve().parents[1] / "references" / "templates"
    failures: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    docs = sorted(base.glob("*.md")) + sorted(task_dir.glob("*.md"))
    if not docs:
        failures.append({"check": "document_presence", "path": str(base), "message": "no markdown docs found"})

    language = args.language
    if language == "auto":
        source_text = ""
        for source in [root / "docs", root / "README.md"]:
            if source.is_dir():
                for p in source.rglob("*.md"):
                    text, _ = read_utf8(p)
                    source_text += text or ""
            elif source.exists():
                text, _ = read_utf8(source)
                source_text += text or ""
        language = "zh-CN" if has_cjk(source_text) else "en"

    for path in docs:
        rel = str(path.relative_to(root))
        text, err = read_utf8(path)
        if err:
            failures.append({"check": "utf8", "path": rel, "message": err})
            continue
        assert text is not None
        bad = [marker for marker in MOJIBAKE if marker in text]
        if bad:
            failures.append({"check": "mojibake", "path": rel, "message": ",".join(bad)})
        if PLACEHOLDER_RE.search(text):
            failures.append({"check": "placeholder", "path": rel, "message": "template placeholder remains"})
        if language == "zh-CN" and path.name != f"{args.slug}-codex-exec-prompts-split.md":
            prose = "\n".join(line for line in text.splitlines() if not line.strip().startswith(("`", "|", "# Task T", "codex ", "Set-Location")))
            if not has_cjk(prose):
                failures.append({"check": "language", "path": rel, "message": "zh-CN project doc lacks Chinese prose"})

    tasks = sorted(task_dir.glob("T*.md"))
    if not (task_dir / "T00-omx-auto-execute-orchestrator.md").exists():
        failures.append({"check": "t00", "path": str(task_dir), "message": "missing T00 orchestrator"})
    for task in tasks:
        text, err = read_utf8(task)
        if err or text is None:
            continue
        for zh_section, en_section in zip(ZH_REQUIRED_TASK_SECTIONS, REQUIRED_TASK_SECTIONS):
            if zh_section not in text and en_section not in text:
                failures.append({"check": "task_section", "path": str(task.relative_to(root)), "message": f"missing {zh_section} / {en_section}"})
        template_match = TASK_TEMPLATE_RE.search(text)
        if not template_match:
            failures.append({"check": "task_template", "path": str(task.relative_to(root)), "message": "missing Task Template ID / 任务模板 ID"})
        else:
            template_id = template_match.group(1).upper()
            if template_id not in VALID_TEMPLATE_IDS:
                failures.append({"check": "task_template", "path": str(task.relative_to(root)), "message": f"unknown template id {template_id}"})
            elif not (template_root / f"{template_id}.md").exists():
                failures.append({"check": "task_template_file", "path": str(task.relative_to(root)), "message": f"missing independent template file {template_root / f'{template_id}.md'}"})
        template_required = [
            ("template_rationale", ["为什么选这个模板", "Template rationale", "why this template"]),
            ("primary_surface", ["主验收面", "Primary Surface", "primary acceptance surface"]),
            ("covered_objects", ["覆盖对象", "Covered IDs", "covered requirement"]),
        ]
        for check, markers in template_required:
            if not any(marker in text for marker in markers):
                failures.append({"check": check, "path": str(task.relative_to(root)), "message": "missing task template matching field"})
        task_id = task.name.split("-", 1)[0]
        if f"docs/auto-execute/results/{task_id}.json" not in text:
            failures.append({"check": "result_path", "path": str(task.relative_to(root)), "message": "missing concrete result JSON path"})
        if f"docs/auto-execute/latest/{task_id}-HANDOFF.md" not in text:
            failures.append({"check": "handoff_path", "path": str(task.relative_to(root)), "message": "missing concrete HANDOFF path"})

    quality_audit = base / f"{args.slug}-task-pack-quality-audit.md"
    if quality_audit.exists():
        text, err = read_utf8(quality_audit)
        if text and "Task Template Matching Audit" not in text:
            failures.append({"check": "quality_audit", "path": str(quality_audit.relative_to(root)), "message": "missing Task Template Matching Audit"})

    external = base / f"{args.slug}-external-data-validation-matrix.md"
    if external.exists():
        text, err = read_utf8(external)
        if text:
            for word in ["unique_key", "upsert", "readback"]:
                if word not in text:
                    warnings.append({"check": "external_data", "path": str(external.relative_to(root)), "message": f"missing {word}"})

    verdict = "READY_FOR_AUTO_EXECUTE" if not failures else "NEEDS_REGENERATION"
    result = {"verdict": verdict, "language": language, "failures": failures, "warnings": warnings}
    output = json.dumps(result, ensure_ascii=False, indent=2)
    if args.json_out:
        out = Path(args.json_out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(output + "\n", encoding="utf-8")
    print(output)
    return 0 if verdict == "READY_FOR_AUTO_EXECUTE" else 1


if __name__ == "__main__":
    raise SystemExit(main())
