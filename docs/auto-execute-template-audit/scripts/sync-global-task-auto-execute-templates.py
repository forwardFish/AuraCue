from __future__ import annotations

import argparse
import re
import shutil
from pathlib import Path


NEW_IDS = [
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
]

INDEX_ROWS = [
    ("TPL-HARNESS-EVIDENCE-GATE", "harness/evidence", "evidence gates, proof strength, runtime gate, report integrity setup", "product implementation"),
    ("TPL-SCREENSHOT-PIXEL-HARNESS", "screenshot/pixel harness", "Playwright capture, rpx-to-px, pixelmatch artifacts, anti-fake actual guard", "page style repair"),
    ("TPL-DESIGN-TOKEN-ASSET-INVENTORY", "design token/assets", "token extraction, asset inventory, visual motif map, token build", "single page implementation"),
    ("TPL-MINIAPP-SHELL", "mini-program shell", "app/page config, route registry, state/API client, fixture toggles", "specific page visual implementation"),
    ("TPL-MINIAPP-PAGE", "mini-program page", "WXML/WXSS/page JSON, rpx layout, miniapp navigation/state", "web-only page"),
    ("TPL-ASYNC-JOB-WORKFLOW", "async job", "job create/poll/result/failure/retry/local generator/readback", "simple CRUD API"),
    ("TPL-REPORT-CARD-RENDERER", "renderer", "share card, report card, image/PDF-like renderer, text fit, snapshot proof", "raw file download only"),
    ("TPL-QUOTA-RATE-LIMIT", "quota/rate limit", "quota counters, failed-call accounting, owner limits, readback", "simple auth gate"),
    ("TPL-METRIC-DELTA-ENGINE", "metrics/delta", "snapshot windows, previous/current deltas, null-not-zero failures", "generic business rule"),
    ("TPL-ALERT-REPORTING", "alerts/reporting", "alert thresholds, task logs, daily report aggregation, operator copy", "generic logs only"),
    ("TPL-LOCALE-ENCODING-GUARD", "locale/encoding", "Chinese copy/field preservation, UTF-8 scan, mojibake guard", "translation-only work"),
]

SCRIPT_FILES = [
    "audit-template-content-quality.py",
]

QUALITY_APPENDIX_MARKER = "TEMPLATE-CONTENT-QUALITY"
QUALITY_APPENDIX = """
<!-- TEMPLATE-CONTENT-QUALITY:START -->
## 通用内容准确性补强

本附录用于补齐旧模板的执行字段。生成 task 时，必须优先使用本模板上方的领域规则，再用本附录补全范围、证据、Result JSON 和失败路由。

### 允许改动范围

- 只允许改动 task 明确列出的目标文件、测试、fixture、证据输出和必要的相邻 contract 文件。
- 如果需要跨越本模板的主验收面，必须在 task 中列出辅助模板和范围理由。
- 不得修改 source reference、用户未授权的外部系统、生产数据或无关模块。

### 禁止事项

- 禁止把计划、dry-run、聊天状态、结构化占位或局部 smoke 写成 pure PASS。
- 禁止跳过本模板的领域必填项、负例、readback、截图、日志或报告完整性检查。
- 禁止隐藏 `BLOCKED_BY_MISSING_SOURCE`、`BLOCKED_BY_ENVIRONMENT`、`REPAIR_REQUIRED` 等真实状态。

### 执行步骤补充

1. 先把本模板上方的领域必填项映射到具体 Req/UI/API/DB/Owner/Evidence IDs。
2. 再写 task-local allowed files、forbidden actions、dependency/resume gate。
3. 为每个验收点写清验证命令、durable evidence path、失败状态和 repair routing。
4. 最后写 result JSON 和 HANDOFF，失败也必须落盘。

### 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 模板适配 | 为什么本模板是主模板，哪些辅助模板只做补充 |
| 具体输入 | 每个输入必须是项目文件、source 文档、命令、fixture 或明确 blocker |
| 验收证据 | 每条 P0/P1 验收都要有命令和 durable evidence path |
| 降级状态 | 证据不足时必须写限制状态，不能 pure PASS |
| task 粒度 | 一个 task 只能证明一个主验收面，过大必须拆分 |

### 最低验证命令

```powershell
<template-specific targeted command>
<negative or edge-case command where applicable>
<evidence/readback/report-integrity command>
```

### 验收证据补充

- targeted test/build/smoke/log evidence。
- required screenshots/API transcripts/DB readbacks/external readbacks if applicable。
- updated matrix/report if this template owns a mapping or gate。
- `docs/auto-execute/results/<TASK-ID>.json`。
- `docs/auto-execute/latest/<TASK-ID>-HANDOFF.md`。

### Result JSON 必填补充

- `taskId`
- `templateId`
- `status`
- `coveredIds`
- `commandsRun`
- `evidencePaths`
- `failedChecks`
- `repairRouting`
- `limitations`

### 失败路由补充

- source 缺失：`BLOCKED_BY_MISSING_SOURCE`。
- runtime/tooling 缺失：`BLOCKED_BY_ENVIRONMENT`。
- 领域验收或证据缺口：`REPAIR_REQUIRED`。
- secret、真实生产副作用、伪造证据：`HARD_FAIL`。
<!-- TEMPLATE-CONTENT-QUALITY:END -->
"""


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, text: str, apply: bool) -> None:
    if apply:
        path.write_text(text, encoding="utf-8")


def copy_templates(source_dir: Path, skill_root: Path, apply: bool) -> list[str]:
    target_dir = skill_root / "references" / "templates"
    copied: list[str] = []
    for template_id in NEW_IDS:
        source = source_dir / f"{template_id}.md"
        target = target_dir / source.name
        if not source.exists():
            raise FileNotFoundError(source)
        if not target.exists() or source.read_bytes() != target.read_bytes():
            copied.append(str(target))
            if apply:
                target_dir.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
    return copied


def copy_support_scripts(skill_root: Path, apply: bool) -> list[str]:
    source_dir = Path(__file__).resolve().parent
    target_dir = skill_root / "scripts"
    copied: list[str] = []
    for name in SCRIPT_FILES:
        source = source_dir / name
        target = target_dir / name
        if not source.exists():
            raise FileNotFoundError(source)
        if not target.exists() or source.read_bytes() != target.read_bytes():
            copied.append(str(target))
            if apply:
                target_dir.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
    return copied


def update_audit_script(skill_root: Path, apply: bool) -> list[str]:
    path = skill_root / "scripts" / "audit-task-pack.py"
    text = read_text(path)
    match = re.search(r"(VALID_TEMPLATE_IDS\s*=\s*\{\n)(.*?)(\n\})", text, flags=re.S)
    if not match:
        raise ValueError(f"Cannot locate VALID_TEMPLATE_IDS set in {path}")

    body = match.group(2)
    existing_lines: list[str] = []
    removed_escaped: list[str] = []
    for line in body.splitlines():
        stripped = line.strip()
        escaped_match = re.fullmatch(r'\\"(TPL-[A-Z0-9-]+)\\"\s*,?', stripped)
        if escaped_match:
            removed_escaped.append(escaped_match.group(1))
            continue
        if stripped:
            existing_lines.append(line.rstrip())

    present_ids = set(re.findall(r'"(TPL-[A-Z0-9-]+)"', "\n".join(existing_lines)))
    missing = [template_id for template_id in NEW_IDS if template_id not in present_ids]
    changed = sorted(set(removed_escaped + missing), key=lambda item: NEW_IDS.index(item) if item in NEW_IDS else item)
    if not changed:
        return []

    inserted_lines = [f'    "{template_id}",' for template_id in missing]
    new_body = "\n".join(existing_lines + inserted_lines)
    text = text[: match.start(2)] + new_body + text[match.end(2) :]
    write_text(path, text, apply)
    return changed


def append_marker_section(path: Path, marker: str, body: str, apply: bool) -> bool:
    text = read_text(path)
    start = f"<!-- {marker}:START -->"
    end = f"<!-- {marker}:END -->"
    section = f"\n\n{start}\n{body.rstrip()}\n{end}\n"
    if start in text and end in text:
        new_text = re.sub(re.escape(start) + r".*?" + re.escape(end), section.strip(), text, flags=re.S)
    else:
        new_text = text.rstrip() + section
    if new_text != text:
        write_text(path, new_text, apply)
        return True
    return False


def update_index_files(skill_root: Path, apply: bool) -> list[str]:
    rows = "\n".join(
        f"| `{template_id}` | {kind} | {use} | {not_for} |"
        for template_id, kind, use, not_for in INDEX_ROWS
    )
    archetype_body = (
        "## History Scan Template Additions\n\n"
        "These template IDs were added after scanning historical `docs/auto-execute` task files.\n\n"
        "| Template ID | Type | Applies To | Not For |\n"
        "| --- | --- | --- | --- |\n"
        f"{rows}"
    )
    catalog_body = (
        "## History Scan Template Additions\n\n"
        "When these task shapes appear, read the matching independent file under `references/templates/` before generating the task.\n\n"
        f"{rows}"
    )
    changed: list[str] = []
    if append_marker_section(skill_root / "references" / "task-archetype-templates.md", "HISTORY-TEMPLATE-ADDITIONS", archetype_body, apply):
        changed.append("references/task-archetype-templates.md")
    if append_marker_section(skill_root / "references" / "software-dev-task-templates.md", "HISTORY-TEMPLATE-ADDITIONS", catalog_body, apply):
        changed.append("references/software-dev-task-templates.md")
    return changed


def update_skill_file(skill_root: Path, apply: bool) -> list[str]:
    path = skill_root / "SKILL.md"
    text = read_text(path)
    heading = "### 1.06. Template Content Accuracy Gate"
    if heading in text:
        return []

    anchor = (
        "Do not generate a task from a blank generic structure. First select the template, read "
        "`references/templates/<Task Template ID>.md`, then fill the required fields for that template. "
        "If no existing template fits, create a project-specific template entry in the generated pack and mark "
        "the task-pack quality audit with the reason. If a task is missing template selection, the selected "
        "template file is missing, or the selected template does not match the task content, the audit verdict "
        "must be `NEEDS_REGENERATION`."
    )
    body = """

### 1.06. Template Content Accuracy Gate

Template selection is not enough. Before generating each task, compare the selected independent template against the actual historical/project task shape and decide whether the template content is accurate enough to drive execution.

For every task, verify:

1. The selected template's `适用场景` and `不适用场景` match the task. If the task falls into a forbidden or adjacent category, reselect the template.
2. The task can fill the template's required opening fields: `Task Template ID`, task type, primary acceptance surface, template rationale, covered IDs, and secondary templates.
3. Every required input in the template maps to a concrete project file, source document, command, fixture, or explicit `BLOCKED_BY_MISSING_SOURCE`.
4. Every acceptance criterion maps to a verification command and durable evidence path. A criterion without evidence is not executable enough.
5. Every possible incomplete proof has an honest status rule such as `PASS_WITH_LIMITATION`, `PASS_NEEDS_REFERENCE`, `PASS_NEEDS_MANUAL_UI_REVIEW`, `REPAIR_REQUIRED`, or `BLOCKED_BY_ENVIRONMENT`.
6. Template-specific traps are handled: visual tasks need real reference/actual/diff/metrics rules; mini-program tasks must distinguish real WeChat runtime from local mock preview; API/DB tasks need independent readback; Chinese tasks need UTF-8 and copy preservation checks.

If the independent template is too thin, too generic, missing the task's real proof chain, or cannot produce the result JSON/HANDOFF/evidence required by the task, strengthen or add the template before generating task files. The quality audit must mark the pack `NEEDS_REGENERATION` or `NEEDS_TEMPLATE_REPAIR` until this is fixed.

When available, run:

```powershell
python <skill-root>\\scripts\\audit-template-content-quality.py --template-dir <skill-root>\\references\\templates
```

Treat failures for a selected task template as blockers for task generation, not as optional suggestions.
"""
    if anchor not in text:
        raise ValueError(f"Cannot locate insertion anchor in {path}")
    new_text = text.replace(anchor, anchor + body, 1)
    write_text(path, new_text, apply)
    return ["SKILL.md"]


def update_template_quality_appendix(skill_root: Path, apply: bool) -> list[str]:
    template_dir = skill_root / "references" / "templates"
    required_terms = [
        "允许改动范围",
        "禁止事项",
        "执行步骤",
        "内容准确性门槛",
        "最低验证命令",
        "验收证据",
        "Result JSON",
        "失败路由",
    ]
    changed: list[str] = []
    start = f"<!-- {QUALITY_APPENDIX_MARKER}:START -->"
    end = f"<!-- {QUALITY_APPENDIX_MARKER}:END -->"
    for path in sorted(template_dir.glob("TPL-*.md")):
        text = read_text(path)
        needs_appendix = any(term not in text for term in required_terms) or start in text
        if not needs_appendix:
            continue
        if start in text and end in text:
            new_text = re.sub(re.escape(start) + r".*?" + re.escape(end), QUALITY_APPENDIX.strip(), text, flags=re.S)
        else:
            new_text = text.rstrip() + "\n\n" + QUALITY_APPENDIX.strip() + "\n"
        if new_text != text:
            changed.append(str(path.relative_to(skill_root)))
            write_text(path, new_text, apply)
    return changed


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write changes; without this flag the script is a dry run")
    parser.add_argument("--source-dir", default=str(Path(__file__).resolve().parents[1] / "templates"))
    parser.add_argument("--skill-root", action="append")
    args = parser.parse_args()

    source_dir = Path(args.source_dir)
    skill_roots = args.skill_root or [
        r"C:\Users\linyanhui\.agents\skills\task-auto-execute",
        r"C:\Users\linyanhui\.codex\skills\task-auto-execute",
    ]
    had_error = False
    for root_text in skill_roots:
        skill_root = Path(root_text)
        if not skill_root.exists():
            print(f"MISSING_SKILL_ROOT {skill_root}")
            continue
        mode = "APPLY" if args.apply else "DRY_RUN"
        try:
            copied = copy_templates(source_dir, skill_root, args.apply)
            scripts = copy_support_scripts(skill_root, args.apply)
            audit_ids = update_audit_script(skill_root, args.apply)
            index_files = update_index_files(skill_root, args.apply)
            skill_files = update_skill_file(skill_root, args.apply)
            quality_templates = update_template_quality_appendix(skill_root, args.apply)
            print(f"{mode} {skill_root}")
            print(f"  templates_to_copy={len(copied)}")
            print(f"  scripts_to_copy={scripts}")
            print(f"  audit_ids_to_add={audit_ids}")
            print(f"  index_files_to_update={index_files}")
            print(f"  skill_files_to_update={skill_files}")
            print(f"  quality_appendix_to_update={len(quality_templates)}")
        except PermissionError as exc:
            had_error = True
            print(f"ERROR {mode} {skill_root}")
            print(f"  permission_error={exc}")
        except OSError as exc:
            had_error = True
            print(f"ERROR {mode} {skill_root}")
            print(f"  os_error={exc}")
    return 1 if had_error else 0


if __name__ == "__main__":
    raise SystemExit(main())
