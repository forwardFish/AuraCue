# Global Sync Checklist For Task Auto Execute Templates

Current environment evidence: writing to `D:\lyh\agent\agent-frame\AuraCue\.codex\skills\task-auto-execute` was denied, and global `C:\Users\linyanhui\.agents/.codex` is outside the writable roots. Therefore this audit package is staged under the writable project docs directory and must be synced when global skill write access is available.

## Source Patch Bundle

```text
D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\
  history-template-coverage.md
  template-content-audit.md
  template-registry-additions.md
  templates\TPL-*.md
  patched-skill\task-auto-execute\
  patched-skill-manifest.json
  task-auto-execute-patched-skill.zip
```

## Target Global Skill Paths

```text
C:\Users\linyanhui\.agents\skills\task-auto-execute\
C:\Users\linyanhui\.codex\skills\task-auto-execute\
```

## Files To Add

Copy all staged templates into both global template directories:

```text
references\templates\TPL-HARNESS-EVIDENCE-GATE.md
references\templates\TPL-SCREENSHOT-PIXEL-HARNESS.md
references\templates\TPL-DESIGN-TOKEN-ASSET-INVENTORY.md
references\templates\TPL-MINIAPP-SHELL.md
references\templates\TPL-MINIAPP-PAGE.md
references\templates\TPL-ASYNC-JOB-WORKFLOW.md
references\templates\TPL-REPORT-CARD-RENDERER.md
references\templates\TPL-QUOTA-RATE-LIMIT.md
references\templates\TPL-METRIC-DELTA-ENGINE.md
references\templates\TPL-ALERT-REPORTING.md
references\templates\TPL-LOCALE-ENCODING-GUARD.md
```

## Registry Updates Required

Update these files in both global skill copies:

- `SKILL.md`
- `scripts\audit-task-pack.py`
- `references\task-archetype-templates.md`
- `references\software-dev-task-templates.md`
- existing `references\templates\TPL-*.md` files that receive the `TEMPLATE-CONTENT-QUALITY` appendix

Use `template-registry-additions.md` as the exact ID list and index row source.

## Verification After Sync

```powershell
python -m py_compile 'C:\Users\linyanhui\.agents\skills\task-auto-execute\scripts\audit-task-pack.py'
python -m py_compile 'C:\Users\linyanhui\.codex\skills\task-auto-execute\scripts\audit-task-pack.py'

$agents='C:\Users\linyanhui\.agents\skills\task-auto-execute\references\templates'
$codex='C:\Users\linyanhui\.codex\skills\task-auto-execute\references\templates'
(Get-ChildItem -LiteralPath $agents -Filter 'TPL-*.md' | Measure-Object).Count
(Get-ChildItem -LiteralPath $codex -Filter 'TPL-*.md' | Measure-Object).Count
```

Expected after sync: current 47 templates plus 11 additions = 58 independent `TPL-*.md` files in both global copies, plus 0 failures from `audit-template-content-quality.py`.

## Scripts Added In This Patch Bundle

```text
scripts\validate-history-template-coverage.py
scripts\sync-global-task-auto-execute-templates.py
scripts\audit-template-content-quality.py
scripts\apply-global-task-auto-execute-sync.ps1
scripts\build-patched-skill-package.py
scripts\verify-task-auto-execute-skill.py
```

Use dry-run first:

```powershell
python D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\scripts\sync-global-task-auto-execute-templates.py
```

Apply when global skill paths are writable:

```powershell
python D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\scripts\sync-global-task-auto-execute-templates.py --apply
```

Or run the all-in-one PowerShell sync and validation script from a normal shell with write access to `C:\Users\linyanhui\.agents` and `C:\Users\linyanhui\.codex`:

```powershell
powershell -ExecutionPolicy Bypass -File D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\scripts\apply-global-task-auto-execute-sync.ps1
```

This script applies the sync, verifies the sync is idempotent, rebuilds the patched skill manifest, runs content audit, runs historical coverage validation, checks Python syntax, verifies template files match `VALID_TEMPLATE_IDS`, and verifies both global skill roots match the manifest.

Run historical coverage validation:

```powershell
python D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\scripts\validate-history-template-coverage.py --json-out D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\history-task-template-map.json
```

Run template content validation after sync:

```powershell
python C:\Users\linyanhui\.agents\skills\task-auto-execute\scripts\audit-template-content-quality.py --template-dir C:\Users\linyanhui\.agents\skills\task-auto-execute\references\templates
python C:\Users\linyanhui\.codex\skills\task-auto-execute\scripts\audit-template-content-quality.py --template-dir C:\Users\linyanhui\.codex\skills\task-auto-execute\references\templates
```

Verify exact patched content after sync:

```powershell
python D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\scripts\verify-task-auto-execute-skill.py `
  --manifest D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill-manifest.json `
  --target-root C:\Users\linyanhui\.agents\skills\task-auto-execute `
  --target-root C:\Users\linyanhui\.codex\skills\task-auto-execute
```

Verified patched snapshot:

```text
D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\patched-skill\task-auto-execute
```

Verified package:

```text
D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit\task-auto-execute-patched-skill.zip
SHA256: 090cb95fca23c0dc3813b083b50f04e97c6f6923b523ca71a7772e9cf1da6d74
```

## Current Blocker Evidence

In the current Codex sandbox, direct global apply still fails on both global roots:

```text
ERROR APPLY C:\Users\linyanhui\.agents\skills\task-auto-execute
  permission_error=[Errno 13] Permission denied: 'C:\Users\linyanhui\.agents\skills\task-auto-execute\references\templates\TPL-HARNESS-EVIDENCE-GATE.md'
ERROR APPLY C:\Users\linyanhui\.codex\skills\task-auto-execute
  permission_error=[Errno 13] Permission denied: 'C:\Users\linyanhui\.codex\skills\task-auto-execute\references\templates\TPL-HARNESS-EVIDENCE-GATE.md'
```
