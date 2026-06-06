export const designViewport = {
  width: 941,
  height: 1672,
  aspectRatio: "941:1672",
  miniProgramEquivalentWidth: 390,
  sourceDirectory: "docs/UI/小程序"
} as const;

export const colorTokens = {
  ink: {
    navy900: "#101B37",
    navy850: "#121A3B",
    navy800: "#1A2342",
    navy760: "#1A2B48",
    slate700: "#1F2937",
    muted600: "#6B7280",
    warmMuted: "#8C7C6D"
  },
  surface: {
    cream050: "#FFFDFB",
    cream075: "#FDFBF7",
    cream100: "#FDF9F3",
    cream150: "#FCF9F6",
    cream200: "#F8F1E9",
    rose050: "#FFF5F4",
    rose100: "#FFF0F5",
    rose150: "#FDECF0",
    rose200: "#FFDCE3",
    lilac100: "#F5E6FF"
  },
  accent: {
    gold500: "#D4AF37",
    gold450: "#C8A375",
    gold400: "#C5A070",
    gold350: "#E2BF94",
    bronze500: "#A67C4B",
    coral500: "#DB8A86",
    coral600: "#C56E69",
    pink500: "#FF6B9E",
    pink550: "#FF4D79",
    pink450: "#FF8E9C",
    purple500: "#8B7BD9"
  },
  semantic: {
    successWeChat: "#07C160",
    channelXiaohongshu: "#FF2442",
    errorRose: "#E11D48",
    disabledText: "#64748B"
  }
} as const;

export const typographyTokens = {
  fontFamily: {
    sans: ["Inter", "Plus Jakarta Sans", "Poppins", "system-ui", "sans-serif"],
    serif: ["Playfair Display", "Georgia", "serif"]
  },
  scalePx: {
    eyebrow: 12,
    caption: 14,
    body: 16,
    bodyLarge: 18,
    sectionTitle: 22,
    screenTitle: 32,
    heroTitle: 44,
    price: 48
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.12,
    title: 1.2,
    body: 1.5
  }
} as const;

export const spacingTokens = {
  px: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
    screenX: 24,
    screenTop: 56,
    fixedFooterBottom: 24
  },
  layout: {
    maxPhoneWidth: 390,
    referenceSafeX: 56,
    referenceSafeTop: 96,
    bottomActionHeight: 96,
    stackedControlGap: 12,
    cardGridGap: 16
  }
} as const;

export const radiusTokens = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 999,
  sceneCardTop: 40,
  deviceFrame: 40
} as const;

export const shadowTokens = {
  softCard: "0 8px 32px rgba(0, 0, 0, 0.05)",
  raisedCard: "0 16px 40px rgba(0, 0, 0, 0.10)",
  goldGlow: "0 0 15px rgba(229, 194, 132, 0.40)",
  pinkGlow: "0 8px 16px -4px rgba(255, 77, 121, 0.40)",
  storyCard: "0 10px 30px rgba(0, 0, 0, 0.15)",
  sheet: "0 -10px 40px rgba(0, 0, 0, 0.05)"
} as const;

export const borderTokens = {
  hairlineCream: "1px solid #EAE3D5",
  goldThin: "1px solid rgba(212, 175, 55, 0.30)",
  goldStrong: "2px solid #E5C384",
  roseThin: "1px solid rgba(255, 77, 121, 0.20)",
  whiteGlass: "1px solid rgba(255, 255, 255, 0.50)",
  cardFrame: "4px solid #1A2342"
} as const;

export const zDepthTokens = {
  backgroundAura: 0,
  content: 10,
  floatingOrnament: 20,
  fixedAction: 80,
  modalSheet: 100,
  toast: 120
} as const;

export const cardProportionTokens = {
  auraCard: {
    width: 240,
    height: 380,
    ratio: "12:19"
  },
  storyCard: {
    width: 318,
    height: 565,
    ratio: "9:16"
  },
  sceneImage: {
    width: "100%",
    height: 128,
    topRadius: 40,
    bottomRadius: 12
  },
  miniPreview: {
    width: 96,
    height: 152,
    ratio: "12:19"
  }
} as const;

export const backgroundTreatments = {
  warmAura: "radial-gradient(circle at top, #FFF9F3 0%, #F8F1E9 100%)",
  energyAura: "radial-gradient(circle at 50% 20%, #FFFDFB 0%, #F5F1EB 100%)",
  ritualGlow: "radial-gradient(circle at 50% 50%, #FFF5ED 0%, #FDF9F3 100%)",
  inviteWarm: "linear-gradient(180deg, #FFF6F0 0%, #FFF0E8 100%)",
  paymentAura: "radial-gradient(circle at 50% 30%, #FFE5E5 0%, #FFF0F5 50%, #F5E6FF 100%)",
  successAura: "linear-gradient(180deg, #FFF0EE 0%, #FFE6ED 50%, #FFD6E3 100%)",
  storyAura: "linear-gradient(180deg, #FDF0F3 0%, #F8D0E3 40%, #F5B0C9 100%)",
  networkErrorAura: "linear-gradient(180deg, #FDECF0 0%, #FFF4E3 40%, #FDECF0 70%, #F5D3DE 100%)"
} as const;

export const ctaTokens = {
  primaryGold: {
    background: "linear-gradient(90deg, #D6A875 0%, #B78A5B 100%)",
    textColor: "#FFFFFF",
    radius: radiusTokens.pill,
    shadow: shadowTokens.goldGlow,
    minHeight: 56
  },
  primaryCoral: {
    background: "linear-gradient(to right, #DB8A86, #C56E69)",
    textColor: "#FFFFFF",
    radius: radiusTokens.pill,
    shadow: "0 10px 30px -10px rgba(197, 132, 130, 0.15)",
    minHeight: 56
  },
  primaryPink: {
    background: "linear-gradient(90deg, #FF6B9E 0%, #FF4583 100%)",
    textColor: "#FFFFFF",
    radius: radiusTokens.pill,
    shadow: shadowTokens.pinkGlow,
    minHeight: 56
  },
  secondaryOutline: {
    background: "rgba(255, 255, 255, 0.50)",
    textColor: colorTokens.accent.pink550,
    border: borderTokens.roseThin,
    radius: radiusTokens.pill,
    minHeight: 48
  },
  disabled: {
    background: "#E5E7EB",
    textColor: "#9CA3AF",
    border: "1px solid #E5E7EB",
    radius: radiusTokens.pill,
    minHeight: 56
  }
} as const;

export const visualMotifs = {
  ornaments: ["sparkle", "starburst", "soft cloud", "aura glow", "tarot frame"],
  icons: ["back arrow", "check", "heart", "moon", "eye", "share", "save", "retry", "channel"],
  textures: ["cream paper", "glass panel", "blurred locked content", "watermark overlay"],
  requiredAssetStrategy: "Prefer CSS/vector motifs first; create raster assets only when later page tasks cannot reproduce PNG motifs with shared primitives."
} as const;

export const uiReferenceInventory = [
  {
    id: "UI-01",
    stitchId: "01",
    route: "/",
    sourceImage: "01-进入_首页生成入口.png",
    tokenNotes: ["warm cream page", "premium hero card", "coral primary CTA", "gold sparkle accent"],
    requiredMotifs: ["hero aura card", "scenario shortcuts", "brand sparkle"]
  },
  {
    id: "UI-02",
    stitchId: "02",
    route: "/create/scene",
    sourceImage: "02-选择_出门场景.png",
    tokenNotes: ["radial warm background", "scene image cards", "gold selected border", "fixed footer CTA"],
    requiredMotifs: ["scene illustrations", "selected check", "back affordance"]
  },
  {
    id: "UI-03",
    stitchId: "03",
    route: "/create/energy",
    sourceImage: "03-选择_今日能量.png",
    tokenNotes: ["energy chips", "gold gradient CTA", "navy text", "small icon badges"],
    requiredMotifs: ["confidence", "luck", "love", "calm", "charm", "focus"]
  },
  {
    id: "UI-04",
    stitchId: "03a",
    route: "/create/energy",
    sourceImage: "03A-选择_场景与能量未完成状态.png",
    tokenNotes: ["disabled CTA", "validation hint", "incomplete selection state"],
    requiredMotifs: ["disabled action", "missing-selection hint"]
  },
  {
    id: "UI-05",
    stitchId: "04",
    route: "/create/loading",
    sourceImage: "04-生成_抽卡仪式.png",
    tokenNotes: ["ritual glow", "tarot draw focus", "soft orbit ornaments"],
    requiredMotifs: ["ritual card", "orbit sparkle", "deterministic animation fallback"]
  },
  {
    id: "UI-06",
    stitchId: "05",
    route: "/result/:id",
    sourceImage: "05-结果_免费预览待解锁.png",
    tokenNotes: ["locked preview", "blurred full sections", "watermarked card", "unlock CTA"],
    requiredMotifs: ["blur overlay", "lock marker", "free preview card"]
  },
  {
    id: "UI-07",
    stitchId: "06",
    route: "/unlock/:id",
    sourceImage: "06-解锁_付费与邀请入口.png",
    tokenNotes: ["paywall glass panels", "gold value icons", "choice cards"],
    requiredMotifs: ["payment choice", "invite choice", "benefit icons"]
  },
  {
    id: "UI-08",
    stitchId: "07a_3",
    route: "/invite/:id",
    sourceImage: "07A-邀请解锁_邀请3人入口.png",
    tokenNotes: ["warm invite background", "pink reward CTA", "progress affordance"],
    requiredMotifs: ["invite counter", "friend avatars", "reward badge"]
  },
  {
    id: "UI-09",
    stitchId: "07b",
    route: "/invite/:id/progress",
    sourceImage: "07B-邀请解锁_邀请进度.png",
    tokenNotes: ["progress state", "pink gradient action", "copy/share controls"],
    requiredMotifs: ["progress nodes", "copy icon", "explainer affordance"]
  },
  {
    id: "UI-10",
    stitchId: "07c",
    route: "/invite/landing/:code",
    sourceImage: "07C-邀请解锁_好友承接页.png",
    tokenNotes: ["friend landing frame", "purple-pink card", "gold avatar ring"],
    requiredMotifs: ["avatar", "invite card", "friend CTA"]
  },
  {
    id: "UI-11",
    stitchId: "08a",
    route: "/unlock/:id/pay",
    sourceImage: "08A-支付解锁_确认支付.png",
    tokenNotes: ["payment aura", "price scale", "pink unlock CTA", "white glass list"],
    requiredMotifs: ["price block", "mock payment checklist", "confirm CTA"]
  },
  {
    id: "UI-12",
    stitchId: "08b",
    route: "/unlock/:id/pay-failed",
    sourceImage: "08B-支付解锁_失败与恢复购买.png",
    tokenNotes: ["recoverable error rose", "action stack", "support affordance"],
    requiredMotifs: ["error badge", "retry", "restore", "support"]
  },
  {
    id: "UI-13",
    stitchId: "08c",
    route: "/unlock/:id/success",
    sourceImage: "08C-支付解锁_成功状态.png",
    tokenNotes: ["success celebration", "gold check", "pink primary CTA", "unlocked preview"],
    requiredMotifs: ["success badge", "confetti sparkle", "unlocked card"]
  },
  {
    id: "UI-14",
    stitchId: "09",
    route: "/result/:id/full",
    sourceImage: "09-结果_完整气场卡与分享入口.png",
    tokenNotes: ["full result report", "navy tarot card", "gold section dividers", "save/share controls"],
    requiredMotifs: ["full aura card", "color swatches", "report section icons"]
  },
  {
    id: "UI-15",
    stitchId: "10a_story",
    route: "/share/:id",
    sourceImage: "10A-分享_Story卡预览与保存.png",
    tokenNotes: ["9:16 story card", "purple-pink gradient", "gold frame", "save/share controls"],
    requiredMotifs: ["story preview", "gold card frame", "swatches"]
  },
  {
    id: "UI-16",
    stitchId: "10b",
    route: "/share/:id/channels",
    sourceImage: "10B-分享_渠道选择.png",
    tokenNotes: ["bottom sheet", "channel icons", "cream overlay", "cancel action"],
    requiredMotifs: ["WeChat channel", "moments channel", "copy link", "cancel"]
  },
  {
    id: "UI-17",
    stitchId: "10c",
    route: "/saved/:id",
    sourceImage: "10C-保存_保存成功反馈.png",
    tokenNotes: ["save confirmation", "gold check glow", "mini card preview", "share/home actions"],
    requiredMotifs: ["saved check", "mini preview", "share now", "back home"]
  },
  {
    id: "UI-18",
    stitchId: "11",
    route: "/error/network",
    sourceImage: "11-异常_生成失败网络异常.png",
    tokenNotes: ["network recovery gradient", "soft cloud error", "retry CTA", "change scene secondary"],
    requiredMotifs: ["cloud error", "retry", "change scene", "safe copy"]
  }
] as const;

export const tokenCoverage = {
  color: true,
  typography: true,
  spacing: true,
  radius: true,
  shadow: true,
  border: true,
  zDepth: true,
  cardProportions: true,
  backgroundTreatments: true,
  ctaStyles: true,
  perUiAssetInventory: uiReferenceInventory.length
} as const;
