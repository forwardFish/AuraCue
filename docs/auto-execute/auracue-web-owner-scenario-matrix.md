# AuraCue Web/H5 Owner Scenario Matrix

| Scenario ID | Persona | 前置条件 | 点击路径 | 必须 API/DB | 可见结果 | 未来证据 | 状态 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Owner-001 | 首次 Web 用户 | 无 anonymousId，无 active card | `/` 选 Confident -> Start -> context Work -> skip upload -> draw Card II -> reveal | API-001,004,005,006,007; DB user/draw/job/card | `/result/[id]` 展示 auraName 和内容 | `traces/web/T13/happy-path` | PLANNED |
| Owner-002 | 不上传用户 | 已有 mood/context | upload 页点 Skip -> draw -> result | API-004,005; 无 upload DB 依赖 | 不上传仍能生成 card | `traces/web/T13/skip-upload` | PLANNED |
| Owner-003 | 上传失败用户 | mock 文件过大或 API failure | upload fail -> Retry/Skip -> draw -> result | API-003 failure, API-004/005 success | 上传失败不阻塞生成 | `traces/web/T13/upload-failure` | PLANNED |
| Owner-004 | 激活仪式用户 | 已有 card | result -> Activate -> 选 Jewelry -> hold 1000ms cancel -> hold 3100ms seal | API-009,010; DB activation/card | `/activated/[id]` 成功态 | `traces/web/T13/activation` | PLANNED |
| Owner-005 | 分享保存用户 | 已 activated card | Save Card -> saved -> Share Story -> Copy Link -> Save Image | API-011,012; DB saved/share | saved 页面、share 页面、copy/download feedback | `traces/web/T13/share-save` | PLANNED |
| Owner-006 | 今日已激活回访用户 | DB 有今日 activated card | 首页加载 -> Today's Aura Active -> activated | API-002,007 | 首页入口可见并进入 activated | `traces/web/T13/today-active` | PLANNED |

