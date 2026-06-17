# AuraCue Ritual Flow — TypeScript + React TSX

这是根据你提供的 8 张 UI 参考图和 `icon.zip` 资源整理出来的前端实现代码，不是静态图片切图。

## 技术栈

- TypeScript
- React TSX
- Vite
- CSS Modules 风格的全局 CSS（便于 Codex 继续拆分组件）

## 已实现页面

| Route | Page |
|---|---|
| `#/draw` | Choose the card that calls you 抽卡页 |
| `#/birthday` | Enter Your Birthday 生日输入页 |
| `#/hold` | Hold to Seal 长按封印页 |
| `#/result` | Saturn / Strength / Style Cue 结果页 |
| `#/reading` | Reading your aura 读取中页 |
| `#/error` | Your aura slipped away 错误重试页 |
| `#/preparing` | Preparing your oracle 准备神谕页 |
| `#/birth-result` | Your Birth Aura is Venus Air 出生气场结果页 |

## 目录说明

```text
src/
  App.tsx          # hash route demo
  main.tsx         # React 入口
  assets.ts        # 统一管理 public/assets 资源路径
  components.tsx   # 状态栏、品牌头、按钮、底部导航等复用组件
  pages.tsx        # 8 个页面组件
  styles.css       # 全部视觉样式
public/assets/     # 已从 icon.zip 整理、透明化、重命名后的资源
screenshots/        # 本地渲染出来的 8 张预览图
preview_all.png     # 8 张页面总览图
```

## 运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:5173/#/draw
http://localhost:5173/#/birthday
http://localhost:5173/#/hold
http://localhost:5173/#/result
http://localhost:5173/#/reading
http://localhost:5173/#/error
http://localhost:5173/#/preparing
http://localhost:5173/#/birth-result
```

## 给 Codex 的重点

- 不要把页面当成一张背景大图；页面结构已按 React 组件拆分。
- `public/assets/` 里是这批页面实际用到的 icon、插画、卡背、loading icon。
- `src/assets.ts` 是资源唯一入口，后续替换 icon 不要在页面里散写路径。
- 样式目前集中在 `src/styles.css`，后续可以按页面拆成 CSS Module。
