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

const REPO_ROOT = path.resolve(__dirname, '..');
const SCHEMES_YAML = path.join(REPO_ROOT, 'data', 'colorSchemes.yaml');
const RAW_DIR = path.join(REPO_ROOT, 'exampleSite', 'static', 'img', 'blog', 'raw');
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

async function captureAll() {
  const schemes = loadSchemeNames();
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

async function main() {
  await captureAll();
  console.log('Done capturing raw screenshots.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
