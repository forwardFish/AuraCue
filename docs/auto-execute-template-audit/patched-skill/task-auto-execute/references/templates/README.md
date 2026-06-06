# Task Template Files

本目录是 `task-auto-execute` 的独立任务模板库。规则很简单：一个 `Task Template ID` 对应一个 Markdown 文件。

生成任何项目的 `docs/auto-execute/<slug>-tasks/*.md` 前，必须按顺序读取：

1. `references/codex-exec-standard-template.md`
2. `references/task-archetype-templates.md`
3. `references/software-dev-task-templates.md`
4. 本目录中与 `Task Template ID` 同名的 `TPL-*.md`

任务生成规则：

- 每个 task 只能选择一个主模板。
- 主模板文件是该 task 的硬约束，不能只看大索引。
- 可以列辅助模板，但辅助模板只能补充验证项，不能改变主验收面。
- 如果没有模板文件，不能生成该 task，质量审计必须是 `NEEDS_REGENERATION`。
- 如果 task 内容和模板不匹配，质量审计必须是 `NEEDS_REGENERATION`。

独立模板文件必须约束：

- 适用场景和不适用场景；
- task 开头的模板选择表；
- 必读输入；
- 允许改动范围；
- 禁止事项；
- 执行步骤；
- 最低验证命令；
- 必须输出的证据；
- result JSON 字段；
- HANDOFF 要点；
- 失败状态和 repair 路由。

生成阶段只生成任务文件和计划文件，不执行产品代码，不创建 `results/*.json`、`latest/*HANDOFF.md`、截图、API transcript、DB readback 或 PASS 证据。
