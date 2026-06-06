from __future__ import annotations

import argparse
import json
from pathlib import Path


GENERAL_REQUIREMENTS = {
    "task_template_id": ["Task Template ID"],
    "applicability": ["适用场景", "不适用场景"],
    "task_opening_fields": ["Task 开头必填", "主验收面", "覆盖对象"],
    "inputs_scope_forbidden": ["必须读取输入", "允许改动范围", "禁止事项"],
    "execution": ["执行步骤"],
    "verification": ["最低验证命令", "验收证据"],
    "result_and_failure": ["Result JSON", "失败路由"],
}

GENERAL_ANY_REQUIREMENTS = {
    "accuracy_detail": ["内容准确性门槛", "细化验收", "状态规则", "Result JSON 必填"],
}

SPECIFIC_REQUIREMENTS = {
    "TPL-HARNESS-EVIDENCE-GATE": [
        "proof-strength",
        "report-integrity",
        "durable evidence",
        "secret guard",
        "REPAIR_REQUIRED",
    ],
    "TPL-SCREENSHOT-PIXEL-HARNESS": [
        "pixelmatch",
        "reference.png",
        "actual.png",
        "diff.png",
        "metrics.json",
        "anti-fake",
        "PASS_NEEDS_REFERENCE",
        "PASS_NEEDS_MANUAL_UI_REVIEW",
    ],
    "TPL-DESIGN-TOKEN-ASSET-INVENTORY": [
        "color",
        "typography",
        "spacing",
        "radius",
        "shadow",
        "asset manifest",
        "build",
    ],
    "TPL-MINIAPP-SHELL": [
        "app.json",
        "page JSON",
        "route",
        "API client",
        "fixture",
        "WeChat",
    ],
    "TPL-MINIAPP-PAGE": [
        "WXML",
        "WXSS",
        "page JSON",
        "rpx",
        "loading",
        "empty",
        "error",
        "unauthorized",
        "screenshot",
    ],
    "TPL-ASYNC-JOB-WORKFLOW": [
        "create",
        "poll",
        "pending",
        "success",
        "failure",
        "not-found",
        "deterministic",
        "readback",
    ],
    "TPL-REPORT-CARD-RENDERER": [
        "dimension",
        "text fit",
        "overflow",
        "snapshot",
        "data URL",
        "artifact",
    ],
    "TPL-QUOTA-RATE-LIMIT": [
        "quota",
        "counter",
        "failed-call",
        "owner",
        "readback",
    ],
    "TPL-METRIC-DELTA-ENGINE": [
        "previous",
        "current",
        "delta",
        "null-not-zero",
        "idempotency",
        "readback",
    ],
    "TPL-ALERT-REPORTING": [
        "threshold",
        "task_run_log",
        "alert_log",
        "daily_report",
        "redaction",
    ],
    "TPL-LOCALE-ENCODING-GUARD": [
        "UTF-8",
        "mojibake",
        "Chinese",
        "code point",
        "Windows",
    ],
}


def missing_terms(text: str, terms: list[str]) -> list[str]:
    lowered = text.lower()
    return [term for term in terms if term.lower() not in lowered]


def audit_template(path: Path) -> dict[str, object]:
    text = path.read_text(encoding="utf-8")
    general_missing = {
        name: missing_terms(text, terms)
        for name, terms in GENERAL_REQUIREMENTS.items()
        if missing_terms(text, terms)
    }
    for name, terms in GENERAL_ANY_REQUIREMENTS.items():
        if all(term.lower() not in text.lower() for term in terms):
            general_missing[name] = [f"one of: {', '.join(terms)}"]
    specific_terms = SPECIFIC_REQUIREMENTS.get(path.stem, [])
    specific_missing = missing_terms(text, specific_terms)
    verdict = "PASS" if not general_missing and not specific_missing else "NEEDS_TEMPLATE_REPAIR"
    return {
        "template": path.stem,
        "path": str(path),
        "verdict": verdict,
        "general_missing": general_missing,
        "specific_missing": specific_missing,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--template-dir", required=True)
    parser.add_argument("--json-out")
    args = parser.parse_args()

    template_dir = Path(args.template_dir)
    rows = [audit_template(path) for path in sorted(template_dir.glob("TPL-*.md"))]
    summary = {
        "template_dir": str(template_dir),
        "template_count": len(rows),
        "fail_count": sum(1 for row in rows if row["verdict"] != "PASS"),
        "failed_templates": [row["template"] for row in rows if row["verdict"] != "PASS"],
    }
    result = {"summary": summary, "rows": rows}

    if args.json_out:
        out = Path(args.json_out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if summary["fail_count"] == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
