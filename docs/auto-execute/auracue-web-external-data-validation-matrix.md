# AuraCue Web/H5 External Data Validation Matrix

本阶段没有 Feishu/Bitable/Airtable/Notion/SaaS 真实写入目标。所有外部副作用默认 local-only。

| Data ID | 外部目标 | P0 状态 | 规则 | 后续证据 |
| --- | --- | --- | --- | --- |
| EXT-AI | OpenAI-compatible / DeepSeek | 可选 live，默认 mock | 无密钥时走 mock；有密钥也不得泄露；live smoke 必须写 limitation | T06 result JSON |
| EXT-STORAGE | R2/S3/cloud storage | P1 / local-only | P0 使用 local `public/uploads` 和 `public/generated-cards` 或测试目录 | T04/T08 logs |
| EXT-PAYMENT | 支付/微信支付 | OUT_OF_SCOPE_WITH_REASON | P0 禁止真实支付和付费墙主线 | T16 final gate |
| EXT-WEB-SHARE | Browser Web Share API | browser capability | 不可用时 fallback copy link，并记录 share API | T13 trace |
