# AuraCue Web/H5 auto-execute Codex Exec 执行提示词

> 生成日期：2026-06-03
> 项目根目录：`D:\lyh\agent\agent-frame\AuraCue`
> 项目 slug：`auracue-web`
> 需求文档：`docs\AuraCue_Web_First_Full_Development_Spec_v1.0.md`, `docs\AuraCue_Final_PRD_Codex_Development_Spec_v1.0.md`
> UI 来源：`docs\AuraCue_首页视觉设计与前端开发标准_v1.0.md`, `docs\UI\小程序\P0-*.png`, `docs\UI\小程序\stitch_codex_ui_code_generator\**\code.html`

本文件是交给后续 `auto-execute` / `codex exec` 的执行包入口，不是完成报告。生成本文件时没有运行代码、没有启服务、没有截图、没有 API transcript、没有 DB readback、没有 result JSON、没有 HANDOFF，不允许写 `PASS`。

## 总原则

- Web/H5 是当前主线；小程序只作为参考。
- 默认使用 `same-session-serial`：同一 Codex 会话一次只执行一个 task boundary，写完 result JSON、HANDOFF、日志和证据后自动进入下一个 task，不要为普通继续动作停下来问用户。
- 只有在运行环境能无例行审批启动 worker 时，才允许切换为 `fresh-worker`，让一个 task 交给一个 fresh `codex exec` worker。
- 每个 task boundary 必须先读 `AGENTS.md` 和自己的 task 文件。
- 每个 task boundary 必须执行、测试、修复、写 result JSON、写 HANDOFF，然后结束该 task boundary。
- 每个 task boundary 必须把命令日志、API transcript、DB readback、截图/trace 写到 task 指定路径。
- T00 必须串行执行队列，检查前一个 task boundary 已有 durable evidence 后再启动下一个。

## 执行入口

从 T00 开始：

```text
使用 auto-execute 执行 AuraCue Web/H5 任务包。

项目根目录：D:\lyh\agent\agent-frame\AuraCue

请先读取：
D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-web-codex-exec-prompts.md

然后从：
D:\lyh\agent\agent-frame\AuraCue\docs\auto-execute\auracue-web-tasks\T00-omx-auto-execute-orchestrator.md
开始，以 same-session-serial 模式严格串行执行 T01 到 T16。

强制要求：
1. 不要只读 master plan，必须按每个 task 文件执行。
2. 不要为每个 task 启动 fresh codex exec；当前 Codex App / Windows 审批表面必须使用同一会话串行执行，避免 Action Required 导致停止。只有运行环境确认能无例行审批启动 worker 时，才允许切换 fresh-worker。
3. 每个 task 必须作为独立 task boundary 执行；上一个 task 必须写入 result JSON、HANDOFF、日志和证据后，才能执行下一个 task。
4. 不能停止：失败必须定位、修复并重跑；不允许只报告失败、不允许问“是否继续”、不允许等待普通确认、不允许把可修复失败交给用户。
5. 只有真实不可替代的硬阻塞才允许写 blocker，例如缺失源文件、缺失凭据且无 local mock/sandbox 替代、环境完全无法启动且无等价验证路径。写 blocker 后仍必须继续处理不依赖该 blocker 的后续可执行任务。
6. 最终必须完成 H5/Web app：能启动 apps/web，能打开页面，页面能调用 /api/v1/* 后端接口，能完成 Mood -> Context -> Upload/Skip -> Draw -> Generate -> Result -> Activate -> Hold Seal -> Activated -> Save/Share/Copy/Download 全流程。
7. T13 必须真实启动整个 app、打开页面、调用后端接口、保存 API transcript、DB readback、截图和 trace。T13 失败必须修复并重跑，不能用 local smoke 或计划文档替代。
8. T16 必须执行 final gate，只有所有 P0 功能、API、DB、E2E、视觉和报告证据齐全，才允许写 PASS。
9. 禁止把聊天文字、计划文档、local smoke 当作最终完成证据。
10. 执行结束后给出最终 verdict、已完成任务、失败重跑记录、app 启动命令和证据路径。
```

如需手动逐个执行，使用 `auracue-web-codex-exec-prompts-split.md`；但在 Codex App / Windows 审批表面不要使用逐条 `codex exec` 命令，以免每个 task 弹出 Action Required。

## 队列

任务队列见 `auracue-web-auto-execute-master-plan.md`。最终 gate 见 `auracue-web-final-acceptance-gate.md`。
