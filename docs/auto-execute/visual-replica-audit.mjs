import { chromium } from "../../.omx/tmp-playwright/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(new URL("../..", import.meta.url).pathname.slice(1));
const outDir = path.join(root, "docs", "auto-execute", "screenshots", "visual-replica-batch");
const referenceDir = path.join(root, "docs", "UI", "小程序");
const baseUrl = process.env.AURACUE_BASE_URL || "http://127.0.0.1:3001";

const pages = [
  { id: "P0-01", ref: "P0-01-Home-首页今日守护星.png", route: "/home" },
  { id: "P0-02", ref: "P0-02-BirthAura-输入生日创建本命气场.png", route: "/onboarding/birth-aura" },
  { id: "P0-03", ref: "P0-03-BirthAuraReveal-本命气场揭示.png", route: "/onboarding/birth-aura/reveal" },
  { id: "P0-04", ref: "P0-04-CheckIn-今日状态与场景选择.png", route: "/today/check-in" },
  { id: "P0-05A", ref: "P0-05A-TarotPull-三张塔罗抽卡.png", route: "/today/draw" },
  {
    id: "P0-05B",
    ref: "P0-05B-Card Selected.png",
    route: "/today/draw",
    actions: [{ type: "click", selector: ".latest-tarot-1" }]
  },
  { id: "P0-06A", ref: "P0-06A.png", route: "/today/reading" },
  {
    id: "P0-06B",
    ref: "P0-06B.png",
    route: "/today/reading",
    actions: [{ type: "click", selector: ".latest-cta" }]
  },
  {
    id: "P0-06C",
    ref: "P0-06C.png",
    route: "/today/reading",
    actions: [
      { type: "click", selector: ".latest-cta" },
      { type: "click", selector: ".latest-cta" }
    ]
  },
  { id: "P0-07", ref: "P0-07-Result-今日风格神谕结果.png", route: "/result/demo-strength" },
  { id: "P0-08", ref: "P0-08-Activate-长按封印今日气场.png", route: "/activate/demo-strength" },
  {
    id: "P0-09",
    ref: "P0-09-Activated-气场已封印.png",
    route: "/activated/demo-strength"
  },
  { id: "P0-10", ref: "P0-10-Share.png", route: "/share/demo-strength" },
  { id: "P0-12", ref: "P0-12-My-我的气场首页.png", route: "/my" },
  { id: "P0-13", ref: "P0-13-MyBirthAura-本命气场资料.png", route: "/my/birth-aura" },
  { id: "P0-16", ref: "P0-16-Error-生成失败重试.png", route: "/error/network" }
];

const selectors = {
  phone: ".latest-phone",
  status: ".latest-status, .latest-phone__status",
  back: ".latest-back",
  logo: ".latest-logo",
  pill: ".latest-reading-pill, .latest-date-chip, .latest-home-date, .latest-picker-eyebrow",
  title: "h1",
  subtitle: ".latest-title p, .latest-home-hero p, .latest-picker-lead",
  tags: ".latest-reading-tags span, .latest-tags span, .latest-context-options button",
  card: ".latest-reading-card, .latest-result-card, .latest-activation-card, .latest-story-card, .latest-profile-card",
  panel: ".latest-reading-panel, .latest-result-panel, .latest-activate-panel, .latest-error-card",
  listRows: ".latest-reading-list article, .latest-profile-card, .latest-history-card",
  cta: ".latest-cta",
  outline: ".latest-outline",
  bottomNav: ".latest-bottom-nav",
  homeTab: ".latest-bottom-nav a:nth-child(1)",
  myTab: ".latest-bottom-nav a:nth-child(2)"
};

fs.mkdirSync(outDir, { recursive: true });

function runPython(args) {
  const result = spawnSync("python", args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`python ${args.join(" ")} failed`);
}

async function applyActions(page, actions = []) {
  for (const action of actions) {
    if (action.type === "click") {
      await page.locator(action.selector).click();
    }
    if (action.type === "text") {
      await page.getByText(action.text, { exact: true }).click();
    }
    await page.waitForTimeout(350);
  }
}

async function captureDom(page) {
  return page.evaluate((selectorMap) => {
    const boxFor = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: +r.x.toFixed(2),
        y: +r.y.toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        color: cs.color,
        backgroundColor: cs.backgroundColor
      };
    };
    const data = { href: location.href, viewport: { w: innerWidth, h: innerHeight }, elements: {} };
    for (const [name, selector] of Object.entries(selectorMap)) {
      const nodes = [...document.querySelectorAll(selector)];
      data.elements[name] = nodes.slice(0, 12).map((el, index) => ({
        name: `${name}_${index + 1}`,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120),
        ...boxFor(el)
      }));
    }
    return data;
  }, selectors);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 430, height: 800 }, deviceScaleFactor: 1 });

for (const item of pages) {
  await page.goto(`${baseUrl}${item.route}`, { waitUntil: "networkidle" });
  await applyActions(page, item.actions);
  await page.waitForTimeout(500);
  const actual = path.join(outDir, `${item.id}-actual.png`);
  const dom = path.join(outDir, `${item.id}-dom.json`);
  const refCopy = path.join(outDir, `${item.id}-reference.png`);
  fs.copyFileSync(path.join(referenceDir, item.ref), refCopy);
  await page.screenshot({ path: actual, fullPage: false });
  fs.writeFileSync(dom, JSON.stringify(await captureDom(page), null, 2));
  console.log(`${item.id} ${item.route} -> ${actual}`);
}

await browser.close();

runPython([path.join("docs", "auto-execute", "visual-replica-postprocess.py"), outDir]);
