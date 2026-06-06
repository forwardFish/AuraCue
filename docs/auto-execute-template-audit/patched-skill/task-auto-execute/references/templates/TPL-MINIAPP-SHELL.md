# TPL-MINIAPP-SHELL - 小程序壳、路由与共享状态任务模板

## 适用场景

用于微信小程序或兼容小程序项目的 app config、page registry、navigation helpers、shared state、typed API client、analytics client、fixture toggles。典型历史任务包括 `mini-program-shell-routes-state-api-client`、`miniapp-shell-navigation-and-contract`、`miniprogram-shell`。

## 不适用场景

- 不用于实现具体页面视觉。
- 不用于 Web-only app shell。
- 不用于后端 API 实现。
- 不用于真实支付、真实 AI 或真实云服务调用。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-MINIAPP-SHELL` |
| Task 类型 | mini-program shell |
| 主验收面 | app/page config, route registry, state/API client, fixture toggles |
| 为什么选这个模板 | 说明本任务要打通小程序壳和共享能力，而不是具体页面 |
| 覆盖对象 | Page IDs、Route IDs、API IDs、State IDs、Fixture IDs |
| 辅助模板 | `TPL-MINIAPP-PAGE`、`TPL-CONTRACT`、`TPL-LOCAL-ONLY-GUARD` |

## 必须读取输入

- scaffold task result。
- design token task result。
- API contract matrix。
- UI reference map。
- mini-program page list。
- fixture/local-only rules。
- WeChat DevTools 或本地 preview/harness 的可用性说明。

## 允许改动范围

- mini-program app root。
- `app.json`、page JSON、route registry。
- shared state store。
- mini-program API client。
- analytics/event client。
- shell tests/evidence。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止实现完整页面视觉，除非是 shell-level placeholder。
- 禁止真实云、支付、AI 调用。
- 禁止未登记的页面路径。
- 禁止 mock runtime 证据冒充真实 WeChat simulator/device 证据。

## 执行步骤模板

1. 读取 page list 和 UI/API/Req 映射，确认所有 P0 page routes。
2. 注册 `app.json`、页面 JSON、tabBar 或 navigation mapping。
3. 建立 shell navigation helpers：navigate/back/redirect/reLaunch、登录跳转、错误回退。
4. 建立 shared state store，覆盖当前 workflow entities、登录态、fixture mode。
5. 建立 typed API client，映射 API IDs、错误 envelope、local-only guard。
6. 建立 fixture toggles，确保后续页面 task 能显示 loaded/empty/error/locked/paid 等状态。
7. 建立 route smoke，导航所有 placeholder/page，记录真实 runtime 或 mock/harness limitation。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| route 完整性 | P0 页面必须全部登记，未登记要写 blocker |
| runtime 真实性 | WeChat simulator、local preview、mock harness 必须分开写 |
| API client | method/path/error/auth/local-only 行为必须与 contract matrix 对齐 |
| fixture toggle | 每个后续页面需要的状态 fixture 必须可选择 |
| shell 不是页面完成 | shell placeholder 不能声明具体页面视觉完成 |

## 最低验证命令

```powershell
<miniapp route smoke command>
<state/API client test command>
<fixture toggle proof command>
```

## 验收证据

- route manifest。
- state/API client test log。
- fixture toggle proof。
- runtime mode note。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `registeredRoutes`
- `apiClientMappings`
- `fixtureModes`
- `runtimeMode`
- `routeSmokeResult`
- `limitations`

## 失败路由

- route/API/state missing：`REPAIR_REQUIRED`。
- mini-program test runtime unavailable：`BLOCKED_BY_ENVIRONMENT`。
- source page list missing：`BLOCKED_BY_MISSING_SOURCE`。
- shell exists but pages not implemented：`PASS_WITH_LIMITATION`。
