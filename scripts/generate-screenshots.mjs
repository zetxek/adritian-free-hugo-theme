/**
 * Generate theme screenshots for the Hugo themes directory and README.
 *
 * Usage:
 *   node scripts/generate-screenshots.mjs [url]
 *
 * Defaults to https://www.adrianmoreno.info (production site with rich content).
 * For local dev: node scripts/generate-screenshots.mjs http://localhost:1313
 *
 * Generates:
 *   images/screenshot.png                    - 2708x1596 diagonal composite (light + dark)
 *   images/tn.png                            - 900x530 light mode thumbnail
 *   images/screenshot-light-fullscroll.jpeg  - full page light mode
 *   images/screenshot-dark-fullscroll.jpeg   - full page dark mode
 */

import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, '..', 'images');
const baseURL = process.argv[2] || 'https://www.adrianmoreno.info';

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

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    document.documentElement.setAttribute('data-bs-theme', t);
    localStorage.setItem('theme', t);
  }, theme);
  await page.waitForTimeout(500);
}

/**
 * Use a Playwright browser page to composite two images with a diagonal split.
 * Light on the left, dark on the right, matching the original screenshot style.
 */
async function createDiagonalComposite(browser, lightBuf, darkBuf, outputPath, width, height) {
  const lightB64 = lightBuf.toString('base64');
  const darkB64 = darkBuf.toString('base64');

  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  // Render a canvas in-browser that composites the two images
  await page.setContent(`
    <!DOCTYPE html>
    <html><body style="margin:0;padding:0;">
    <canvas id="c" width="${width}" height="${height}"></canvas>
    </body></html>
  `);

  await page.evaluate(async ({ lightB64, darkB64, width, height }) => {
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');

    function loadImg(b64) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = 'data:image/png;base64,' + b64;
      });
    }

    const [lightImg, darkImg] = await Promise.all([loadImg(lightB64), loadImg(darkB64)]);

    // Draw dark as base
    ctx.drawImage(darkImg, 0, 0, width, height);

    // Clip diagonal for light (left portion)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width * 0.78, 0);
    ctx.lineTo(width * 0.22, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(lightImg, 0, 0, width, height);
    ctx.restore();
  }, { lightB64, darkB64, width, height });

  // Screenshot the canvas (which is exactly width x height at scale 1)
  const canvasEl = page.locator('#c');
  const buffer = await canvasEl.screenshot({ type: 'png' });
  fs.writeFileSync(outputPath, buffer);

  await ctx.close();
}

async function main() {
  console.log(`Taking screenshots from: ${baseURL}`);

  const browser = await chromium.launch();
  const W = 1354, H = 798, SCALE = 2;
  const PX_W = W * SCALE, PX_H = H * SCALE;

  // --- Capture light mode above-the-fold ---
  console.log('1/5: Capturing light mode...');
  const ctx1 = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: SCALE,
  });
  const page1 = await ctx1.newPage();
  await page1.goto(baseURL, { waitUntil: 'networkidle' });
  await setTheme(page1, 'light');
  await waitForPageReady(page1);
  const lightBuf = await page1.screenshot({ type: 'png' });
  console.log('   -> light capture done');
  await ctx1.close();

  // --- Capture dark mode above-the-fold ---
  console.log('2/5: Capturing dark mode...');
  const ctx2 = await browser.newContext({
    viewport: { width: W, height: H },
    deviceScaleFactor: SCALE,
    colorScheme: 'dark',
  });
  const page2 = await ctx2.newPage();
  await page2.goto(baseURL, { waitUntil: 'networkidle' });
  await setTheme(page2, 'dark');
  await waitForPageReady(page2);
  const darkBuf = await page2.screenshot({ type: 'png' });
  console.log('   -> dark capture done');
  await ctx2.close();

  // --- Create diagonal composite for screenshot.png ---
  console.log('3/5: Creating diagonal composite screenshot.png...');
  await createDiagonalComposite(
    browser, lightBuf, darkBuf,
    path.join(imagesDir, 'screenshot.png'),
    PX_W, PX_H,
  );
  console.log(`   -> saved screenshot.png (${PX_W}x${PX_H})`);

  // --- tn.png (light, thumbnail, 900x530) ---
  console.log('4/5: tn.png (light, thumbnail)...');
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
    console.log(`5/5: ${fname} (${theme}, full page)...`);
    const ctx = await browser.newContext({
      viewport: { width: FSW, height: FSH },
      deviceScaleFactor: SCALE,
      colorScheme: theme,
    });
    const page = await ctx.newPage();
    await page.goto(baseURL, { waitUntil: 'networkidle' });
    await setTheme(page, theme);
    await waitForPageReady(page);
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
