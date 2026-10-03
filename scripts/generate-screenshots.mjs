/**
 * Generate theme screenshots for the Hugo themes directory and README.
 *
 * Usage:
 *   node scripts/generate-screenshots.mjs [url]
 *
 * Defaults to http://localhost:1414, the exampleSite (demo content) served with:
 *   hugo server --source exampleSite --themesDir ../.. --port 1414
 * A non-default port avoids capturing whatever else is listening on 1313.
 *
 * Generates:
 *   images/tn.png                            - 900x530 light mode thumbnail
 *   images/screenshot-light-fullscroll.jpeg  - full page light mode
 *   images/screenshot-dark-fullscroll.jpeg   - full page dark mode
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'images');
const baseURL = process.argv[2] || 'http://localhost:1414';

async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('img');
      let loaded = 0;
      if (images.length === 0) { resolve(); return; }
      images.forEach(img => {
        if (img.complete) { loaded++; if (loaded === images.length) resolve(); }
        else {
          img.addEventListener('load', () => { loaded++; if (loaded === images.length) resolve(); });
          img.addEventListener('error', () => { loaded++; if (loaded === images.length) resolve(); });
        }
      });
      setTimeout(resolve, 5000);
    });
  });
  await page.waitForTimeout(1000);
}

/**
 * Sections below the fold stay at opacity 0 until rad-animations.js sees them
 * intersect the viewport, and a fullPage screenshot never scrolls. Walk down the
 * page one viewport at a time so every section is revealed (and lazy images load),
 * then return to the top and let the entry animations finish.
 */
async function revealScrollContent(page) {
  await page.evaluate(async () => {
    const step = Math.max(window.innerHeight / 2, 200);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 150));
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  const hidden = await page.evaluate(
    () => document.querySelectorAll('.rad-waiting:not(.rad-animate)').length,
  );
  if (hidden > 0) {
    throw new Error(`${hidden} section(s) still hidden after scrolling; screenshot would miss content`);
  }
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-bs-theme', t);
    localStorage.setItem('theme', t);
  }, theme);
  await page.waitForTimeout(500);
}

async function main() {
  console.log(`Taking screenshots from: ${baseURL}`);

  const browser = await chromium.launch();
  const SCALE = 2;

  // --- tn.png (light, thumbnail, 900x530) ---
  console.log('1/2: tn.png (light, thumbnail)...');
  const ctx3 = await browser.newContext({
    viewport: { width: 900, height: 530 },
    deviceScaleFactor: 1,
  });
  const page3 = await ctx3.newPage();
  await page3.goto(baseURL, { waitUntil: 'networkidle' });
  await setTheme(page3, 'light');
  await waitForPageReady(page3);
  await page3.screenshot({
    path: path.join(imagesDir, 'tn.png'),
    type: 'png',
  });
  console.log('   -> saved tn.png (900x530)');
  await ctx3.close();

  // --- Full-scroll screenshots ---
  const FSW = 1336, FSH = 800;
  for (const theme of ['light', 'dark']) {
    const fname = `screenshot-${theme}-fullscroll.jpeg`;
    console.log(`2/2: ${fname} (${theme}, full page)...`);
    const ctx = await browser.newContext({
      viewport: { width: FSW, height: FSH },
      deviceScaleFactor: SCALE,
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await setTheme(page, theme);
    await waitForPageReady(page);
    await revealScrollContent(page);
    await page.screenshot({
      path: path.join(imagesDir, fname),
      type: 'jpeg',
      quality: 85,
      fullPage: true,
    });
    console.log(`   -> saved ${fname}`);
    await ctx.close();
  }

  await browser.close();
  console.log('\nAll screenshots generated in images/');
}

main().catch(err => {
  console.error('Screenshot generation failed:', err);
  process.exit(1);
});
