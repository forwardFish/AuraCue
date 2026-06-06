param(
  [string]$PatchRoot = "D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute-template-audit",
  [string]$Python = "python"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$syncScript = Join-Path $PatchRoot "scripts\sync-global-task-auto-execute-templates.py"
$coverageScript = Join-Path $PatchRoot "scripts\validate-history-template-coverage.py"
$packageScript = Join-Path $PatchRoot "scripts\build-patched-skill-package.py"
$manifestVerifyScript = Join-Path $PatchRoot "scripts\verify-task-auto-execute-skill.py"
$manifestPath = Join-Path $PatchRoot "patched-skill-manifest.json"
$targets = @(
  "C:\Users\linyanhui\.agents\skills\task-auto-execute",
  "C:\Users\linyanhui\.codex\skills\task-auto-execute"
)

function Invoke-Step {
  param(
    [string]$Name,
    [scriptblock]$Body
  )
  Write-Host ""
  Write-Host "== $Name =="
  & $Body
}

Invoke-Step "Apply global sync" {
  & $Python $syncScript --apply
}

Invoke-Step "Verify sync is idempotent" {
  & $Python $syncScript
}

Invoke-Step "Build patched skill manifest" {
  & $Python $packageScript
}

foreach ($target in $targets) {
  Invoke-Step "Validate $target" {
    $templateDir = Join-Path $target "references\templates"
    $auditTaskPack = Join-Path $target "scripts\audit-task-pack.py"
    $contentAudit = Join-Path $target "scripts\audit-template-content-quality.py"

    & $Python -c "from pathlib import Path; [compile(Path(p).read_text(encoding='utf-8'), p, 'exec') for p in [r'$auditTaskPack', r'$contentAudit']]; print('SYNTAX_OK')"
    & $Python $contentAudit --template-dir $templateDir
    & $Python $coverageScript --template-dir $templateDir --staged-template-dir (Join-Path $PatchRoot "templates")
    & $Python -c @"
from pathlib import Path
import ast
root = Path(r'$target')
templates = {p.stem for p in (root / 'references' / 'templates').glob('TPL-*.md')}
mod = ast.parse((root / 'scripts' / 'audit-task-pack.py').read_text(encoding='utf-8'))
ids = set()
for node in mod.body:
    if isinstance(node, ast.Assign):
        for item in node.targets:
            if isinstance(item, ast.Name) and item.id == 'VALID_TEMPLATE_IDS':
                ids = {elt.value for elt in node.value.elts}
missing = sorted(templates - ids)
extra = sorted(ids - templates)
print({'template_count': len(templates), 'audit_id_count': len(ids), 'missing_in_audit': missing, 'extra_in_audit': extra})
raise SystemExit(0 if len(templates) == 58 and len(ids) == 58 and not missing and not extra else 1)
"@
  }
}

Invoke-Step "Verify targets match patched manifest" {
  & $Python $manifestVerifyScript --manifest $manifestPath --target-root $targets[0] --target-root $targets[1]
}

Write-Host ""
Write-Host "GLOBAL_TASK_AUTO_EXECUTE_SYNC_OK"
