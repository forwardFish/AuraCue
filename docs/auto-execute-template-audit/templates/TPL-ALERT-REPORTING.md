# TPL-ALERT-REPORTING - 告警、任务日志与日报任务模板

## 适用场景

用于实现 alert threshold、task_run_log、alert_log、daily_report、operator-facing summary、redaction proof。典型历史任务包括 ShopOps `alerts-task-log-daily-report` 和运营报告类任务。

## 不适用场景

- 不用于通用日志埋点，通用可观测性使用 `TPL-OBSERVABILITY`。
- 不用于最终验收报告，最终门禁使用 `TPL-FINAL-GATE`。
- 不用于没有阈值、收件人或日报聚合规则的普通文档。
- 不用于真实短信、邮件、飞书推送，除非用户明确授权且有 sandbox/local guard。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-ALERT-REPORTING` |
| Task 类型 | alert/reporting |
| 主验收面 | alert threshold, task logs, daily report aggregation |
| 为什么选这个模板 | 说明本任务要产生运营告警或日报，而不是只记录日志 |
| 覆盖对象 | Alert IDs、Metric IDs、TaskLog IDs、Report IDs、Recipient IDs |
| 辅助模板 | `TPL-OBSERVABILITY`、`TPL-METRIC-DELTA-ENGINE`、`TPL-LOCAL-ONLY-GUARD` |

## 必须读取输入

- alert threshold rules。
- metric/delta sources。
- task_run_log schema。
- alert_log schema。
- daily_report schema and operator copy。
- delivery/local-only policy。
- redaction/secret guard rules。

## 允许改动范围

- alert/reporting service。
- task log and alert log models。
- daily report generator。
- local delivery fake/sandbox adapter。
- tests/fixtures/readback evidence。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止真实生产推送。
- 禁止把日志存在当作告警规则通过。
- 禁止未脱敏输出 secret、token、手机号等敏感信息。
- 禁止缺指标时写正常日报。
- 禁止用英文占位替代用户要求的中文运营文案。

## 执行步骤模板

1. 定义 alert IDs、触发阈值、严重级别、去重/冷却时间、恢复规则。
2. 定义 task_run_log：任务名、窗口、状态、错误、耗时、source。
3. 定义 alert_log：alert key、trigger metric、threshold、recipient、delivery status。
4. 定义 daily_report：日期、摘要、异常、待处理、成功/失败来源、局限。
5. 实现 local delivery fake/sandbox，真实推送必须默认关闭。
6. 写 tests：threshold hit、below threshold、dedupe/cooldown、missing metric、failure redaction、daily aggregation。
7. 写 readback evidence，证明日志和日报可查。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 阈值 | 每条告警的 metric、比较符、阈值、窗口必须明确 |
| 去重 | 重复告警、冷却、恢复行为必须测试 |
| 日报聚合 | daily_report 必须能追溯到 task_run_log/alert_log |
| 文案 | 中文项目必须输出中文运营文案，不能乱码或英文占位 |
| 脱敏 | secret/PII redaction 必须有测试或样例 |

## 最低验证命令

```powershell
<alert threshold test command>
<daily report aggregation test command>
<redaction/local-delivery guard command>
```

## 验收证据

- alert threshold test log。
- task_run_log readback JSON。
- alert_log readback JSON。
- daily_report artifact/readback。
- redaction/local-delivery proof。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `alertRules`
- `taskLogEvidence`
- `alertLogEvidence`
- `dailyReportEvidence`
- `deliveryMode`
- `redactionResult`
- `limitations`

## 失败路由

- real production delivery detected：`HARD_FAIL`。
- threshold/readback missing：`REPAIR_REQUIRED`。
- report cannot trace source logs：`REPAIR_REQUIRED`。
- metric/source missing：`BLOCKED_BY_MISSING_SOURCE`。
- local runtime unavailable：`BLOCKED_BY_ENVIRONMENT`。
