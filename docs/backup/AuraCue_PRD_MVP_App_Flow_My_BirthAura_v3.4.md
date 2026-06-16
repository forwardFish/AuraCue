# AuraCue PRD v3.4 — MVP App 主页面、生日门槛、My 页面与 P1 登录修正版

> 文档类型：产品需求补充 / MVP App Flow & Page Map  
> 版本：v3.4  
> 生成日期：2026-06-13  
> 产品定位：**年轻人的每日塔罗风格神谕 / Daily Tarot Style Oracle**  
> 核心体验：**牌面 → 心理暗示 → 幸运色 → 守护单品 → 穿搭公式 → 今日动作 → 封印 → 分享**  
> 本次修正重点：补齐完整 App 的主页面、首页、My 页面、首次进入流程、生日必填规则，并将登录 / 密码体系调整到 P1。  
> 适用端：Web / H5 MVP；后续小程序与原生 App 复用同一套状态机与 API。

---

## 0. 本次为什么必须修改 v3.0 PRD

当前 v3.0 已经明确 AuraCue 的核心体验是：

```text
牌面 → 心理暗示 → 幸运色 → 守护单品 → 穿搭公式 → 今日动作 → 封印 → 分享
```

这个方向保持不变。

但从完整 App 的角度看，v3.0 仍然有几个问题需要修正：

1. **缺少真正的 App 首页 Home / Today 页面逻辑。**  
   原文更多描述了仪式链路，但缺少用户第一次打开 App 后看到什么、点击什么、进入哪个流程。

2. **缺少 My 页面。**  
   P0 不需要复杂账号系统，但完整 App 必须有 My 页面来承载 Birth Aura、Journal、设置、Legal、P1 登录入口。

3. **生日规则需要修改。**  
   v3.0 仍然保留了 “Skip for now / 可跳过生日” 的设计。现在产品策略调整为：  
   **用户可以先看到首页，但要开启今日抽牌，生日必须输入。**

4. **登录 / 密码页面不进入 P0。**  
   登录、注册、密码找回、账号同步可以放到 P1。  
   P0 使用 anonymous identity / guest mode 跑通完整仪式。

5. **底部导航需要调整。**  
   MVP 应统一为：

```text
Today / Journal / My
```

而不是：

```text
Today / Journal / Birth Aura
```

Birth Aura 是 My 页面中的核心模块，不应占用底部主 Tab。

---

## 1. MVP 的最新范围结论

### 1.1 P0 目标

P0 只做一件事：

```text
让用户每天打开 AuraCue，
看到今天的 Date Aura，
输入生日生成 Birth Aura，
完成今日塔罗抽卡，
得到今日风格神谕，
长按封印，
保存或分享今日气场卡。
```

### 1.2 P0 不做什么

P0 不做：

- 邮箱登录；
- 密码登录；
- 注册；
- 忘记密码；
- 修改密码；
- 真实订阅支付；
- Pro Paywall；
- Apple / Google 登录；
- 复杂账号同步；
- 上传衣橱；
- 电商导购；
- 复杂星盘；
- 出生时间 / 出生地点；
- 完整 78 张塔罗；
- Clarifier Card；
- Evening Reflection；
- 7-Day Aura Pattern；
- 社区。

### 1.3 P1 再做什么

P1 做：

- Login；
- Sign Up；
- Forgot Password；
- Reset Password；
- Account Settings；
- 跨设备同步；
- Pro / Subscription；
- Evening Reflection；
- 7-Day Aura Pattern；
- Push Notification；
- Clarifier Card；
- 多套分享模板。

---

## 2. 最新底部导航

### 2.1 P0 底部 Tab

```text
Today      Journal      My
```

### 2.2 每个 Tab 的职责

| Tab | Route | 职责 |
|---|---|---|
| Today | `/today` | 每日入口、Date Aura、今日抽牌 CTA、查看今日已封印卡 |
| Journal | `/journal` | 历史气场卡、已保存卡、已封印记录 |
| My | `/my` | Guest 状态、本命气场、设置、Legal、P1 登录入口 |

### 2.3 为什么不把 Birth Aura 放在底部 Tab

Birth Aura 是用户的个人资料，不是每天最高频入口。

它应该放在：

```text
My → Birth Aura Profile
```

这样未来登录、订阅、账号、隐私、设置都可以放在 My 中。

---

## 3. P0 页面地图

### 3.1 P0 必须页面

| 编号 | 页面 | Route | P0 是否必须 | 作用 |
|---|---|---|---|---|
| P0-00 | App Bootstrap / Loading | `/` | 是 | 检查 anonymousId、本地日期、生日、今日状态 |
| P0-01 | Today Home | `/today` | 是 | App 主入口 |
| P0-02 | Create Birth Aura | `/onboarding/birth-aura` | 是 | 生日必填，生成本命气场 |
| P0-03 | Birth Aura Reveal | `/onboarding/birth-aura/reveal` | 是 | 揭示本命气场 |
| P0-04 | Mood & Scene Check-in | `/today/check-in` | 是 | 今日状态和场景选择 |
| P0-05 | Tarot Pull | `/today/draw` | 是 | 三张牌抽一张 |
| P0-06 | Reading | `/today/reading` | 是 | 合成 Birth Aura / Date Aura / Mood / Scene / Card |
| P0-07 | Today’s Style Oracle Result | `/result/[id]` | 是 | 今日风格神谕 |
| P0-08 | Activate / Hold to Seal | `/activate/[id]` | 是 | 确认守护单品，长按封印 |
| P0-09 | Aura Activated | `/activated/[id]` | 是 | 封印完成 |
| P0-10 | Share Aura Card | `/share/[id]` | 是 | 9:16 分享卡 |
| P0-11 | Saved | `/saved/[id]` | 是 | 保存成功 |
| P0-12 | Journal Lite | `/journal` | 是 | 历史归档 |
| P0-13 | My | `/my` | 是 | 个人主页 |
| P0-14 | Birth Aura Profile | `/my/birth-aura` | 是 | 查看 / 修改生日与本命气场 |
| P0-15 | Privacy Policy | `/legal/privacy` | 是 | 隐私政策 |
| P0-16 | Terms of Use | `/legal/terms` | 是 | 服务条款 |
| P0-17 | Error / Not Found | `/404` / Error Boundary | 是 | 错误兜底 |

### 3.2 P1 页面

| 页面 | Route | P1 说明 |
|---|---|---|
| Login | `/auth/login` | 邮箱密码登录 |
| Sign Up | `/auth/signup` | 邮箱注册 |
| Forgot Password | `/auth/forgot-password` | 找回密码 |
| Reset Password | `/auth/reset-password` | 重置密码 |
| Account Settings | `/my/account` | 邮箱、密码、同步、退出登录 |
| Subscription | `/subscription` | Pro / 年费 |
| Evening Reflection | `/evening/[date]` | 晚间反馈 |
| 7-Day Aura Pattern | `/journal/week` | 7 日轨迹 |
| Clarifier Card | `/clarifier/[id]` | 补充牌 |
| Share Templates | `/share/templates` | 多模板分享卡 |

---

## 4. P0 用户身份策略

### 4.1 P0 使用 Guest / Anonymous Identity

P0 不强制登录。

用户第一次打开 App，系统创建：

```text
anonymousId
```

并保存在：

```text
localStorage / cookie
```

后端使用 anonymousId 创建或读取用户记录。

### 4.2 P0 用户能做什么

Guest 用户可以完成完整主流程：

```text
打开首页
→ 输入生日
→ 生成 Birth Aura
→ 今日状态选择
→ 抽塔罗
→ 生成结果
→ 封印
→ 保存
→ 分享
→ 查看 Journal
→ 查看 My
```

### 4.3 P0 用户不能做什么

Guest 用户暂时不能：

- 跨设备同步；
- 邮箱登录；
- 修改密码；
- 订阅 Pro；
- 云端恢复历史；
- 多设备 Journal。

### 4.4 My 页面中的 P1 登录入口

P0 My 页面可以显示 P1 占位入口：

```text
Sign in to sync your aura across devices
Coming in the next version
```

中文：

```text
登录后可跨设备同步你的气场记录
下一版本开放
```

按钮可以存在，但 P0 点击后显示：

```text
Account sync is coming soon.
```

或者直接隐藏，待 P1 再开放。

---

## 5. 生日必填规则

### 5.1 新规则

用户可以先进入 Today Home，但要开始今日抽牌，必须先完成 Birth Aura。

```text
Today Home 可访问
Journal 可访问
My 可访问
Legal 可访问

但以下页面需要 Birth Aura：
/today/check-in
/today/draw
/today/reading
/result/[id]
/activate/[id]
/activated/[id]
/share/[id]
```

### 5.2 旧规则需要删除

v3.0 中的以下规则需要删除或改写：

```text
生日可跳过
Skip for now
跳过时生成 Unknown Birth Aura
跳过用户也可以进入结果页
```

### 5.3 新页面按钮

生日输入页不再显示：

```text
Skip for now
```

可以保留较弱的返回按钮：

```text
Maybe later
```

但它只能返回首页，不能继续抽牌。

### 5.4 页面文案

```text
Create Your Birth Aura

Your birthday becomes the key to how each card speaks to you.

Month      Day
[ 08 ]     [ 21 ]

[ Reveal My Birth Aura ]

Maybe later
```

中文：

```text
创建你的本命气场

你的生日会成为每张牌与你对话的方式。

月      日
[ 08 ]  [ 21 ]

[ 揭示我的本命气场 ]

稍后再说
```

### 5.5 点击 Maybe Later 后

点击 `Maybe later`：

```text
返回 /today
显示状态：Birth Aura required
主按钮：Create Your Birth Aura
```

不能进入 `/today/check-in`。

---

## 6. App 首次进入流程

### 6.1 首次用户完整流程

```text
打开 App
→ App Bootstrap 检查 anonymousId
→ 如果没有 anonymousId，创建 anonymousId
→ 进入 /today
→ 显示 Today Home
→ 用户点击 Activate Today’s Aura
→ 系统检查 hasBirthAura = false
→ 跳转 /onboarding/birth-aura
→ 用户输入 Month / Day
→ 生成 Birth Aura
→ 跳转 /onboarding/birth-aura/reveal
→ 用户点击 Begin Today’s Ritual
→ 进入 /today/check-in
→ 选择 Mood / Scene
→ 进入 /today/draw
→ 抽牌
→ Reading
→ Result
→ Activate
→ Hold to Seal
→ Activated
→ Share / Save / Journal
```

### 6.2 Mermaid 流程图

```mermaid
flowchart TD
  A[Open App] --> B[Bootstrap]
  B --> C{anonymousId exists?}
  C -- No --> D[Create anonymousId]
  C -- Yes --> E[Load user state]
  D --> E
  E --> F[/today Home]
  F --> G[Tap Activate Today's Aura]
  G --> H{Has Birth Aura?}
  H -- No --> I[/onboarding/birth-aura]
  I --> J[Input Month / Day]
  J --> K[Birth Aura Reveal]
  K --> L[/today/check-in]
  H -- Yes --> L
  L --> M[Choose Mood + Scene]
  M --> N[/today/draw]
  N --> O[Select Tarot Card]
  O --> P[/today/reading]
  P --> Q[/result/id]
  Q --> R[/activate/id]
  R --> S[Hold to Seal]
  S --> T[/activated/id]
  T --> U[Share / Save / Journal]
```

---

## 7. 回访用户流程

### 7.1 有生日、今日未开始

```text
打开 App
→ /today
→ 显示 Date Aura + Birth Aura chip
→ CTA: Activate Today’s Aura
→ 点击后直接进入 /today/check-in
```

### 7.2 有生日、今日流程进行中

```text
打开 App
→ /today
→ CTA: Continue Today’s Ritual
→ 根据状态回到对应页面
```

状态映射：

| todayStatus | CTA | Route |
|---|---|---|
| checked_in | Continue Today’s Ritual | `/today/draw` |
| draw_started | Continue Today’s Ritual | `/today/draw` |
| card_selected | Continue Reading | `/today/reading` |
| generating | Continue Reading | `/today/reading` |
| generated | View Today’s Oracle | `/result/[id]` |
| activation_started | Hold to Seal | `/activate/[id]` |
| sealed | View Today’s Sealed Aura | `/activated/[id]` |

### 7.3 有生日、今日已封印

首页展示：

```text
Today’s Aura Sealed

Soft Boundary is active for today.

[ View Today’s Card ]
[ Share Story ]
```

### 7.4 无生日用户回访

首页展示：

```text
Birth Aura required

Create your Birth Aura before starting today’s oracle.

[ Create Your Birth Aura ]
```

---

## 8. Today Home 首页详细需求

### 8.1 页面目的

首页是 AuraCue 的主页面，承担 4 个任务：

1. 告诉用户今天是什么 Date Aura；
2. 告诉用户今日神谕是否已开启；
3. 如果没有 Birth Aura，引导输入生日；
4. 如果已有 Birth Aura，引导开启今日抽牌。

### 8.2 页面布局

```text
[Top Header]
Avatar / AURACUE / Gift or Streak

[Date Badge]
Jun 13 · Saturday

[Hero Card]
Today’s Date Aura
Clear Structure

A new aura has opened for today.

[Today Oracle Preview]
未开始：显示未翻开的今日卡背
已封印：显示今日气场卡缩略图

[Birth Aura Status]
Birth Aura: Venus Air
或
Birth Aura Required

[Primary CTA]
Create Your Birth Aura / Activate Today’s Aura / Continue / View

[Bottom Tab]
Today / Journal / My
```

### 8.3 首页状态

| 状态 | 条件 | 展示 | CTA |
|---|---|---|---|
| Loading | bootstrap 未完成 | skeleton | 无 |
| No Birth Aura | `hasBirthAura = false` | Birth Aura Required | Create Your Birth Aura |
| Not Started | 有 Birth Aura，今日未开始 | Date Aura + 未翻牌 | Activate Today’s Aura |
| In Progress | 今日流程未完成 | Continue card | Continue Today’s Ritual |
| Generated | 结果已生成未封印 | Result preview | Seal Today’s Aura |
| Sealed | 今日已封印 | Sealed preview | View Today’s Sealed Aura |

### 8.4 首页 CTA 规则

```ts
function getTodayHomeCTA(state: AppBootstrapState) {
  if (!state.hasBirthAura) {
    return {
      label: "Create Your Birth Aura",
      route: "/onboarding/birth-aura?return=/today/check-in"
    };
  }

  switch (state.todayStatus) {
    case "not_started":
      return {
        label: "Activate Today’s Aura",
        route: "/today/check-in"
      };
    case "checked_in":
    case "draw_started":
      return {
        label: "Continue Today’s Ritual",
        route: "/today/draw"
      };
    case "card_selected":
    case "generating":
      return {
        label: "Continue Reading",
        route: "/today/reading"
      };
    case "generated":
      return {
        label: "Seal Today’s Aura",
        route: `/result/${state.todayOracleId}`
      };
    case "activation_started":
      return {
        label: "Hold to Seal",
        route: `/activate/${state.todayOracleId}`
      };
    case "sealed":
      return {
        label: "View Today’s Sealed Aura",
        route: `/activated/${state.todayOracleId}`
      };
  }
}
```

---

## 9. My 页面详细需求

### 9.1 页面目的

My 页面不是复杂设置页，而是用户的个人气场档案入口。

它要回答：

```text
我是谁？
我的 Birth Aura 是什么？
今天的气场状态是什么？
我的历史记录在哪里？
未来如何同步账号？
```

### 9.2 Route

```text
/my
```

### 9.3 P0 My 页面布局

```text
[Top Header]

My Aura

[Profile Card]
Guest Aura
Your aura is saved on this device.

[Birth Aura Card]
如果已有生日：
Venus Air
Libra · Air · Opal
Guardian Color: Soft Opal Pink
[View Birth Aura]

如果无生日：
Birth Aura Required
Create your Birth Aura before starting today’s oracle.
[Create Birth Aura]

[Today Status Card]
Today’s Aura:
Not Started / In Progress / Sealed

[Journal Entry]
Aura Journal
View your sealed days and saved cards.

[Account Sync Placeholder]
Sign in to sync your aura across devices
Coming in P1

[Legal]
Privacy Policy
Terms of Use

[Bottom Tab]
Today / Journal / My
```

### 9.4 My 页面 Guest Profile Card

```text
Guest Aura

Your aura is saved on this device.
```

中文：

```text
访客气场

你的气场记录会保存在当前设备。
```

### 9.5 My 页面 P1 登录占位

```text
Account Sync

Sign in to keep your Birth Aura and Journal across devices.

Coming in P1
```

中文：

```text
账号同步

登录后可以跨设备保存你的本命气场和气场日记。

P1 开放
```

P0 点击行为：

```text
Toast: Account sync is coming soon.
```

### 9.6 My 页面菜单

| 菜单 | Route | P0 |
|---|---|---|
| Birth Aura Profile | `/my/birth-aura` | 是 |
| Aura Journal | `/journal` | 是 |
| Privacy Policy | `/legal/privacy` | 是 |
| Terms of Use | `/legal/terms` | 是 |
| Login / Sign Up | P1 | P1 占位 |
| Account Settings | P1 | P1 |
| Subscription | P1 | P1 |

---

## 10. Birth Aura Profile 页面

### 10.1 Route

```text
/my/birth-aura
```

### 10.2 页面布局

```text
Birth Aura Profile

[Large Birth Aura Card]
Venus Air

Libra · Air · Opal

Style Origin
Soft Balance

Guardian Color
Soft Opal Pink

Style Mantra
I attract through balance, not effort.

[Edit Birthday]

Note:
Changing your birthday will affect future readings.
Today’s sealed oracle will remain unchanged.
```

中文：

```text
本命气场档案

金星风象

天秤 · 风元素 · 欧泊

风格原点
柔和的平衡感

本命守护色
柔光欧泊粉

本命暗示
我通过平衡，而不是用力，产生吸引力。

[ 修改生日 ]

提示：
修改生日只会影响之后的神谕。
今天已封印的神谕不会改变。
```

### 10.3 修改生日规则

P0 允许用户修改生日。

规则：

- 修改后重新计算 Birth Aura；
- 已生成 / 已封印的今日 DailyOracle 不重新生成；
- 未来新的 DailyOracle 使用新 Birth Aura；
- 修改前需要确认弹窗。

确认弹窗：

```text
Update Birth Aura?

Changing your birthday will update future readings.
Today’s sealed oracle will remain unchanged.

[Cancel]
[Update]
```

---

## 11. Journal Lite 页面

### 11.1 Route

```text
/journal
```

### 11.2 页面布局

```text
Aura Journal

[Today]
June 13
Soft Boundary
Strength · Charcoal Navy · Structured Jacket
Sealed

[History]
June 12
Clean Renewal
The Star · Pearl White · White Shirt
Saved

June 11
Quiet Power
High Priestess · Deep Navy · Silver Ring
Sealed
```

### 11.3 空状态

```text
Your aura journal is waiting.

Seal today’s aura to begin your first entry.
```

中文：

```text
你的气场日记正在等待。

封印今天的气场，开启第一条记录。
```

### 11.4 无 Birth Aura 状态

```text
Create your Birth Aura first.

Your journal begins after your first sealed oracle.
```

中文：

```text
请先创建你的本命气场。

完成第一次封印后，你的气场日记会从这里开始。
```

---

## 12. 页面守卫规则

### 12.1 Route Guard 表

| Route | 是否需要 Birth Aura | 是否需要 Check-in | 是否需要 Oracle | 是否需要 Login |
|---|---|---|---|---|
| `/today` | 否 | 否 | 否 | 否 |
| `/journal` | 否 | 否 | 否 | 否 |
| `/my` | 否 | 否 | 否 | 否 |
| `/my/birth-aura` | 是 | 否 | 否 | 否 |
| `/onboarding/birth-aura` | 否 | 否 | 否 | 否 |
| `/today/check-in` | 是 | 否 | 否 | 否 |
| `/today/draw` | 是 | 是 | 否 | 否 |
| `/today/reading` | 是 | 是 | 是 / job | 否 |
| `/result/[id]` | 是 | 是 | 是 | 否 |
| `/activate/[id]` | 是 | 是 | 是 | 否 |
| `/activated/[id]` | 是 | 是 | 是 | 否 |
| `/share/[id]` | 是 | 是 | 是 | 否 |
| `/legal/privacy` | 否 | 否 | 否 | 否 |
| `/legal/terms` | 否 | 否 | 否 | 否 |

### 12.2 Guard 伪代码

```ts
export function guardRoute(route: string, state: AppBootstrapState) {
  if (requiresBirthAura(route) && !state.hasBirthAura) {
    return redirect(`/onboarding/birth-aura?return=${encodeURIComponent(route)}`);
  }

  if (requiresCheckIn(route) && !state.todayCheckInId) {
    return redirect("/today/check-in");
  }

  if (requiresOracle(route) && !state.todayOracleId) {
    return redirect("/today");
  }

  return allow();
}
```

---

## 13. P0 数据结构调整

### 13.1 AppBootstrapState

```ts
export interface AppBootstrapState {
  anonymousId: string;
  authStatus: "guest"; // P0 固定 guest，P1 扩展 logged_in
  timezone: string;
  localDate: string;

  hasBirthAura: boolean;
  birthAuraProfile?: BirthAuraProfile;

  todayStatus:
    | "not_started"
    | "checked_in"
    | "draw_started"
    | "card_selected"
    | "generating"
    | "generated"
    | "activation_started"
    | "sealed";

  todayCheckInId?: string;
  todayDrawSessionId?: string;
  todayOracleId?: string;
}
```

### 13.2 BirthAuraProfile

v3.4 修改：P0 不再允许 `skipped = true` 进入抽牌流程。

```ts
export interface BirthAuraProfile {
  id: string;
  anonymousUserId: string;

  month: number;
  day: number;

  zodiacSign: ZodiacSign;
  zodiacLabel: string;
  element: "fire" | "earth" | "air" | "water";
  modality: "cardinal" | "fixed" | "mutable";
  rulingSignal: string;
  birthstoneSignal: string;
  auraName: string;
  styleOrigin: string;
  guardianColor: string;
  styleMantra: string;

  createdAt: string;
  updatedAt: string;
}
```

### 13.3 DailyOracle 必须关联 BirthAuraProfile

```ts
export interface DailyOracle {
  id: string;
  anonymousUserId: string;
  birthAuraProfileId: string;
  localDate: string;
  timezone: string;

  dateAura: DateAuraSnapshot;
  mood: TodayMood;
  scene: TodayScene;
  tarotCard: TarotCardSnapshot;

  result: DailyStyleOracleResult;
  status: DailyOracleStatus;

  createdAt: string;
  sealedAt?: string;
}
```

---

## 14. P0 API 调整

### 14.1 新增：App Bootstrap

```text
GET /api/v1/app/bootstrap
```

用途：

- 初始化 anonymousId；
- 返回 Birth Aura 状态；
- 返回今日 Date Aura；
- 返回 todayStatus；
- 决定首页 CTA。

Response：

```json
{
  "ok": true,
  "data": {
    "anonymousId": "anon_xxx",
    "authStatus": "guest",
    "timezone": "Asia/Shanghai",
    "localDate": "2026-06-13",
    "hasBirthAura": true,
    "birthAuraProfile": {
      "auraName": "Venus Air",
      "zodiacLabel": "Libra",
      "element": "air",
      "guardianColor": "Soft Opal Pink"
    },
    "dateAura": {
      "auraName": "Clear Structure",
      "theme": "Today asks for structure before motion."
    },
    "todayStatus": "not_started",
    "todayOracleId": null
  }
}
```

### 14.2 新增：Create Birth Aura

```text
POST /api/v1/birth-aura
```

Request：

```json
{
  "anonymousId": "anon_xxx",
  "month": 10,
  "day": 7,
  "timezone": "Asia/Shanghai"
}
```

Response：

```json
{
  "ok": true,
  "data": {
    "birthAuraProfile": {
      "id": "birth_xxx",
      "auraName": "Venus Air",
      "zodiacLabel": "Libra",
      "element": "air",
      "birthstoneSignal": "Opal",
      "guardianColor": "Soft Opal Pink",
      "styleMantra": "I attract through balance, not effort."
    }
  }
}
```

Validation：

- month 必须 1–12；
- day 必须符合月份天数；
- 不允许空 month / day；
- 不提供 skip API。

### 14.3 更新：Start Check-in

```text
POST /api/v1/daily-check-ins/start
```

必须校验：

```text
hasBirthAura = true
```

如果没有 Birth Aura：

```json
{
  "ok": false,
  "error": {
    "code": "BIRTH_AURA_REQUIRED",
    "message": "Create your Birth Aura before starting today's oracle."
  }
}
```

### 14.4 更新：Draw Session Start

```text
POST /api/v1/draw-sessions/start
```

必须校验：

- anonymousId 存在；
- BirthAuraProfile 存在；
- 今日 Check-in 已完成；
- 今日如果已经 sealed，不再新建 official draw。

### 14.5 P1 Auth API 暂不实现

以下 API 不进入 P0：

```text
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/me
PATCH /api/v1/me
```

可以在代码中预留 route 文件夹，但不能阻塞 P0 验收。

---

## 15. P1 登录 / 密码策略

### 15.1 为什么登录放 P1

P0 的核心风险不是账号体系，而是：

1. 用户会不会完成第一次抽牌；
2. 结果页有没有命中感；
3. 用户愿不愿意封印；
4. 用户愿不愿意保存 / 分享；
5. 用户第二天是否回来。

登录会增加首次进入成本，所以 P0 不做。

### 15.2 P1 登录页面

P1 再做：

```text
/auth/login
/auth/signup
/auth/forgot-password
/auth/reset-password
/my/account
/my/account/password
```

### 15.3 P1 登录后的生日逻辑

P1 登录用户规则：

```text
如果账号已有 Birth Aura：
  直接跳过生日页，进入今日抽卡流程。

如果账号没有 Birth Aura：
  点击 Activate 后进入 Create Birth Aura。
```

这符合最新产品策略：

```text
登录不是必须。
生日是抽卡必须。
```

---

## 16. 页面文案总修正

### 16.1 删除或避免

P0 删除：

```text
Skip for now
Unknown Birth Aura
Continue without birthday
Generate
Submit
Analyze
Calculate
AI is generating
```

### 16.2 推荐使用

```text
Create Your Birth Aura
Reveal My Birth Aura
Activate Today’s Aura
Choose the card that calls you
Reading your Birth Aura
Aligning with today’s date signal
Translating energy into style
Hold to Seal
Carry it with you
```

中文：

```text
创建你的本命气场
揭示我的本命气场
激活今日气场
选择那张正在呼唤你的牌
正在读取你的本命气场
正在对齐今日日期信号
正在把能量翻译成风格
长按封印
带着它出门吧
```

---

## 17. MVP 验收标准

### 17.1 首次用户验收

必须通过：

```text
首次打开 App
→ 看到 Today Home
→ 点击 Activate
→ 因无生日被引导到 Birth Aura
→ 输入生日
→ 看到 Birth Aura Reveal
→ 进入今日状态选择
→ 抽牌
→ 生成结果
→ 长按封印
→ 分享 / 保存
→ Journal 出现记录
```

### 17.2 无生日用户阻断

必须通过：

```text
无生日用户直接访问 /today/check-in
→ 自动跳转 /onboarding/birth-aura
```

API 验收：

```text
POST /api/v1/daily-check-ins/start
无 Birth Aura
→ 返回 BIRTH_AURA_REQUIRED
```

### 17.3 有生日用户跳过生日页

必须通过：

```text
已有 Birth Aura 用户打开首页
→ 点击 Activate Today’s Aura
→ 直接进入 /today/check-in
→ 不再出现生日输入页
```

### 17.4 My 页面验收

必须通过：

```text
打开 /my
→ 显示 Guest Aura
→ 如果有 Birth Aura，显示 Birth Aura Card
→ 如果无 Birth Aura，显示 Create Birth Aura CTA
→ 显示 Journal 入口
→ 显示 Privacy / Terms
→ 登录入口标记 Coming in P1
```

### 17.5 底部导航验收

必须通过：

```text
所有主页面底部显示：
Today / Journal / My

点击 Today → /today
点击 Journal → /journal
点击 My → /my
```

### 17.6 P1 登录不阻塞 P0

必须通过：

```text
P0 不需要 /auth/login 也能完整跑通主流程。
P0 没有密码系统也能验收。
P1 登录入口不可导致页面 404 或阻塞主流程。
```

---

## 18. 最终 P0 完成定义

AuraCue v3.4 P0 完成必须满足：

```text
Guest Identity
→ Today Home
→ Birthday Required Gate
→ Birth Aura Reveal
→ Mood & Scene
→ Tarot Pull
→ Reading
→ Today’s Style Oracle
→ Guardian Item
→ Hold to Seal
→ Aura Activated
→ Share / Save
→ Journal
→ My
```

一句话总结：

```text
P0 不做登录，不做支付，不做复杂账号。
P0 必须把“每日塔罗风格神谕仪式”完整跑通。
生日是抽牌必填项，My 是 App 必备主页面，登录密码放到 P1。
```
