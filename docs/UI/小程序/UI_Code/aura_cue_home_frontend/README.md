# AuraCue Home Frontend

这是根据参考图重画的 AuraCue 首页前端代码，已使用你压缩包里的 icon/插画资源，并把可见棋盘格背景处理成透明 PNG。

## 文件说明

- `index.html`：可直接打开的静态预览页，无框架依赖。
- `styles.css`：页面全部样式，按 941 × 1672 设计稿尺寸还原。
- `assets/`：本页需要的透明 PNG 资源，已重命名，Codex 更容易使用。
- `react/AuraCueHome.jsx`：React 组件版本。
- `react/AuraCueHome.css`：React 组件样式。
- `preview.png`：我渲染出来的效果图。

## Codex 使用建议

如果你是 H5 / Web App：

1. 直接把 `index.html + styles.css + assets/` 放到页面目录。
2. 页面宽高基准是 `941px × 1672px`，CSS 里已经加了移动端缩放：`@media (max-width: 941px)`。
3. 需要接入真实路由时，把按钮绑定到：
   - `Start My First Aura` → `/ritual` 或 `/onboarding`
   - `Home` → `/`
   - `My` → `/my`

如果你是 React / Next.js：

1. 把 `assets/` 放到 `public/assets/`。
2. 复制 `react/AuraCueHome.jsx` 和 `react/AuraCueHome.css` 到组件目录。
3. 在页面里引入：

```jsx
import AuraCueHome from './AuraCueHome';

export default function Page() {
  return <AuraCueHome />;
}
```

## 可替换变量

- 日期文案：`Jun 13 · Saturday`
- 星球名称：`Saturn`
- 三个关键词：`Structure / Boundaries / Stability`
- CTA：`Start My First Aura`
