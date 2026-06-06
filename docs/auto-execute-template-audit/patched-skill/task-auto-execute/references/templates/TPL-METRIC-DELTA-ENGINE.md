# TPL-METRIC-DELTA-ENGINE - 指标快照与差值计算任务模板

## 适用场景

用于实现 metric snapshot、previous/current delta、trend、failure-as-null、idempotency、field mapping、readback。典型历史任务包括 ShopOps `metric-snapshot-delta-engine`。

## 不适用场景

- 不用于普通业务规则引擎。
- 不用于单纯图表展示。
- 不用于没有历史窗口或差值语义的统计接口。
- 不用于外部表写入完整验证，外部写入使用 `TPL-EXTERNAL-DATA`。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-METRIC-DELTA-ENGINE` |
| Task 类型 | metric delta engine |
| 主验收面 | snapshot window, previous/current comparison, readback |
| 为什么选这个模板 | 说明本任务要计算快照差值，而不是泛化业务规则 |
| 覆盖对象 | Metric IDs、Snapshot IDs、External Field IDs、DB IDs、Report IDs |
| 辅助模板 | `TPL-BUSINESS-ENGINE`、`TPL-EXTERNAL-DATA`、`TPL-ALERT-REPORTING` |

## 必须读取输入

- metric definitions and formulas。
- snapshot window rules。
- previous/current source data。
- failure/null semantics。
- external field mapping if present。
- storage/upsert/readback rules。
- downstream alerts/reports that consume deltas。

## 允许改动范围

- metric calculation service。
- snapshot/delta model and repository。
- fixtures/tests。
- local storage/readback evidence。
- downstream adapter mapping only if scoped。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止把 collector failure 写成 `0`。
- 禁止没有 previous snapshot 时伪造 delta。
- 禁止重复运行产生重复快照，除非 PRD 要求 append-only。
- 禁止跳过 timezone/window boundary。
- 禁止只测 happy path。

## 执行步骤模板

1. 定义 metric IDs、公式、单位、精度、null/failure 语义。
2. 定义 snapshot window：start/end、timezone、dedupe/upsert key。
3. 实现 current snapshot normalization。
4. 实现 previous snapshot lookup 和 delta calculation。
5. 处理 missing previous、missing current、collector failure、partial data。
6. 写 storage/upsert/readback，证明 idempotency。
7. 写 tests：increase、decrease、no change、null-not-zero、missing previous、duplicate run、window boundary。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 时间窗口 | window、timezone、unique key 必须明确 |
| null 语义 | 失败或缺失必须是 null/failure status，不能写 0 |
| delta 公式 | previous/current/delta/trend 公式必须逐项写 |
| 幂等性 | 同一窗口重复运行是 update 还是 append 必须证明 |
| readback | snapshot 和 delta 必须可独立回读 |

## 最低验证命令

```powershell
<metric engine unit test command>
<snapshot idempotency/readback command>
<null-not-zero failure fixture command>
```

## 验收证据

- metric fixture outputs。
- snapshot before/current/after JSON。
- delta readback JSON。
- idempotency test log。
- null-not-zero failure proof。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `metricIds`
- `windowRules`
- `deltaCases`
- `nullFailureBehavior`
- `idempotencyEvidence`
- `readbackEvidence`
- `limitations`

## 失败路由

- null written as zero：`HARD_FAIL`。
- delta/readback missing：`REPAIR_REQUIRED`。
- metric formula missing：`BLOCKED_BY_MISSING_SOURCE`。
- local storage unavailable：`BLOCKED_BY_ENVIRONMENT`。
