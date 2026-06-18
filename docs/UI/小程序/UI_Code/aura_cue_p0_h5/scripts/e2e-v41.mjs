import fs from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const baseUrl = process.env.AURACUE_E2E_URL ?? 'http://127.0.0.1:5179/';
const chromePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const artifactDir = path.resolve(process.cwd(), '../../../../../.omx/artifacts/visual-ralph/p0-h5/v41-e2e-latest');
const log = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await fs.rm(artifactDir, { recursive: true, force: true });
await fs.mkdir(artifactDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  defaultViewport: { width: 941, height: 1672 },
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});

try {
  const page = await browser.newPage();

  const record = async (name) => {
    const hash = await page.evaluate(() => window.location.hash);
    const title = await page.$eval('h1', (node) => node.textContent?.replace(/\s+/g, ' ').trim() ?? '').catch(() => '');
    const file = `${String(log.length + 1).padStart(2, '0')}-${name}.png`;
    await page.screenshot({ path: path.join(artifactDir, file), fullPage: true });
    log.push({ step: name, hash, title, screenshot: file });
  };

  const waitForHash = async (expected) => {
    await page.waitForFunction((hash) => window.location.hash === hash, { timeout: 5000 }, expected);
  };

  const clickText = async (text) => {
    await page.evaluate((wanted) => {
      const candidates = [...document.querySelectorAll('button, a')];
      const target = candidates.find((node) => (node.textContent ?? '').replace(/\s+/g, ' ').trim().includes(wanted));
      if (!target) throw new Error(`Missing clickable text: ${wanted}`);
      target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
    }, text);
  };

  await page.goto(baseUrl, { waitUntil: 'networkidle0' });
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${baseUrl}#/result/today`, { waitUntil: 'networkidle0' });
  await waitForHash('#/onboarding/birth-aura');
  await record('guard-result-to-onboarding');

  await page.evaluate(() => localStorage.clear());
  await page.goto(`${baseUrl}#/`, { waitUntil: 'networkidle0' });
  await waitForHash('#/home');
  await record('home-first-launch');

  await clickText('Start My First Aura');
  await waitForHash('#/onboarding/birth-aura');
  await record('birth-aura-create');

  await clickText('Reveal My Birth Aura');
  await waitForHash('#/onboarding/birth-aura/reveal');
  await record('birth-aura-reveal');

  await clickText("Begin Today's Ritual");
  await waitForHash('#/today/check-in');
  await record('today-check-in');

  await clickText('Continue to Your Card');
  await waitForHash('#/today/draw');
  await record('today-draw');

  await page.click('.tarot-2');
  await waitForHash('#/today/reading');
  await record('today-reading');

  await waitForHash('#/result/today');
  await record('result');

  await clickText("Seal Today's Aura");
  await waitForHash('#/activate/today');
  await record('activate');

  await clickText('Hold to Seal');
  await delay(350);
  if ((await page.evaluate(() => window.location.hash)) !== '#/activate/today') {
    throw new Error('Short tap should not seal the aura');
  }

  const holdButton = await page.$('.hold-seal button');
  const box = await holdButton.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await delay(2200);
  await page.mouse.up();
  await waitForHash('#/activated/today');
  await record('activated-after-hold');

  await clickText('Share Story');
  await waitForHash('#/share/today');
  await record('share');

  await clickText('Copy Link');
  await page.waitForFunction(() => document.body.textContent.includes('Link Copied'), { timeout: 3000 });
  await record('share-copy-link');

  await clickText('Download Image');
  await waitForHash('#/saved/today');
  await record('saved');

  await clickText('View in My');
  await waitForHash('#/my');
  await record('my');

  await clickText('Privacy');
  await waitForHash('#/legal/privacy');
  await record('privacy');

  await page.goto(`${baseUrl}#/my`, { waitUntil: 'networkidle0' });
  await clickText('Terms');
  await waitForHash('#/legal/terms');
  await record('terms');

  await fs.writeFile(path.join(artifactDir, 'click-log.json'), JSON.stringify(log, null, 2));
  const cells = await Promise.all(log.map(async (item, index) => {
    const bytes = await fs.readFile(path.join(artifactDir, item.screenshot));
    const src = `data:image/png;base64,${bytes.toString('base64')}`;
    return `
      <figure>
        <img src="${src}">
        <figcaption>${index + 1}. ${item.step}<small>${item.hash} - ${item.title}</small></figcaption>
      </figure>
    `;
  }));
  const sheetHtml = `
    <style>
      body { margin: 0; padding: 24px; background: #f7eee8; font-family: Arial, sans-serif; }
      .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
      figure { margin: 0; padding: 10px; background: white; border: 1px solid #ead4c6; border-radius: 10px; }
      img { width: 100%; display: block; border-radius: 6px; }
      figcaption { min-height: 44px; margin-top: 8px; color: #25315c; font-size: 18px; line-height: 1.2; }
      small { display: block; color: #7f6f83; font-size: 14px; }
    </style>
    <div class="grid">
      ${cells.join('')}
    </div>
  `;
  await page.setViewport({ width: 1700, height: 2400 });
  await page.setContent(sheetHtml, { waitUntil: 'domcontentloaded', timeout: 5000 });
  await delay(1000);
  await page.screenshot({ path: path.join(artifactDir, 'contact-sheet.png'), fullPage: true });
  console.log(JSON.stringify({ ok: true, baseUrl, artifactDir, steps: log.length }, null, 2));
} finally {
  await browser.close();
}
