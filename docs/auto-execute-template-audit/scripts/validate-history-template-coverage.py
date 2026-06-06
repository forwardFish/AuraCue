from __future__ import annotations

import argparse
import json
import re
import subprocess
from collections import Counter
from pathlib import Path


RULES: list[tuple[str, list[str]]] = [
    ("TPL-ORCH-T00", ["orchestrator", "auto-execute-orchestrator"]),
    ("TPL-HARNESS-EVIDENCE-GATE", ["harness-and-evidence", "evidence-gates", "harness-decision", "source-of-truth", "evidence-gate", "quality-gate", "runtime-gate"]),
    ("TPL-SCREENSHOT-PIXEL-HARNESS", ["screenshot-harness", "pixelmatch", "pixel-harness", "capture-harness", "runtime-visual-capture", "visual-capture-pixel", "artifact-writer", "pixel-diff-harness", "comparison-harness"]),
    ("TPL-DESIGN-TOKEN-ASSET-INVENTORY", ["ui-token", "design-token", "design-tokens", "asset-inventory", "tokens-routes", "visual-target-map", "tokens-navigation"]),
    ("TPL-MINIAPP-SHELL", ["miniapp-shell", "miniprogram-shell", "mini-program-shell", "shell-navigation", "mini-program-backend-shared-workspace"]),
    ("TPL-MINIAPP-PAGE", ["miniprogram-ui", "miniprogram-home", "miniprogram-today", "miniprogram-fake", "miniprogram-tasks", "miniprogram-shop", "owner-miniprogram", "mini-program", "miniapp"]),
    ("TPL-ASYNC-JOB-WORKFLOW", ["generation-job", "structured-card-api", "background-job", "async-job"]),
    ("TPL-REPORT-CARD-RENDERER", ["share-card", "card-renderer", "report-question-cards", "daily-report", "publish-report", "task-report-api", "full-report-feedback-export-api"]),
    ("TPL-QUOTA-RATE-LIMIT", ["quota", "quota-auth", "rate-limit"]),
    ("TPL-LOCALE-ENCODING-GUARD", ["mojibake", "encoding", "utf-8"]),
    ("TPL-ALERT-REPORTING", ["alerts", "alert", "task-log-daily-report", "daily-report"]),
    ("TPL-METRIC-DELTA-ENGINE", ["metric-snapshot", "snapshot-delta", "delta-engine", "metrics"]),
    ("TPL-CRAWLER-PIPELINE", ["crawler", "collectors", "collect", "normalize", "pipeline"]),
    ("TPL-AI-PROVIDER", ["ai-", "-ai", "llm", "prompt", "deepseek", "recognition"]),
    ("TPL-SCHEDULER-JOB", ["scheduler", "pending-replay", "replay", "cron"]),
    ("TPL-PAYMENT-ENTITLEMENT", ["payment", "pay", "entitlement", "unlock", "paid", "1-yuan", "subscription"]),
    ("TPL-EXPORT-DOWNLOAD", ["export", "pdf", "word", "download"]),
    ("TPL-AUTH-IDENTITY", ["auth", "permission", "profile", "login", "authorization", "secret-hygiene"]),
    ("TPL-ADMIN-WORKFLOW", ["admin", "upload-review", "review-publish", "publish"]),
    ("TPL-API-DB-E2E", ["all-api", "api-db", "db-readback", "contract-db-tests", "readback-and-frontend-backend-contract", "backend-api-contract-tests"]),
    ("TPL-API-DOMAIN", ["api", "contract", "backend", "dto"]),
    ("TPL-DATA-MODEL-MIGRATION", ["db-schema", "local-db", "repository", "schema", "models", "db-backed"]),
    ("TPL-DATA-IMPORT", ["import", "parser", "upload"]),
    ("TPL-BUSINESS-ENGINE", ["engine", "risk", "analysis", "state-machine", "repair-drawer"]),
    ("TPL-FRONTEND-SHELL", ["shell", "routes", "navigation"]),
    ("TPL-FRONTEND-PAGE", ["page", "home", "preview", "result", "ui", "screen", "flow", "my-reports", "orders-feedback", "wrong-question", "exercise-feedback"]),
    ("TPL-VISUAL-REPAIR", ["visual-repair", "one-to-one-repair", "pixel-loop-repair", "repair-loop", "visual-convergence"]),
    ("TPL-VISUAL-COMPARE", ["visual-one-to-one", "one-to-one", "pixel", "screenshot", "ui-one-to-one"]),
    ("TPL-PAGE-CLICK-API", ["all-page-clicks", "click-route", "click-api", "page-click", "simulated-user-page-click"]),
    ("TPL-OWNER-SCENARIO", ["test-plan", "journey-test-plan", "scenario"]),
    ("TPL-OWNER-E2E", ["owner", "e2e", "journey", "click"]),
    ("TPL-TEST-E2E", ["full-integration", "full-flow", "regression", "local-test-suite", "frontend-backend-page-runtime"]),
    ("TPL-LOCAL-ONLY-GUARD", ["local-only", "secret-guard", "safety", "cloud", "safe-local"]),
    ("TPL-RELEASE-RUNBOOK", ["runbook", "env-docs", "operator-runbook"]),
    ("TPL-FINAL-GATE", ["final", "acceptance-gate", "closure-gate"]),
    ("TPL-INTAKE", ["intake", "inventory", "source"]),
    ("TPL-REQ-MATRIX", ["requirement", "traceability", "normalization"]),
    ("TPL-REF-MAP", ["reference-map", "reference"]),
    ("TPL-SCAFFOLD", ["scaffold", "foundation", "architecture"]),
    ("TPL-REPAIR", ["repair", "fix"]),
]


def is_task_file(path: Path) -> bool:
    low = str(path).replace("/", "\\").lower()
    name = path.name.lower()
    if "docs\\auto-execute" not in low:
        return False
    if any(part in low for part in ["\\latest\\", "\\logs\\", "\\screenshots\\", "\\results\\", "\\evidence\\"]):
        return False
    taskish = (
        re.match(r"^[tu]\d+[-_].*\.md$", name)
        or re.match(r"^task-\d+\.md$", name)
        or re.match(r"^\d+-task-\d+.*\.md$", name)
        or re.match(r"^(xws|v143|t21)[-_].*\.md$", name)
        or "codex-exec-prompts" in low
        or re.search(r"\\[^\\]*tasks\\", low)
    )
    if not taskish:
        return False
    return not (name.endswith("-report.md") and not re.match(r"^task-\d+\.md$", name))


def project_of(path: Path) -> str:
    parts = list(path.parts)
    if "agent-frame" in parts:
        index = parts.index("agent-frame")
        return parts[index + 1] if index + 1 < len(parts) else "?"
    if "SnapRep" in parts:
        return "SnapRep"
    return "?"


def heading_signal(path: Path) -> str:
    try:
        lines = path.read_text(encoding="utf-8", errors="replace").splitlines()
    except OSError:
        return ""
    keep: list[str] = []
    for line in lines[:80]:
        stripped = line.strip()
        if (
            stripped.startswith("#")
            or "Task Template ID" in stripped
            or "Implementation scope" in stripped
            or "Goal" in stripped
            or "Acceptance criteria" in stripped
        ):
            keep.append(stripped)
    return " ".join(keep[:20])


def list_markdown(root: Path) -> list[Path]:
    if not root.exists():
        return []
    try:
        completed = subprocess.run(
            ["rg", "--files", "-g", "*.md", str(root)],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            check=False,
        )
        if completed.stdout:
            return [Path(line) for line in completed.stdout.splitlines() if line.strip()]
    except FileNotFoundError:
        pass
    return list(root.rglob("*.md"))


def map_task(path: Path) -> str:
    signal = f"{path.stem} {heading_signal(path)}".lower().replace("_", "-")
    for template_id, keywords in RULES:
        if any(keyword in signal for keyword in keywords):
            return template_id
    return "TPL-DEV-FEATURE"


def template_ids(template_dirs: list[Path]) -> set[str]:
    ids: set[str] = set()
    for directory in template_dirs:
        if directory.exists():
            ids.update(path.stem for path in directory.glob("TPL-*.md"))
    return ids


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", action="append")
    parser.add_argument("--root-if-exists", action="append")
    parser.add_argument("--template-dir", action="append")
    parser.add_argument("--staged-template-dir", action="append")
    parser.add_argument("--json-out")
    args = parser.parse_args()

    root_values = args.root or [r"D:\lyh\agent\agent-frame"]
    optional_root_values = args.root_if_exists or [r"D:\lyh\AI\SnapRep"]
    template_dir_values = args.template_dir or [r"C:\Users\linyanhui\.agents\skills\task-auto-execute\references\templates"]
    staged_template_dir_values = args.staged_template_dir or [r"D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\templates"]

    roots = [Path(item) for item in root_values]
    roots.extend(Path(item) for item in optional_root_values if Path(item).exists())
    current_templates = template_ids([Path(item) for item in template_dir_values])
    staged_templates = template_ids([Path(item) for item in staged_template_dir_values])
    union_templates = current_templates | staged_templates

    task_files: list[Path] = []
    for root in roots:
        task_files.extend(path for path in list_markdown(root) if is_task_file(path))
    task_files = sorted(set(task_files), key=lambda item: str(item).lower())

    rows = []
    for path in task_files:
        primary = map_task(path)
        rows.append(
            {
                "project": project_of(path),
                "path": str(path),
                "name": path.name,
                "primary": primary,
                "current_template_exists": primary in current_templates,
                "staged_or_current_template_exists": primary in union_templates,
            }
        )

    summary = {
        "task_files": len(rows),
        "projects": dict(Counter(row["project"] for row in rows).most_common()),
        "primary_counts": dict(Counter(row["primary"] for row in rows).most_common()),
        "missing_with_current_templates": dict(Counter(row["primary"] for row in rows if not row["current_template_exists"]).most_common()),
        "missing_with_staged_templates": dict(Counter(row["primary"] for row in rows if not row["staged_or_current_template_exists"]).most_common()),
        "current_template_count": len(current_templates),
        "staged_template_count": len(staged_templates),
        "union_template_count": len(union_templates),
    }
    result = {"summary": summary, "rows": rows}

    if args.json_out:
        out = Path(args.json_out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if not summary["missing_with_staged_templates"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
