#!/usr/bin/env node
/**
 * Capture homepage screenshots for every color scheme in light + dark mode,
 * then composite them into per-scheme pairs and a hero triptych.
 *
 * Usage: npm run screenshots:colors
 *
 * Requires the Hugo example site to be reachable at http://localhost:1313.
 * Start it with: cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --port 1313
 */
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { chromium } = require('playwright');
const sharp = require('sharp');
const { computePairLayout, computeTriptychLayout } = require('./lib/composite-layout.js');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMES_YAML = path.join(REPO_ROOT, 'data', 'colorSchemes.yaml');
const RAW_DIR = path.join(REPO_ROOT, 'exampleSite', 'static', 'img', 'blog', 'raw');
const PAIR_DIR = path.join(REPO_ROOT, 'exampleSite', 'static', 'img', 'blog');
const PAIR_GUTTER = 16;
const IMAGES_DIR = path.join(REPO_ROOT, 'images');
const TRIPTYCH_SCHEMES = ['ocean', 'default', 'warm'];
const TRIPTYCH_TARGET_WIDTH = 1500;
const SITE_URL = process.env.CAPTURE_SITE_URL || 'http://localhost:1313/';
const VIEWPORT = { width: 1280, height: 800 };

function loadSchemeNames() {
  const data = yaml.load(fs.readFileSync(SCHEMES_YAML, 'utf8'));
  return Object.keys(data);
}

function ensureDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

async function captureAll(schemes) {
  console.log(`Capturing ${schemes.length} schemes × 2 modes = ${schemes.length * 2} screenshots`);
  ensureDir(RAW_DIR);

  const browser = await chromium.launch();
  try {
    for (const scheme of schemes) {
      for (const mode of ['light', 'dark']) {
        const context = await browser.newContext({
          viewport: VIEWPORT,
          reducedMotion: 'reduce',
          colorScheme: mode,
        });
        const page = await context.newPage();
        // Pre-seed scheme + mode before the page renders any switcher state
        await page.addInitScript(({ s, m }) => {
          try { localStorage.setItem('colorScheme', s); } catch (_) {}
          try { localStorage.setItem('theme', m); } catch (_) {}
        }, { s: scheme, m: mode });

        await page.goto(SITE_URL, { waitUntil: 'networkidle' });

        // Force the data-bs-theme attribute (theme switcher reads this).
        await page.evaluate((m) => {
          document.documentElement.setAttribute('data-bs-theme', m);
        }, mode);

        // Give the per-scheme override CSS (loaded by the live switcher) a moment to apply.
        await page.waitForTimeout(400);

        const out = path.join(RAW_DIR, `color-scheme-${scheme}-${mode}.png`);
        await page.screenshot({ path: out, fullPage: false });
        console.log(`  ✓ ${path.relative(REPO_ROOT, out)}`);

        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

async function buildPairComposites(schemes) {
  console.log(`Building ${schemes.length} light/dark composites`);
  const layout = computePairLayout({
    width: VIEWPORT.width,
    height: VIEWPORT.height,
    gutter: PAIR_GUTTER,
  });

  for (const scheme of schemes) {
    const lightPath = path.join(RAW_DIR, `color-scheme-${scheme}-light.png`);
    const darkPath = path.join(RAW_DIR, `color-scheme-${scheme}-dark.png`);
    const outPath = path.join(PAIR_DIR, `color-scheme-${scheme}.png`);

    await sharp({
      create: {
        width: layout.totalWidth,
        height: layout.totalHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite([
        { input: lightPath, ...layout.leftPosition },
        { input: darkPath, ...layout.rightPosition },
      ])
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`  ✓ ${path.relative(REPO_ROOT, outPath)}`);
  }
}

async function buildTriptychs() {
  console.log(`Building light + dark triptychs (${TRIPTYCH_SCHEMES.join(' / ')})`);
  const layout = computeTriptychLayout({
    panelWidth: VIEWPORT.width,
    panelHeight: VIEWPORT.height,
    targetWidth: TRIPTYCH_TARGET_WIDTH,
  });

  for (const mode of ['light', 'dark']) {
    const inputs = TRIPTYCH_SCHEMES.map((scheme, i) => ({
      input: path.join(RAW_DIR, `color-scheme-${scheme}-${mode}.png`),
      ...layout.positions[i],
    }));

    const outName = mode === 'light' ? 'screenshot.png' : 'screenshot-dark.png';
    const outPath = path.join(IMAGES_DIR, outName);

    // Two-step: composite full-resolution canvas first, then resize.
    // sharp applies .resize() before .composite() when chained on a create canvas,
    // which causes "Image to composite must have same dimensions or smaller".
    const composed = await sharp({
      create: {
        width: layout.totalWidth,
        height: layout.totalHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite(inputs)
      .png()
      .toBuffer();

    await sharp(composed)
      .resize(layout.targetWidth, layout.targetHeight)
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`  ✓ ${path.relative(REPO_ROOT, outPath)} (${layout.targetWidth}×${layout.targetHeight})`);
  }
}

async function main() {
  const schemes = loadSchemeNames();
  await captureAll(schemes);
  await buildPairComposites(schemes);
  await buildTriptychs();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
