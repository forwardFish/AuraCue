param(
  [Parameter(Mandatory = $true)][string]$ProjectRoot,
  [Parameter(Mandatory = $true)][string]$TaskDir,
  [int]$From = 0,
  [int]$To = 999,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "ProjectRoot not found: $ProjectRoot"
}
if (-not (Test-Path -LiteralPath $TaskDir)) {
  throw "TaskDir not found: $TaskDir"
}

Set-Location -LiteralPath $ProjectRoot

$tasks = Get-ChildItem -LiteralPath $TaskDir -File -Filter "*.md" |
  Sort-Object Name |
  Where-Object {
    if ($_.BaseName -match '(\d+)') {
      $n = [int]$Matches[1]
      return $n -ge $From -and $n -le $To
    }
    return $false
  }

if (-not $tasks) {
  throw "No task files found in range $From..$To under $TaskDir"
}

foreach ($taskFile in $tasks) {
  $prompt = "Use the auto-execute skill. Execute only this task document: {0}. Treat this as one fresh task boundary; do not merge adjacent tasks. After this task finishes, exit this codex exec. The next task must start in a new codex exec only after this task has written result JSON, logs, gap updates, and handoff. Follow the project master plan, requirement traceability matrix, UI reference map, API/DB contract matrix, standard test plan, owner scenario matrix, and final gate. Implement the current task, run local-only tests, do not use production data, do not trigger real payment, do not write real cloud data unless explicitly allowed, and write logs, result JSON, gap updates, and handoff. Assert page navigation, all relevant API calls, DB mutation/readback, visible UI state, frontend tests, backend tests, frontend/backend contract tests, simulated-user clicks, all-interface standards, and visual one-to-one evidence whenever the task touches those surfaces. Do not claim pure PASS without evidence." -f $taskFile.FullName

  Write-Output ""
  Write-Output "Set-Location -LiteralPath '$ProjectRoot'"
  Write-Output "codex exec `"$prompt`""
}

Write-Output ""
Write-Output "NOTE: task-auto-execute is documentation-only. This helper printed future commands and did not execute codex exec."
