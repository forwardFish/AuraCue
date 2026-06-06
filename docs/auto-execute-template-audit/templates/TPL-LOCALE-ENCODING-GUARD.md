# TPL-LOCALE-ENCODING-GUARD - 中文、Locale 与编码保护任务模板

## 适用场景

用于中文项目、中文业务字段、中文 UI copy、中文报告、Feishu/Bitable 字段名、Windows 终端输出易乱码的项目，建立 UTF-8、mojibake、copy drift、字段名保真检查。典型历史风险包括中文小程序页面、`mojibake-guard`、中文运营报表。

## 不适用场景

- 不用于单纯翻译任务。
- 不用于替代页面实现或视觉验收。
- 不用于把业务文案重新创作成另一套意思。
- 不用于只检查终端显示效果。

## Task 开头必填

| 字段 | 填写要求 |
| --- | --- |
| Task Template ID | `TPL-LOCALE-ENCODING-GUARD` |
| Task 类型 | locale/encoding guard |
| 主验收面 | UTF-8 integrity, Chinese copy preservation, mojibake scan |
| 为什么选这个模板 | 说明本任务要防中文乱码或字段漂移 |
| 覆盖对象 | Copy IDs、Field IDs、UI IDs、Report IDs、ExternalData IDs |
| 辅助模板 | `TPL-MINIAPP-PAGE`、`TPL-FRONTEND-PAGE`、`TPL-EXTERNAL-DATA`、`TPL-ALERT-REPORTING` |

## 必须读取输入

- PRD/UI/source 中的中文原文。
- 用户明确给定的字段名、页面文案、报告文案。
- 目标文件编码和现有中文文件。
- Windows/PowerShell 输出限制说明。
- 外部表字段 mapping if present。
- 当前乱码或替换字符样本。

## 允许改动范围

- locale/copy constants。
- Chinese field mapping docs。
- encoding scan scripts/tests。
- affected UI/report docs only if scoped。
- result JSON 和 HANDOFF。

## 禁止事项

- 禁止用拼音、英文别名或占位符替代用户给定中文字段。
- 禁止机械“反乱码”后不做语义校验。
- 禁止把 PowerShell 终端显示正常当文件编码正常证明。
- 禁止把 `?`、replacement character、mojibake 静默保留。
- 禁止修改 source reference 原文。

## 执行步骤模板

1. 建立中文 source-of-truth：字段名、页面 copy、报告 copy、表名、状态文案。
2. 扫描目标文件 UTF-8 可读性，记录 BOM、replacement char、mojibake markers。
3. 对关键中文字符串做 code point 或 JSON key 级别校验，避免终端显示误判。
4. 修复 scoped 文件中的乱码或 copy drift，保留业务含义和绑定结构。
5. 对外部数据字段建立 exact Chinese field mapping。
6. 添加 encoding/copy regression test 或 scan script。
7. 输出 scan result、修复清单、无法自动恢复的语义 blocker。

## 内容准确性门槛

| 门槛 | 必须写清 |
| --- | --- |
| source 原文 | 每个关键中文字段/copy 必须有来源路径或用户指令 |
| UTF-8 证明 | 文件必须按 UTF-8 读取校验，不能依赖终端渲染 |
| mojibake 扫描 | 必须扫描常见乱码、replacement char、孤立问号风险 |
| 语义保真 | 已退化成 `?` 的文本不能猜，应写 blocker 或从业务语义重建 |
| 外部字段 | Feishu/Bitable 等字段名必须保持精确中文 |

## 最低验证命令

```powershell
<utf-8/mojibake scan command>
<copy field mapping validation command>
<affected UI/report smoke command if scoped>
```

## 验收证据

- UTF-8/mojibake scan result。
- Chinese field/copy mapping report。
- code point or JSON-key validation output。
- affected UI/report smoke evidence if scoped。
- result JSON 和 HANDOFF。

## Result JSON 必填

- `taskId`
- `templateId`
- `status`
- `checkedFiles`
- `copySources`
- `mojibakeFindings`
- `fieldMappings`
- `repairActions`
- `semanticBlockers`
- `limitations`

## 失败路由

- file contains confirmed mojibake after repair：`REPAIR_REQUIRED`。
- original source missing for unrecoverable copy：`BLOCKED_BY_MISSING_SOURCE`。
- encoding scan cannot run：`BLOCKED_BY_ENVIRONMENT`。
- external Chinese field drift detected：`REPAIR_REQUIRED`。
