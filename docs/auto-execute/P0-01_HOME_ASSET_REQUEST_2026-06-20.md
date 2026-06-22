# P0-01 首页主卡背景资产请求

## 当前结论

P0-01 首页的真实前端结构和功能已经接入并通过测试，但要继续接近一比一，关键缺口不是 icon，而是首页主卡背景图。

当前页面中以下内容已经由前端代码渲染，不需要放进图片：

- 顶部状态栏：时间、信号、Wi-Fi、电池
- AuraCue logo 和副标题
- 日期胶囊：`Jun 13 • Saturday`
- 主卡文字：`TODAY'S RULING PLANET`
- 主卡标题：`Saturn`
- 主卡两组星线分隔
- 三个标签：`Structure`、`Boundaries`、`Stability`
- CTA：`Start My First Aura`
- 底部导航：`Home`、`My`

当前最大差异来自主卡背景人物、光环、云层和卡片质感。现有生成图只能接近风格，无法和参考图人物构图一比一。

## 当前证据

- 当前 H5 首页截图：`docs/auto-execute/screenshots/web/T13/runtime-smoke/01-home.png`
- 参考图：`docs/UI/小程序/P0-01-Home-首页今日守护星.png`
- 当前视觉指标：`docs/auto-execute/screenshots/web/T15/metrics/P0-01.json`
- 当前 `diffRatio`: `0.495031`

## 需要生成的资产

文件建议命名：

```text
home-saturn-planet-hero-card.png
```

建议尺寸：

```text
881 x 813 PNG
```

用途：

```text
只作为首页主卡背景图使用，由前端代码覆盖渲染文字、标签和按钮。
```

## image2 提示词

```text
请生成 AuraCue 首页主卡背景图，不要生成整页 UI。

画面比例 881:813，圆角方形卡片构图，高分辨率 PNG。

目标风格：精致塔罗 / 时尚占星 / 高级女性向 oracle app，淡紫色、粉色、奶油白、浅金色，柔光、星尘、云层、细腻插画质感。

画面内容：
1. 背景是淡紫粉色星空，带细小星点和轻微颗粒质感。
2. 右侧是一位闭眼侧脸女性插画，面向右侧，黑色盘发，肩颈和上半身可见，穿浅粉或淡紫薄纱服装。
3. 女性的位置需要接近参考图：头发从画面中部偏右开始，脸在右侧 70%-82% 区域，肩颈在右下区域；不要像普通头像那样贴最右边，也不要太小。
4. 女性背后有一个发光圆形星盘 / 行星光环，光环中心偏右上，能覆盖人物背后并延伸到画面中部。
5. 底部有粉白云层，右下云层包围人物肩部，左下也有柔和云层。
6. 卡片边缘有非常细的浅金/白色双层圆角描边和柔光，但不要太重。
7. 左侧必须留出干净的文字区域，允许有柔和星空和云雾，但不要出现人物脸、文字残影或高对比细节。

禁止内容：
- 不要任何文字、字母、数字。
- 不要出现 Saturn。
- 不要出现 TODAY'S RULING PLANET。
- 不要三个标签按钮。
- 不要 CTA 按钮。
- 不要 AuraCue logo。
- 不要顶部状态栏。
- 不要底部导航。
- 不要手机外框。
- 不要把整页截图画进去。

输出要求：
- PNG。
- 画面必须是单独的主卡背景。
- 文字区域必须干净，因为后续会由真实前端代码渲染文字。
- 不要把参考图里的 UI 元素烙进背景。
```

## 验收标准

生成后我会接入：

```text
apps/web/public/aura-assets/home-saturn-planet-hero-card.png
```

然后重新运行：

```text
pnpm --filter @auracue/web test:pages
T13_WEB_PORT=3220 T13_CDP_PORT=9330 pnpm --filter @auracue/web test:e2e
pnpm --filter @auracue/web test:visual
pnpm --filter @auracue/web typecheck
```

P0-01 通过你人工验收后，才进入 P0-02。
