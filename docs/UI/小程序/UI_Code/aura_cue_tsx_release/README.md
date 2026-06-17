# AuraCue TypeScript + React TSX Screens

这份代码是给 Codex / 前端工程直接继续开发用的 TSX 实现，不是单纯图片。

## 技术栈

- TypeScript
- React TSX
- Vite
- CSS modules-style global stylesheet（当前为 `src/styles.css`，方便 Codex 快速改）
- 资源：使用你上传的 `icon.zip` 中的图标和插画资源，已整理到 `public/assets/`

## 已实现页面

| Hash Route | 页面 |
|---|---|
| `#/ritual` | 情绪 / 今日意图选择页 |
| `#/share` | Share Today’s Aura 分享页 |
| `#/sealed` | Aura Sealed 成功页 |
| `#/birth` | Birth Aura 页面 |
| `#/my` | My Aura 页面 |

默认打开 `#/ritual`。

## 运行方式

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:5173/#/ritual
http://localhost:5173/#/share
http://localhost:5173/#/sealed
http://localhost:5173/#/birth
http://localhost:5173/#/my
```

## 主要文件

```text
src/App.tsx          页面路由入口，hash 切换 5 个页面
src/pages.tsx        5 个页面的 TSX 实现
src/components.tsx   通用 UI 组件：Logo、StatusBar、Button、Nav、Chip 等
src/assets.ts        icon 资源映射
src/styles.css       全部视觉样式
public/assets/       你提供的 icon / 插画资源
preview_file.html    不依赖 React 的静态预览页面
preview_all.png      5 个页面的静态预览拼图
```

## 给 Codex 的建议

后续可以让 Codex 做三件事：

1. 把 `pages.tsx` 拆成 `src/pages/*.tsx`。
2. 把静态数据抽成 `src/data/aura.ts`。
3. 接入真实路由，例如 React Router / Next.js App Router。

当前代码重点是：先把这 5 张图对应的 UI 结构、图标资源、视觉层级和页面布局完整落成 TSX。
