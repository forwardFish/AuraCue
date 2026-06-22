# P0-01 首页字体设置说明

日期：2026-06-20

## 结论

当前 AuraCue H5/Web 首页采用两套字体：

- 标题/品牌/CTA/日期/卡片主文字：`AuraCue Cormorant`，对应 Cormorant Garamond。
- UI 辅助文字/说明/导航/eyebrow：`AuraCue Inter`，对应 Inter/SF Pro 风格。

这套设置符合参考图的气质：品牌和主视觉保留高级衬线字体，App 操作文字使用现代无衬线字体。

## 字体文件

字体已放在：

`apps/web/public/fonts/`

包含：

- `cormorant-garamond-v21-latin-500.ttf`
- `cormorant-garamond-v21-latin-600.ttf`
- `inter-v20-latin-500.ttf`
- `inter-v20-latin-600.ttf`
- `inter-v20-latin-700.ttf`

## CSS 设置

入口文件：

`apps/web/components/latest-ui.css`

核心设置：

```css
@font-face {
  font-family: "AuraCue Cormorant";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/cormorant-garamond-v21-latin-500.ttf") format("truetype");
}

@font-face {
  font-family: "AuraCue Cormorant";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/cormorant-garamond-v21-latin-600.ttf") format("truetype");
}

@font-face {
  font-family: "AuraCue Inter";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/inter-v20-latin-500.ttf") format("truetype");
}

@font-face {
  font-family: "AuraCue Inter";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/inter-v20-latin-600.ttf") format("truetype");
}

@font-face {
  font-family: "AuraCue Inter";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/inter-v20-latin-700.ttf") format("truetype");
}

.latest-phone {
  --latest-display: "AuraCue Cormorant", "Cormorant Garamond", "Noto Serif SC", serif;
  --latest-sans: "AuraCue Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", Inter, "PingFang SC", sans-serif;
  font-family: var(--latest-sans);
  font-synthesis: none;
  text-rendering: geometricPrecision;
}
```

## 首页分配规则

| 页面元素 | 字体 |
| --- | --- |
| AuraCue Logo | `var(--latest-display)` |
| 副标题 `Your Daily Tarot Style Oracle` | `var(--latest-sans)` |
| 日期胶囊 `Jun 13 • Saturday` | `var(--latest-display)` |
| `TODAY'S RULING PLANET` | `var(--latest-sans)` |
| 主标题 `Saturn` | `var(--latest-display)` |
| 三个特质标签 | `var(--latest-display)` |
| CTA `Start My First Aura` | `var(--latest-display)` |
| 底部导航 `Home / My` | `var(--latest-sans)` |

## 当前实现状态

已完成：

- 首页字体已从默认 serif/Georgia 统一切到 AuraCue 字体变量。
- 本地字体文件已接入，不依赖外链 CDN。
- 首页接口 `/api/v1/home` 已接入，运行时请求返回 200；首页不再只靠前端静态写死。
- 首页主卡人物背景图按当前口径默认接受，不再作为本轮主要阻塞项。

仍需人工验收：

- 首页是否认可当前视觉效果。
- 如果要继续做更高的一比一程度，下一步重点是按钮渐变、卡片细边框、主卡内部元素位置，而不是字体基础设置。

## 本轮验证

通过：

- `pnpm --filter @auracue/web test:pages`
- `pnpm --filter @auracue/web typecheck`
- `pnpm --filter @auracue/web test:api foundation`
- `T13_WEB_PORT=3220 T13_CDP_PORT=9330 pnpm --filter @auracue/web test:e2e`
- `pnpm --filter @auracue/web test:visual`

证据：

- 首页截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/01-home.png`
- 视觉指标：`docs/auto-execute/screenshots/web/T15/metrics/P0-01.json`
- API 记录：`docs/auto-execute/api/web/T13/runtime-smoke-api-transcript.json`

