# TPL-QUOTA-RATE-LIMIT - 配额、限流与用量计数任务模板

## 适用场景

用于实现或验证 quota、rate limit、usage counter、failed-call accounting、owner/question/user limit、history readback。典型历史任务包括 `ai-tutor-api-quota-auth`、`my-reports-quota-history`。

## 不适用场景

- 不用于简单登录鉴权，鉴权使用 `TPL-AUTH-IDENTITY`。
- 不用于支付权益全链路，权益使用 `TPL-PAYMENT-ENTITLEMENT`。
- 不用于只有前端展示的统计卡片。
- 不用于真实生产限流服务调用。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-QUOTA-RATE-LIMIT` |
| Task 类型 | quota/rate limit |
| 主验收面 | quota decision, counter mutation, readback, negative cases |
| 为什么选这个模板 | 说明本任务要约束调用次数/额度/频率 |
| 覆盖对象 | API IDs、Quota IDs、User/Owner IDs、DB IDs、Entitlement IDs |
| 辅助模板 | `TPL-AUTH-IDENTITY`、`TPL-PAYMENT-ENTITLEMENT`、`TPL-API-DB-E2E` |

## 必须读取输入

- quota rule from PRD or contract。
- subject identity：user、owner、tenant、question、report。
- entitlement/subscription rules if relevant。
- storage/counter model。
- APIs that consume quota。
- expected UI/history readback。

## 允许改动范围

- quota/rate limit service。
- API middleware or domain guard。
- counter storage/model/migration if scoped。
- tests/fixtures。
- history/readback endpoint if required。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止只在前端隐藏按钮，不在 API 层校验。
- 禁止失败调用污染成功计数，除非 PRD 明确要求。
- 禁止跳过 reset window、owner isolation、negative cases。
- 禁止真实生产限流或扣费调用。
- 禁止把 mock quota 当真实支付权益证明。

## 执行步骤模板

1. 定义 quota subject、scope、window、limit、reset、entitlement mapping。
2. 实现 decision function：allowed、exhausted、unauthorized、not-entitled、rate-limited。
3. 实现 counter mutation，区分 success、failed-call、validation failure、retry。
4. 实现 API guard，覆盖所有 consuming APIs。
5. 实现 readback/history，证明 quota 变化可查。
6. 写 tests：first call、last allowed call、over limit、failed call、other owner/user isolation、reset window。
7. 写 API transcripts 和 DB/readback evidence。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| 计数对象 | 按 user/owner/question/report/API 哪个维度计数必须明确 |
| 失败调用 | validation/auth/provider failure 是否计数必须明确并测试 |
| readback | counter mutation 必须可独立回读 |
| 隔离 | 不同 owner/user/tenant 不能串 quota |
| 权益关系 | 付费/未付费/订阅/免费次数关系必须写清 |

## 最低验证命令

```powershell
<quota service test command>
<quota API negative test command>
<quota readback command>
```

## 验收证据

- quota decision test log。
- API transcripts for allowed/exhausted/negative cases。
- counter before/after/readback JSON。
- history UI/API evidence if required。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `quotaRules`
- `subjectsCovered`
- `counterEvidence`
- `failedCallBehavior`
- `readbackEvidence`
- `negativeCases`
- `limitations`

## 失败路由

- API guard missing：`REPAIR_REQUIRED`。
- counter readback missing：`REPAIR_REQUIRED`。
- quota rule missing：`BLOCKED_BY_MISSING_SOURCE`。
- local runtime unavailable：`BLOCKED_BY_ENVIRONMENT`。
- real production side effect detected：`HARD_FAIL`。
