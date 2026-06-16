# AuraCue 首页视觉设计与前端开发标准文档 v1.0

> 文档用途：作为 AuraCue 首页的视觉设计标准、前端组件拆分标准、开发验收标准。  
> 适用范围：H5 / Web App / 移动端响应式页面。  
> 当前基准：以已确认的“第 3 个方向”最终首页 UI 为标准。  
> 页面名称：`01-进入_首页生成入口`  
> 页面目标：让用户以低门槛、强仪式感的方式选择今日心情，并进入 Lucky Aura Card 生成流程。

---

## 0. 一句话设计结论

AuraCue 首页不做普通工具入口，也不做复杂塔罗占卜页，而是做成：

> **轻疗愈 + 高级生活方式 + 今日气场选择 + Lucky Aura Card 生成入口。**

页面视觉应当是：

- 柔和
- 高级
- 清晰
- 有仪式感
- 易开发
- 易扩展
- 适合女性向轻疗愈 / 美妆 / 穿搭 / 情绪产品商业化

---

# 1. 产品与页面定位

## 1.1 首页核心任务

首页只完成一个核心动作：

> **用户选择今日 mood，然后点击 Start My Aura Card。**

不要在首页加入过多功能，例如完整报告、历史卡包、复杂设置、AI 聊天、多步骤问卷。

---

## 1.2 首页用户心理

用户进入首页时，应该感受到：

1. 这是一个温柔、高级、可信的日常仪式产品。
2. 我只需要选择今天的状态，不需要理解复杂规则。
3. 选择后会生成属于我的幸运气场卡。
4. 这个结果可能和穿搭、情绪、气质、今日行动有关。
5. 页面足够美，我愿意继续点下去。

---

## 1.3 首页不应该像什么

首页不要做成：

- 工具站首页
- AI 报告生成器
- 普通情绪记录 App
- 传统塔罗占卜小程序
- 电商商品列表
- 复杂仪表盘
- 过度少女化的贴纸风页面

---

# 2. 视觉设计总原则

## 2.1 关键词

```text
soft luxury
aura wellness
pastel gradient
editorial card
gentle ritual
feminine but not childish
premium lifestyle
calm emotional guidance
```

中文理解：

```text
柔和高级
轻疗愈
气场感
高级生活方式
柔粉紫渐变
大卡片
留白
每日仪式
不是幼稚少女风
不是重玄学风
```

---

## 2.2 当前标准视觉方向

当前最终首页采用：

- 浅奶油白背景
- 粉紫柔光渐变
- 大标题 serif 字体
- 3 张横向大卡片
- 高级 mood card 选择
- 顶部轻品牌感
- 底部极简 Home / Profile 导航
- CTA 按钮使用紫粉桃渐变

---

## 2.3 视觉优先级

页面视觉层级从高到低：

1. 主标题：`Start Your Aura Journey`
2. 三张 Mood Card
3. 主 CTA：`Start My Aura Card`
4. 日期徽章与筛选标签
5. 顶部头像 / 礼物按钮 / 底部导航

---

# 3. 页面信息架构

## 3.1 页面结构总览

首页从上到下分为 8 个区块：

```text
1. App Safe Area / Status Bar
2. Top Header
3. Brand Logo
4. Date Badge
5. Hero Section
6. Filter Chips
7. Mood Card List
8. Primary CTA
9. Bottom Tab Bar
```

---

## 3.2 页面结构示意

```tsx
<AppShell>
  <PageBackground />

  <HomePage>
    <TopHeader>
      <ProfileAvatarButton />
      <BrandLogo />
      <GiftButton />
    </TopHeader>

    <DateBadge />

    <HeroSection>
      <HeroTitle />
      <HeroSubtitle />
    </HeroSection>

    <MoodFilterTabs />

    <MoodCardList>
      <MoodCard mood="confident" selected />
      <MoodCard mood="romantic" />
      <MoodCard mood="calm" />
    </MoodCardList>

    <PrimaryCTAButton />

    <BottomSafeSpacer />
  </HomePage>

  <BottomTabBar />
</AppShell>
```

---

# 4. 页面文案标准

## 4.1 品牌名称

```text
AuraCue
```

Logo 展示可使用：

```text
AURACUE
```

或：

```text
AuraCue
```

建议首页顶部使用字母间距较大的 `AURACUE`，增强高级品牌感。

---

## 4.2 日期 Badge

```text
Today, 18 Jul 2024
```

后续可以动态替换为当天日期。

---

## 4.3 主标题

当前标准：

```text
Start Your Aura Journey
```

备选文案：

```text
How do you want to feel today?
```

当前页面已确认使用：

```text
Start Your Aura Journey
```

因为它更像高级 lifestyle / ritual App，而不是普通表单问题。

---

## 4.4 副标题

```text
Choose today’s mood to reveal your lucky aura card.
```

要求：

- 简短
- 不解释技术
- 不出现 AI 生成报告感
- 不出现复杂功能词

---

## 4.5 Filter Chips

```text
All
Calm
Romantic
Lucky
```

MVP 阶段只做点击高亮即可，不一定真实过滤。

---

## 4.6 Mood Card 文案

### Confident

```text
Title: Confident
Description: Walk in your power and shine today.
Energy: High Energy
```

### Romantic

```text
Title: Romantic
Description: Open your heart to love and beautiful moments.
Energy: Love Energy
```

### Calm

```text
Title: Calm
Description: Breathe deep and find your inner peace.
Energy: Peace Energy
```

---

## 4.7 主按钮

```text
Start My Aura Card
```

Loading 状态：

```text
Creating your aura...
```

Disabled 状态：

```text
Choose a mood first
```

---

# 5. 页面尺寸与布局规范

## 5.1 设计基准

```text
设计基准宽度：390px
设计基准高度：844px
最大页面宽度：430px
最小支持宽度：360px
左右安全边距：20px
```

---

## 5.2 AppShell

```css
.app-shell {
  min-height: 100dvh;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  background: var(--bg-page);
}
```

如果是纯 H5：

```css
body {
  margin: 0;
  background: #0b0610;
}
```

让中间 App 居中，外部可用深色背景衬托。

---

## 5.3 HomePage 主体

```css
.home-page {
  position: relative;
  z-index: 1;
  padding: 12px 20px 104px;
}
```

说明：

- `104px` 是为底部 TabBar 留出的空间。
- 如果底部 TabBar 不固定，可改为 `padding-bottom: 24px`。

---

## 5.4 页面纵向间距

| 区域 | 与上一区域间距 |
|---|---:|
| TopHeader 顶部 | 12px |
| TopHeader → DateBadge | 16px |
| DateBadge → HeroTitle | 24px |
| HeroTitle → HeroSubtitle | 12px |
| HeroSubtitle → FilterTabs | 24px |
| FilterTabs → MoodCardList | 18px |
| MoodCard 之间 | 14px |
| MoodCardList → CTA | 22px |
| CTA → BottomTabBar | 20px |

---

# 6. 组件清单

## 6.1 页面级组件

| 组件名 | 职责 | 是否必须 |
|---|---|---|
| `AppShell` | 页面壳、最大宽度、背景容器 | 是 |
| `PageBackground` | 背景渐变与柔光层 | 是 |
| `HomePage` | 首页内容布局 | 是 |
| `BottomTabBar` | 底部导航 | 是 |

---

## 6.2 顶部组件

| 组件名 | 职责 |
|---|---|
| `TopHeader` | 顶部头像、Logo、礼物按钮布局 |
| `ProfileAvatarButton` | 用户头像入口 |
| `BrandLogo` | 莲花图标 + AURACUE |
| `GiftButton` | 右上角礼物入口 |
| `DateBadge` | 日期胶囊 |

---

## 6.3 内容组件

| 组件名 | 职责 |
|---|---|
| `HeroSection` | 主标题 + 副标题 |
| `MoodFilterTabs` | mood 筛选标签容器 |
| `MoodFilterChip` | 单个筛选标签 |
| `MoodCardList` | mood 卡片列表 |
| `MoodCard` | 单张气场 mood 卡 |
| `PrimaryCTAButton` | 主操作按钮 |

---

## 6.4 装饰组件

| 组件名 | 职责 |
|---|---|
| `SparkleIcon` | 星光点缀 |
| `SelectionIndicator` | 卡片右上角选中态 |
| `EnergyMeta` | 卡片底部能量标签 |
| `MoodArtwork` | 卡片右侧视觉图 |

---

# 7. 设计 Token

## 7.1 色彩 Token

```css
:root {
  /* Page Background */
  --bg-page: #FAF7F9;
  --bg-page-lilac: #F1EAF8;
  --bg-page-blush: #FCEEF3;
  --bg-page-peach: #F8E8E0;

  /* Text */
  --text-primary: #2F174D;
  --text-secondary: #6F617B;
  --text-muted: #9A8EA5;
  --text-inverse: #FFFFFF;

  /* Brand */
  --brand-purple-900: #2F174D;
  --brand-purple-700: #6B3BAE;
  --brand-purple-600: #8148C6;
  --brand-purple-500: #9D6ADF;

  --brand-pink-600: #D66AA7;
  --brand-pink-500: #ED93BD;
  --brand-pink-400: #F5B4D2;

  --brand-peach-400: #F4B7A5;
  --brand-peach-300: #F7D2C7;

  /* Surface */
  --surface-white: rgba(255, 255, 255, 0.72);
  --surface-glass: rgba(255, 255, 255, 0.44);
  --surface-card: rgba(255, 255, 255, 0.28);

  /* Border */
  --border-soft: rgba(101, 74, 128, 0.14);
  --border-glass: rgba(255, 255, 255, 0.48);
  --border-selected: rgba(218, 190, 255, 0.92);

  /* Shadow */
  --shadow-soft: rgba(95, 67, 124, 0.12);
  --shadow-card: rgba(114, 83, 151, 0.16);
  --shadow-cta: rgba(154, 89, 191, 0.26);

  /* State */
  --state-selected: #8A55D2;
  --state-selected-light: #D9C2FF;
  --state-disabled: #D8D0DE;
}
```

---

## 7.2 页面背景

建议使用纯 CSS 渐变，避免依赖大图：

```css
.aura-page-bg {
  background:
    radial-gradient(circle at 18% 18%, rgba(246, 224, 239, 0.85), transparent 34%),
    radial-gradient(circle at 78% 28%, rgba(235, 219, 250, 0.82), transparent 32%),
    radial-gradient(circle at 76% 78%, rgba(250, 213, 220, 0.72), transparent 34%),
    linear-gradient(180deg, #FAF7F9 0%, #F6F0F8 100%);
}
```

---

## 7.3 卡片渐变

### Confident

```css
--card-confident-bg:
  linear-gradient(135deg, #B98BEA 0%, #D5B7F5 45%, #F3CFE1 100%);
```

### Romantic

```css
--card-romantic-bg:
  linear-gradient(135deg, #F0A9C4 0%, #F6BFD1 48%, #FBE3EA 100%);
```

### Calm

```css
--card-calm-bg:
  linear-gradient(135deg, #BFC1ED 0%, #D7D4F3 45%, #F3DCEB 100%);
```

---

## 7.4 CTA 渐变

```css
--cta-gradient:
  linear-gradient(90deg, #7C3EBB 0%, #C978D5 46%, #F3B3A5 100%);
```

---

# 8. 字体规范

## 8.1 字体选择

### 标题字体

推荐：

```text
Playfair Display
```

备选：

```text
Cormorant Garamond
Georgia
```

### 正文字体

推荐：

```text
Inter
```

备选：

```text
SF Pro Text
system-ui
```

---

## 8.2 字体层级

| Token | 用途 | 字体 | 字号 | 行高 | 字重 |
|---|---|---|---:|---:|---:|
| `display-xl` | Hero 标题 | Playfair Display | 52px | 58px | 600 |
| `display-lg` | 卡片标题 | Playfair Display | 31px | 36px | 600 |
| `brand-md` | Logo 文本 | Playfair Display | 20px | 24px | 500 |
| `button-lg` | 主 CTA | Playfair Display | 21px | 26px | 500 |
| `body-lg` | Hero 副标题 | Inter | 17px | 26px | 400 |
| `body-md` | 卡片描述 | Inter | 15px | 22px | 400 |
| `chip-md` | 标签 | Inter | 14px | 20px | 500 |
| `meta-md` | Energy 文案 | Inter | 14px | 20px | 500 |
| `tab-sm` | 底部 Tab | Inter | 13px | 18px | 500 |

---

## 8.3 移动端小屏适配

当屏幕宽度小于 `375px`：

```css
@media (max-width: 374px) {
  .hero-title {
    font-size: 46px;
    line-height: 52px;
  }

  .mood-card-title {
    font-size: 28px;
    line-height: 32px;
  }

  .primary-cta {
    height: 56px;
    font-size: 19px;
  }
}
```

---

# 9. 圆角、阴影与玻璃质感

## 9.1 圆角 Token

```css
:root {
  --radius-xs: 8px;
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 26px;
  --radius-pill: 999px;
}
```

---

## 9.2 阴影 Token

```css
:root {
  --shadow-soft-card:
    0 8px 24px rgba(95, 67, 124, 0.10),
    inset 0 1px 0 rgba(255, 255, 255, 0.34);

  --shadow-selected-card:
    0 12px 30px rgba(137, 89, 199, 0.24),
    0 0 0 3px rgba(218, 190, 255, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.42);

  --shadow-cta:
    0 12px 28px rgba(154, 89, 191, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.38);
}
```

---

## 9.3 玻璃质感

```css
.glass-surface {
  background: rgba(255, 255, 255, 0.48);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.48);
}
```

注意：

- `backdrop-filter` 在部分低端机上可能性能一般。
- MVP 可以先用半透明背景 + 阴影，不强依赖真实玻璃模糊。

---

# 10. 组件规格

---

## 10.1 TopHeader

### 结构

```tsx
<TopHeader>
  <ProfileAvatarButton />
  <BrandLogo />
  <GiftButton />
</TopHeader>
```

### CSS 建议

```css
.top-header {
  height: 72px;
  display: grid;
  grid-template-columns: 56px 1fr 56px;
  align-items: center;
}
```

---

## 10.2 ProfileAvatarButton

### 尺寸

```text
外层：48px × 48px
头像：44px × 44px
状态点：12px × 12px
```

### 样式

```css
.profile-avatar {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  padding: 2px;
  background: rgba(255,255,255,0.72);
  border: 1px solid rgba(255,255,255,0.62);
  box-shadow: 0 6px 18px rgba(95, 67, 124, 0.12);
}
```

---

## 10.3 BrandLogo

### 结构

```tsx
<div className="brand-logo">
  <LotusIcon />
  <span>AURACUE</span>
</div>
```

### 样式

```css
.brand-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-primary);
}

.brand-logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  line-height: 24px;
  letter-spacing: 0.14em;
  font-weight: 500;
}
```

---

## 10.4 GiftButton

### 尺寸

```text
48px × 48px
圆角：16px
```

### 样式

```css
.icon-button {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.56);
  border: 1px solid rgba(101, 74, 128, 0.12);
}
```

---

## 10.5 DateBadge

### 尺寸

```text
高度：36px
左右 padding：18px
圆角：999px
```

### 样式

```css
.date-badge {
  width: fit-content;
  margin: 4px auto 0;
  height: 36px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid var(--border-soft);
  color: var(--text-secondary);
  font-size: 14px;
}
```

---

## 10.6 HeroSection

### 结构

```tsx
<section className="hero-section">
  <h1>Start Your<br />Aura Journey</h1>
  <p>Choose today’s mood to reveal your lucky aura card.</p>
</section>
```

### 样式

```css
.hero-section {
  margin-top: 24px;
  text-align: center;
}

.hero-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: 52px;
  line-height: 58px;
  font-weight: 600;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.hero-subtitle {
  margin: 14px auto 0;
  max-width: 300px;
  font-size: 17px;
  line-height: 26px;
  color: var(--text-secondary);
}
```

---

## 10.7 MoodFilterTabs

### 结构

```tsx
<MoodFilterTabs
  value={selectedFilter}
  onChange={setSelectedFilter}
  items={[
    { id: 'all', label: 'All', icon: 'sparkles' },
    { id: 'calm', label: 'Calm', icon: 'leaf' },
    { id: 'romantic', label: 'Romantic', icon: 'heart' },
    { id: 'lucky', label: 'Lucky', icon: 'clover' },
  ]}
/>
```

### 容器

```css
.mood-filter-tabs {
  margin-top: 24px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}
```

### 单个 Chip

```css
.filter-chip {
  height: 40px;
  padding: 0 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid var(--border-soft);
}

.filter-chip[data-selected="true"] {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(90deg, #8B4ED0 0%, #F0A1B7 100%);
  box-shadow: 0 8px 18px rgba(155, 92, 197, 0.20);
}
```

---

# 11. MoodCard 组件规范

## 11.1 MoodCard 数据结构

```ts
export type MoodId = 'confident' | 'romantic' | 'calm'

export interface MoodCardItem {
  id: MoodId
  title: string
  description: string
  energyLabel: string
  energyIcon: 'spark' | 'heart' | 'leaf'
  theme: 'confident' | 'romantic' | 'calm'
  artworkSrc: string
}
```

---

## 11.2 数据示例

```ts
export const moodCards: MoodCardItem[] = [
  {
    id: 'confident',
    title: 'Confident',
    description: 'Walk in your power and shine today.',
    energyLabel: 'High Energy',
    energyIcon: 'spark',
    theme: 'confident',
    artworkSrc: '/images/moods/confident.webp',
  },
  {
    id: 'romantic',
    title: 'Romantic',
    description: 'Open your heart to love and beautiful moments.',
    energyLabel: 'Love Energy',
    energyIcon: 'heart',
    theme: 'romantic',
    artworkSrc: '/images/moods/romantic.webp',
  },
  {
    id: 'calm',
    title: 'Calm',
    description: 'Breathe deep and find your inner peace.',
    energyLabel: 'Peace Energy',
    energyIcon: 'leaf',
    theme: 'calm',
    artworkSrc: '/images/moods/calm.webp',
  },
]
```

---

## 11.3 MoodCard 尺寸

```text
宽度：100%
高度：136px
圆角：24px
内边距：20px
卡片间距：14px
```

---

## 11.4 MoodCard 布局

```css
.mood-card {
  position: relative;
  height: 136px;
  overflow: hidden;
  border-radius: 24px;
  padding: 20px;
  display: flex;
  align-items: stretch;
  border: 1px solid rgba(255,255,255,0.46);
  box-shadow: var(--shadow-soft-card);
}
```

---

## 11.5 MoodCard 左侧内容

```css
.mood-card-content {
  position: relative;
  z-index: 2;
  width: 48%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mood-card-title {
  font-family: var(--font-display);
  font-size: 31px;
  line-height: 36px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.mood-card-desc {
  margin-top: 6px;
  font-size: 15px;
  line-height: 22px;
  color: rgba(255,255,255,0.92);
}

.mood-card-meta {
  margin-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: rgba(255,255,255,0.96);
}
```

---

## 11.6 MoodCard 图片区域

```css
.mood-card-artwork {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 58%;
  height: 100%;
  z-index: 1;
}

.mood-card-artwork img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

说明：

- 插画建议右侧半透明融合。
- 人物 / 花 / 石头最好提前处理成 WebP。
- 不建议前端实时抠图。
- 若图片过大，移动端性能会受影响。

---

## 11.7 MoodCard 背景主题

```css
.mood-card[data-theme="confident"] {
  background: linear-gradient(135deg, #B98BEA 0%, #D5B7F5 45%, #F3CFE1 100%);
}

.mood-card[data-theme="romantic"] {
  background: linear-gradient(135deg, #F0A9C4 0%, #F6BFD1 48%, #FBE3EA 100%);
}

.mood-card[data-theme="calm"] {
  background: linear-gradient(135deg, #BFC1ED 0%, #D7D4F3 45%, #F3DCEB 100%);
}
```

---

## 11.8 MoodCard 选中态

```css
.mood-card[data-selected="true"] {
  border: 2px solid rgba(218, 190, 255, 0.92);
  box-shadow: var(--shadow-selected-card);
}
```

---

## 11.9 SelectionIndicator

### 选中态

```css
.selection-indicator {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  z-index: 3;
  display: grid;
  place-items: center;
}

.selection-indicator[data-selected="true"] {
  background: rgba(138, 85, 210, 0.92);
  color: #fff;
  border: 2px solid rgba(255,255,255,0.82);
}
```

### 未选中态

```css
.selection-indicator[data-selected="false"] {
  background: rgba(255,255,255,0.16);
  border: 2px solid rgba(255,255,255,0.86);
}
```

---

# 12. Primary CTA Button

## 12.1 基础规格

```text
高度：60px
圆角：999px
左右 padding：24px
宽度：100%
```

---

## 12.2 默认样式

```css
.primary-cta {
  margin-top: 22px;
  width: 100%;
  height: 60px;
  border: none;
  border-radius: 999px;
  background: var(--cta-gradient);
  box-shadow: var(--shadow-cta);
  color: #fff;
  font-family: var(--font-display);
  font-size: 21px;
  line-height: 26px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}
```

---

## 12.3 状态规范

### 默认态

```css
opacity: 1;
transform: none;
```

### Pressed

```css
transform: scale(0.98);
filter: brightness(0.97);
```

### Hover

```css
filter: brightness(1.04);
```

### Disabled

```css
background: linear-gradient(90deg, #D7D0DE 0%, #E7DFEA 100%);
opacity: 0.72;
cursor: not-allowed;
```

### Loading

```tsx
<button disabled>
  <Spinner />
  Creating your aura...
</button>
```

---

# 13. BottomTabBar

## 13.1 结构

```tsx
<BottomTabBar>
  <TabItem icon="home" label="Home" active />
  <Divider />
  <TabItem icon="user" label="Profile" />
</BottomTabBar>
```

---

## 13.2 样式

```css
.bottom-tab-bar {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: min(430px, 100%);
  height: 88px;
  padding: 10px 24px calc(10px + env(safe-area-inset-bottom));
  border-radius: 28px 28px 0 0;
  background: rgba(255,255,255,0.72);
  border-top: 1px solid rgba(255,255,255,0.62);
  backdrop-filter: blur(20px);
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  align-items: center;
}
```

---

## 13.3 TabItem

```css
.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}

.tab-item[data-active="true"] {
  color: var(--text-primary);
}

.tab-icon-active-bg {
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: rgba(143, 92, 205, 0.14);
  display: grid;
  place-items: center;
}
```

---

# 14. 交互规范

## 14.1 页面初始状态

```ts
selectedMood = 'confident'
selectedFilter = 'all'
```

---

## 14.2 点击 MoodCard

规则：

1. 点击任意卡片，切换 `selectedMood`
2. 原选中卡片取消
3. 新选中卡片展示 check badge
4. CTA 继续可点击
5. 不需要弹窗
6. 不需要立即跳转

---

## 14.3 点击 Filter Chip

MVP 规则：

1. 点击后切换 `selectedFilter`
2. 仅改变 chip 高亮
3. 暂不隐藏卡片

后续增强规则：

1. `All` 显示全部
2. `Calm` 优先展示 Calm 卡
3. `Romantic` 优先展示 Romantic 卡
4. `Lucky` 展示 Lucky 相关 mood 或推荐卡

---

## 14.4 点击 CTA

MVP 行为：

```ts
router.push(`/reveal?mood=${selectedMood}`)
```

建议流程：

```text
Home
  ↓
Reveal / 抽卡过渡页
  ↓
Aura Result / 今日气场结果页
```

如果暂时没有 Reveal 页，也可以直接进入结果页：

```ts
router.push(`/result?mood=${selectedMood}`)
```

---

# 15. 前端工程实现标准

## 15.1 推荐技术栈

```text
Next.js / React
TypeScript
Tailwind CSS 或 CSS Modules
lucide-react 图标
WebP 图片资源
```

---

## 15.2 推荐目录结构

```bash
src/
  app/
    page.tsx
    layout.tsx

  components/
    app/
      AppShell.tsx
      PageBackground.tsx
      BottomTabBar.tsx

    home/
      HomePage.tsx
      TopHeader.tsx
      ProfileAvatarButton.tsx
      BrandLogo.tsx
      GiftButton.tsx
      DateBadge.tsx
      HeroSection.tsx
      MoodFilterTabs.tsx
      MoodFilterChip.tsx
      MoodCardList.tsx
      MoodCard.tsx
      PrimaryCTAButton.tsx

  data/
    moodCards.ts

  styles/
    tokens.css
    globals.css

  assets/
    images/
      moods/
        confident.webp
        romantic.webp
        calm.webp
```

---

## 15.3 状态管理

本页不需要 Redux / Zustand。

使用本地 state 即可：

```tsx
const [selectedMood, setSelectedMood] = useState<MoodId>('confident')
const [selectedFilter, setSelectedFilter] = useState<FilterId>('all')
const [isGenerating, setIsGenerating] = useState(false)
```

---

## 15.4 图片资源要求

| 图片 | 用途 | 格式 | 建议尺寸 |
|---|---|---|---|
| `confident.webp` | Confident 卡右侧人物 | WebP | 600×360 |
| `romantic.webp` | Romantic 卡右侧玫瑰 | WebP | 600×360 |
| `calm.webp` | Calm 卡右侧石头莲花 | WebP | 600×360 |
| `avatar.webp` | 首页头像 | WebP | 160×160 |

压缩要求：

```text
单张图片建议 < 180KB
首页图片总大小建议 < 700KB
```

---

# 16. 可访问性与可用性标准

## 16.1 点击区域

所有可点击元素最小点击区域：

```text
44px × 44px
```

包括：

- 头像
- 礼物按钮
- Filter Chip
- MoodCard
- CTA
- Bottom Tab

---

## 16.2 文本可读性

- 主标题颜色与背景对比必须足够明显
- MoodCard 上白字必须保证在图片背景上清晰
- 如果图片干扰文字，需要在卡片左侧加暗色/浅色渐变遮罩

示例：

```css
.mood-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(82, 52, 120, 0.28), transparent 70%);
  z-index: 1;
}
```

---

## 16.3 Reduced Motion

如果后续加动画，需要支持：

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 17. 动效建议

MVP 阶段只做轻动效：

## 17.1 卡片点击

```css
transition: transform 160ms ease, box-shadow 160ms ease, border 160ms ease;
```

点击时：

```css
transform: scale(0.985);
```

---

## 17.2 CTA 点击

```css
transition: transform 140ms ease, filter 140ms ease;
```

---

## 17.3 页面进入

可以做轻微 fade in：

```css
animation: fadeUp 420ms ease both;
```

不建议做复杂粒子动画。

---

# 18. 验收标准

## 18.1 视觉验收

必须满足：

- 页面整体接近当前标准稿
- 浅奶油粉紫背景
- 顶部 Logo 居中
- 主标题为页面视觉焦点
- 三张大卡片层级清楚
- Confident 默认选中
- CTA 明显、柔和、有点击欲
- 底部导航极简
- 不出现重工具感 / 电商感 / 低端占卜感

---

## 18.2 交互验收

必须满足：

- MoodCard 可点击选择
- 选中态能正确切换
- Filter Chip 可点击切换
- CTA 可点击并进入下一页
- CTA loading 时不能重复点击
- Bottom Tab 可点击
- 移动端滚动自然

---

## 18.3 响应式验收

必须支持：

```text
360px 宽度
375px 宽度
390px 宽度
414px 宽度
430px 宽度
```

不得出现：

- 标题严重换行异常
- 卡片内容溢出
- CTA 被底部导航遮挡
- 底部导航错位
- 图片压缩变形

---

## 18.4 工程验收

必须满足：

- TypeScript 无类型错误
- 组件拆分清楚
- 样式 token 化
- 不大量硬编码颜色
- 不依赖大型动效库
- 图片资源已压缩
- Lighthouse 移动端性能不低于 80
- 首屏资源不过大

---

# 19. 开发优先级

## P0 必须完成

```text
1. 首页静态 UI
2. MoodCard 选择切换
3. Filter Chip 切换
4. CTA 跳转
5. BottomTab 基础导航
6. 移动端适配
```

---

## P1 可以后续做

```text
1. 真实日期
2. 头像上传
3. 礼物入口
4. 动态推荐 mood
5. Reveal 抽卡动画
6. 卡片微动效
```

---

## P2 暂不做

```text
1. 复杂粒子背景
2. 3D 翻牌
3. 长历史记录
4. 多主题皮肤
5. 复杂 AI 问答入口
```

---

# 20. Codex / 前端开发提示词

如果要交给 Codex 或前端 Agent，可使用以下任务说明：

```text
请基于 AuraCue 首页视觉设计与前端开发标准文档 v1.0，实现移动端 H5 首页。

要求：
1. 使用 React + TypeScript。
2. 首页最大宽度 430px，居中显示。
3. 使用 token.css 管理颜色、字体、圆角、阴影。
4. 首页组件必须拆分为 AppShell、TopHeader、BrandLogo、DateBadge、HeroSection、MoodFilterTabs、MoodCardList、MoodCard、PrimaryCTAButton、BottomTabBar。
5. 默认选中 Confident 卡。
6. 点击 MoodCard 可切换选中状态。
7. 点击 Filter Chip 可切换高亮。
8. 点击 Start My Aura Card 后进入 /reveal?mood=xxx 或 /result?mood=xxx。
9. 页面必须符合当前标准稿：浅奶油粉紫背景、顶部 AuraCue Logo、大标题 Start Your Aura Journey、三张大 mood card、紫粉桃渐变 CTA、极简底部导航。
10. 不要引入复杂动画库，不要使用 WebGL，不要做复杂粒子。
11. 保证移动端 360px 到 430px 宽度下正常显示。
12. 输出实现说明和测试步骤。
```

---

# 21. 最终判断

当前首页标准的核心不是“漂亮插画”，而是这套结构：

```text
Logo + 今日日期
        ↓
Start Your Aura Journey
        ↓
选择 mood
        ↓
三张大气场卡
        ↓
Start My Aura Card
```

这套结构同时满足：

- 用户理解成本低
- 仪式感足够
- 开发难度可控
- 后续能扩展结果页
- 适合商业化包装

因此，前端开发时应优先保证：

```text
结构稳定 > 视觉接近 > 交互可用 > 动效锦上添花
```
