# Task T00 - Web/H5 串行编排器

## 0. 任务模板选择

| 字段 | 值 |
| --- | --- |
| Task Template ID | `TPL-ORCH-T00` |
| Task 类型 | orchestration |
| 主验收面 | task queue/result JSON/HANDOFF/log/failure routing |
| 为什么选这个模板 | 本任务是 AuraCue Web/H5 auto-execute 队列唯一串行调度入口 |
| 覆盖对象 | T01-T16、results/latest/logs/blockers/repair queue/final gate |
| 辅助模板 | `TPL-FINAL-GATE` |

## Codex Exec

```text
Use auto-execute. 读取并执行 docs/auto-execute/auracue-web-tasks/T00-omx-auto-execute-orchestrator.md。使用 same-session-serial 模式严格串行执行 T01-T16；不要为每个 task 启动 fresh codex exec，除非当前运行环境能无例行审批启动 worker。不能停止：不要问是否继续，不要只报告失败；失败必须修复并重跑，写 result JSON、HANDOFF、日志和证据后自动进入下一个 task。
```

## 1. Task 目标

串行执行 `auracue-web-auto-execute-master-plan.md` 中的 T01-T16。默认使用 `same-session-serial`：在当前 Codex 会话中一次只执行一个 task boundary，等待其写入 result JSON、HANDOFF、日志、证据后再继续。只有在当前运行环境能无例行审批启动 worker 时，才允许切换为 `fresh-worker`，每次只启动一个 fresh `codex exec` worker。

## 2. 必须读取的输入

`AGENTS.md`、`auracue-web-auto-execute-master-plan.md`、`auracue-web-codex-exec-prompts-split.md`、`auracue-web-final-acceptance-gate.md`、`auracue-web-tasks/*.md`。

## 3. 允许改动范围

`docs/auto-execute/results/web/`、`docs/auto-execute/latest/web/`、`docs/auto-execute/logs/web/`、`docs/auto-execute/blockers.md`、`docs/auto-execute/repair-queue.md`。

## 4. 禁止事项

不并行启动依赖任务；不把聊天回复当完成证据；缺 result/HANDOFF 时不进入下一 task；不因普通测试失败、构建失败、类型错误、页面错误、API 错误或视觉差异停下来问用户。

## 5. 依赖与续跑门槛

先检查每个 task 是否已有合格 `docs/auto-execute/results/web/<TASK-ID>.json` 和 `docs/auto-execute/latest/web/<TASK-ID>-HANDOFF.md`。已有合格证据则按续跑规则跳过；缺证据则执行。

## 6. 执行步骤

1. 标准化 task queue。
2. 检查每个 task 文件有模板选择、result/HANDOFF 路径、最低验证命令。
3. 执行 resume probe。
4. 选择执行模式：当前 Codex App / Windows 审批表面优先使用 `same-session-serial`，不要为普通继续动作停下来问用户；仅在无例行审批时启动 fresh worker。
5. task boundary 结束后读取 result、HANDOFF、log；若使用 fresh worker，则等待 worker 退出后再读取。
6. 根据 verdict 决定继续、repair、block 或 final gate。

## 7. 必须输出

`docs/auto-execute/results/web/T00.json`、`docs/auto-execute/latest/web/T00-HANDOFF.md`、队列状态、repair routing 记录。

## 8. 最低验证命令

```powershell
Test-Path docs/auto-execute/auracue-web-auto-execute-master-plan.md
Test-Path docs/auto-execute/auracue-web-tasks/T16-report-guard-final-gate.md
```

## 9. 细化验收标准

每个完成 task 都必须有 machine-readable result JSON、HANDOFF、日志和对应证据。任何 P0 失败必须路由到最小 repair 或 blocker。

## 10. 防停止规则

不能停止在普通失败上。遇到可修复失败必须先定位、修复并重跑；不允许只报告失败、不允许问“是否继续”、不允许等待普通确认。只有真实不可替代的硬阻塞才允许写 blocker，例如缺失源文件、缺失凭据且无 local mock/sandbox 替代、环境完全无法启动且无等价验证路径；写 blocker 后仍必须继续处理不依赖该 blocker 的后续可执行任务。final gate 完成前不得把聊天状态当作终点。

## 11. 失败修复路由

缺任务文件：`NEEDS_REGENERATION`；缺证据：`REPAIR_REQUIRED` 并回到对应 task 补证；环境不可用：优先寻找 local mock/sandbox/等价验证路径，只有无替代路径才写 `BLOCKED_BY_ENVIRONMENT`。

## Result JSON

必须写入第 7 节列出的 result JSON，包含 verdict、covered IDs、commands、evidence、blockers、next repair、rerun/resume 状态。

## HANDOFF

必须写入第 7 节列出的 HANDOFF，包含当前状态、已完成项、失败/修复记录、后续 task 输入和剩余风险。

## 12. 退出条件

T16 final gate 写出最终 verdict，且 T00 HANDOFF 指明无 pending P0 task。
