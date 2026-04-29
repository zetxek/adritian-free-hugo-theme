# Color Scheme Screenshots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate light+dark composite screenshots of the homepage hero across all 7 color schemes, embed them in the existing demo blog post, replace the theme preview hero with a 3-scheme triptych, and link the blog post from the README.

**Architecture:** A single Node script (`scripts/capture-color-schemes.js`) drives Playwright against the live Hugo example site, captures 14 raw PNGs (7 schemes × {light, dark}), then uses `sharp` to produce 7 light/dark composites for the blog post and 2 horizontal triptychs for the README + Hugo Themes preview. Image generation is reproducible; outputs are committed PNGs so contributors don't need `sharp` unless regenerating.

**Tech Stack:** Node.js, Playwright (already installed), sharp (new devDep), Hugo (example site server).

**Spec:** [`docs/superpowers/specs/2026-04-29-color-scheme-screenshots-design.md`](../specs/2026-04-29-color-scheme-screenshots-design.md)

---

## Conventions used throughout this plan

- All paths are relative to the repo root: `/Users/adrian/Projects/adritian-free-hugo-theme/`.
- The example site Hugo server runs on `http://localhost:1313` via `cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0 --port 1313`. The capture script will boot this itself if it's not already running.
- The 7 schemes are defined in `data/colorSchemes.yaml`: `default`, `ocean`, `forest`, `rose`, `slate`, `midnight`, `warm`.
- The script reads the scheme list from that YAML at runtime so it self-updates if a scheme is added/removed.
- "Triptych panels" are: **Ocean / Default / Warm** (cool → neutral → warm), in that left-to-right order.
- Raw output dir: `exampleSite/static/img/blog/raw/` (gitignored).
- Composite output dir: `exampleSite/static/img/blog/` (committed).
- Triptych output dir: `images/` (committed).

---

## Task 1: Add devDependencies, npm scripts, and gitignore entries

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Install `sharp` and `js-yaml` as devDependencies**

Run from repo root:

```bash
npm install --save-dev sharp js-yaml
```

Expected: both packages added to `devDependencies` in `package.json` and present in `node_modules/`.

- [ ] **Step 2: Add the `screenshots:colors` npm script**

Edit `package.json`. Add this line to the `scripts` object (after `test:e2e:debug`):

```json
"screenshots:colors": "node scripts/capture-color-schemes.js"
```

The full `scripts` block should now end with:

```json
    "test:e2e:debug": "playwright test --debug",
    "screenshots:colors": "node scripts/capture-color-schemes.js"
  },
```

- [ ] **Step 3: Add the raw screenshot dir to `.gitignore`**

Append to `.gitignore`:

```
# Color scheme capture raw outputs (composites are committed)
exampleSite/static/img/blog/raw/
```

- [ ] **Step 4: Verify**

Run:

```bash
node -e "require('sharp'); require('js-yaml'); console.log('OK')"
```

Expected: prints `OK` with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore: add sharp and js-yaml devDeps for color scheme capture script"
```

---

## Task 2: Write a unit test for the composite layout helpers

**Files:**
- Create: `tests/scripts/color-scheme-composites.test.js`

We TDD the *layout math* of the composite step (deterministic, easy to verify) and rely on visual inspection for the Playwright capture itself.

- [ ] **Step 1: Write the failing test**

Create `tests/scripts/color-scheme-composites.test.js`:

```javascript
const assert = require('node:assert');
const test = require('node:test');
const { computePairLayout, computeTriptychLayout } = require('../../scripts/lib/composite-layout.js');

test('computePairLayout joins two 1280x800 panels with a 16px gutter', () => {
  const layout = computePairLayout({ width: 1280, height: 800, gutter: 16 });
  assert.strictEqual(layout.totalWidth, 1280 + 16 + 1280);
  assert.strictEqual(layout.totalHeight, 800);
  assert.deepStrictEqual(layout.leftPosition, { left: 0, top: 0 });
  assert.deepStrictEqual(layout.rightPosition, { left: 1280 + 16, top: 0 });
});

test('computeTriptychLayout joins three panels with no gutter', () => {
  const layout = computeTriptychLayout({ panelWidth: 1280, panelHeight: 800 });
  assert.strictEqual(layout.totalWidth, 1280 * 3);
  assert.strictEqual(layout.totalHeight, 800);
  assert.deepStrictEqual(layout.positions, [
    { left: 0, top: 0 },
    { left: 1280, top: 0 },
    { left: 2560, top: 0 },
  ]);
});

test('computeTriptychLayout respects a downscale targetWidth', () => {
  const layout = computeTriptychLayout({ panelWidth: 1280, panelHeight: 800, targetWidth: 1500 });
  assert.strictEqual(layout.totalWidth, 1280 * 3);
  assert.strictEqual(layout.totalHeight, 800);
  assert.strictEqual(layout.targetWidth, 1500);
  assert.strictEqual(layout.targetHeight, Math.round(800 * (1500 / (1280 * 3))));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
node --test tests/scripts/color-scheme-composites.test.js
```

Expected: fails with `Cannot find module '../../scripts/lib/composite-layout.js'`.

- [ ] **Step 3: Implement the layout helpers**

Create `scripts/lib/composite-layout.js`:

```javascript
function computePairLayout({ width, height, gutter }) {
  return {
    totalWidth: width + gutter + width,
    totalHeight: height,
    leftPosition: { left: 0, top: 0 },
    rightPosition: { left: width + gutter, top: 0 },
  };
}

function computeTriptychLayout({ panelWidth, panelHeight, targetWidth }) {
  const totalWidth = panelWidth * 3;
  const totalHeight = panelHeight;
  const result = {
    totalWidth,
    totalHeight,
    positions: [
      { left: 0, top: 0 },
      { left: panelWidth, top: 0 },
      { left: panelWidth * 2, top: 0 },
    ],
  };
  if (typeof targetWidth === 'number') {
    result.targetWidth = targetWidth;
    result.targetHeight = Math.round(totalHeight * (targetWidth / totalWidth));
  }
  return result;
}

module.exports = { computePairLayout, computeTriptychLayout };
```

- [ ] **Step 4: Run the test to verify it passes**

Run:

```bash
node --test tests/scripts/color-scheme-composites.test.js
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/scripts/color-scheme-composites.test.js scripts/lib/composite-layout.js
git commit -m "feat(scripts): add composite layout helpers with unit tests"
```

---

## Task 3: Write the capture script — Playwright capture loop

**Files:**
- Create: `scripts/capture-color-schemes.js`
- Modify: `scripts/capture-color-schemes.js` (next tasks add to it)

This task only writes the Playwright loop (no compositing yet) and verifies all 14 raw PNGs are produced.

- [ ] **Step 1: Create the script with the capture loop**

Create `scripts/capture-color-schemes.js`:

```javascript
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
```

Make it executable (optional but consistent with `scripts/generate-favicon-ico.js`):

```bash
chmod +x scripts/capture-color-schemes.js
```

- [ ] **Step 2: Start the Hugo example site in another terminal (or background)**

Run from repo root:

```bash
cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --bind 0.0.0.0 --port 1313
```

Wait until you see `Web Server is available at http://localhost:1313/`.

- [ ] **Step 3: Run the capture script**

In a separate terminal, from repo root:

```bash
npm run screenshots:colors
```

Expected: prints 14 `✓` lines and "Done capturing raw screenshots." with no errors.

- [ ] **Step 4: Verify the 14 raw files exist with reasonable sizes**

Run:

```bash
ls -la exampleSite/static/img/blog/raw/
```

Expected: 14 PNGs, each between ~30 KB and ~300 KB. Visually open 2 or 3 (one light, one dark, and one of a vivid scheme like `rose` or `midnight`) and confirm:
  - The homepage hero is shown above the fold.
  - The accent color matches the scheme (e.g. teal for `default`, deep blue for `ocean-light`, salmon for `rose-dark`).
  - Dark variants have a dark background.

If the accent doesn't change between schemes, the live switcher CSS hasn't loaded — bump `waitForTimeout` to 800ms and re-run.

- [ ] **Step 5: Commit the script (raw outputs are gitignored)**

```bash
git add scripts/capture-color-schemes.js
git commit -m "feat(scripts): capture homepage hero per color scheme in light + dark"
```

---

## Task 4: Add the per-scheme light/dark composite step

**Files:**
- Modify: `scripts/capture-color-schemes.js`

- [ ] **Step 1: Add the composite function and call it after capture**

Edit `scripts/capture-color-schemes.js`. Add these requires at the top alongside the existing ones:

```javascript
const sharp = require('sharp');
const { computePairLayout } = require('./lib/composite-layout.js');
```

Add this constant alongside `RAW_DIR`:

```javascript
const PAIR_DIR = path.join(REPO_ROOT, 'exampleSite', 'static', 'img', 'blog');
const PAIR_GUTTER = 16;
```

Add this function below `captureAll()`:

```javascript
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
```

Update `main()` to call it:

```javascript
async function main() {
  const schemes = loadSchemeNames();
  await captureAll(schemes);
  await buildPairComposites(schemes);
  console.log('Done.');
}
```

And update `captureAll()` to accept the schemes argument so we don't load the YAML twice:

Replace the first two lines of `captureAll`:

```javascript
async function captureAll(schemes) {
  console.log(`Capturing ${schemes.length} schemes × 2 modes = ${schemes.length * 2} screenshots`);
```

(Remove the `const schemes = loadSchemeNames();` line inside `captureAll`.)

- [ ] **Step 2: Re-run the script**

```bash
npm run screenshots:colors
```

Expected: 14 `✓` capture lines, then 7 `✓` composite lines, then `Done.`.

- [ ] **Step 3: Verify the 7 composites**

Run:

```bash
ls -la exampleSite/static/img/blog/color-scheme-*.png
file exampleSite/static/img/blog/color-scheme-ocean.png
```

Expected: 7 PNGs, each ~2576 px wide × 800 px tall (the `file` command should show `2576 x 800`).

Open `color-scheme-ocean.png` and confirm: light variant on the left, dark variant on the right, 16px white gutter between them.

- [ ] **Step 4: Commit**

```bash
git add scripts/capture-color-schemes.js exampleSite/static/img/blog/color-scheme-*.png
git commit -m "feat(scripts): composite per-scheme light/dark side-by-side images"
```

---

## Task 5: Add the triptych composite step

**Files:**
- Modify: `scripts/capture-color-schemes.js`

- [ ] **Step 1: Add the triptych function**

Edit `scripts/capture-color-schemes.js`. Replace the existing require for `composite-layout.js` (added in Task 4) with the combined form:

```javascript
const { computePairLayout, computeTriptychLayout } = require('./lib/composite-layout.js');
```

Add these constants near the others (`RAW_DIR`, `PAIR_DIR`, etc.):

```javascript
const IMAGES_DIR = path.join(REPO_ROOT, 'images');
const TRIPTYCH_SCHEMES = ['ocean', 'default', 'warm'];
const TRIPTYCH_TARGET_WIDTH = 1500;
```

Add this function below `buildPairComposites`:

```javascript
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

    await sharp({
      create: {
        width: layout.totalWidth,
        height: layout.totalHeight,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    })
      .composite(inputs)
      .resize(layout.targetWidth, layout.targetHeight)
      .png({ compressionLevel: 9 })
      .toFile(outPath);

    console.log(`  ✓ ${path.relative(REPO_ROOT, outPath)} (${layout.targetWidth}×${layout.targetHeight})`);
  }
}
```

Update `main()` to call it:

```javascript
async function main() {
  const schemes = loadSchemeNames();
  await captureAll(schemes);
  await buildPairComposites(schemes);
  await buildTriptychs();
  console.log('Done.');
}
```

- [ ] **Step 2: Run the script**

```bash
npm run screenshots:colors
```

Expected: 14 capture + 7 composite + 2 triptych ✓ lines.

- [ ] **Step 3: Verify the triptychs**

```bash
ls -la images/screenshot.png images/screenshot-dark.png
file images/screenshot.png
```

Expected: both PNGs present, dimensions reported as `1500 x 312` (or close — 312 = round(800 × 1500 / 3840)).

Open `images/screenshot.png`. You should see three side-by-side hero panels in (left→right) Ocean, Default (teal), Warm. Open `images/screenshot-dark.png` and confirm the same three panels in dark mode.

- [ ] **Step 4: Sanity check legibility**

Look at the hero typography ("Hello, I'm …" or whatever the demo homepage shows) at 1500 wide. If text feels unreadably small:

  - Open one of the raw screenshots (e.g. `exampleSite/static/img/blog/raw/color-scheme-ocean-light.png`) and note where the hero text ends vertically.
  - If the text occupies the top half: change `VIEWPORT.height` to `600` in the script (capture only the upper portion), re-run.
  - Otherwise: bump `TRIPTYCH_TARGET_WIDTH` to `1800` for a slightly larger hero.

If the legibility is fine, skip this adjustment.

- [ ] **Step 5: Commit**

```bash
git add scripts/capture-color-schemes.js images/screenshot.png images/screenshot-dark.png
git commit -m "feat(scripts): build Ocean/Default/Warm triptych for theme preview"
```

---

## Task 6: Update the demo blog post

**Files:**
- Modify: `exampleSite/content/blog/color-schemes.md`

The post already references `/img/blog/color-scheme-<name>.png` (now composites). We only update alt text and add a one-paragraph intro.

- [ ] **Step 1: Add the side-by-side intro paragraph**

Edit `exampleSite/content/blog/color-schemes.md`. Find this block (around line 24):

```markdown
## The 7 built-in schemes

Each scheme defines two hex values: a primary color for **light mode** and a brighter variant for **dark mode** (to maintain readability on dark backgrounds).
```

Replace with:

```markdown
## The 7 built-in schemes

Each scheme defines two hex values: a primary color for **light mode** and a brighter variant for **dark mode** (to maintain readability on dark backgrounds).

For each scheme below, the screenshot shows the same homepage hero in light mode (left) and dark mode (right), so you can see exactly how the accent color reads against both backgrounds.
```

- [ ] **Step 2: Update the alt text on all 7 image references**

In the same file, replace each image alt text. Use the table below.

| Find (existing alt) | Replace with |
|---------------------|--------------|
| `Default color scheme — teal accent` | `Default color scheme — light mode (left) and dark mode (right)` |
| `Ocean color scheme — blue/teal accent` | `Ocean color scheme — light mode (left) and dark mode (right)` |
| `Forest color scheme — green accent` | `Forest color scheme — light mode (left) and dark mode (right)` |
| `Rose color scheme — pink/red accent` | `Rose color scheme — light mode (left) and dark mode (right)` |
| `Slate color scheme — grey/blue accent` | `Slate color scheme — light mode (left) and dark mode (right)` |
| `Midnight color scheme — purple accent` | `Midnight color scheme — light mode (left) and dark mode (right)` |
| `Warm color scheme — amber/orange accent` | `Warm color scheme — light mode (left) and dark mode (right)` |

- [ ] **Step 3: Sanity check the rendered post**

The Hugo server is still running. Open in a browser:

```
http://localhost:1313/blog/color-schemes/
```

Verify:
  - The intro paragraph appears under the "The 7 built-in schemes" heading.
  - All 7 images load (no broken image icons).
  - Each composite renders as a wide side-by-side image (light on the left, dark on the right).

If any image is broken, double-check that the file exists in `exampleSite/static/img/blog/` and Hugo has rebuilt (it auto-watches `static/`).

- [ ] **Step 4: Commit**

```bash
git add exampleSite/content/blog/color-schemes.md
git commit -m "docs(demo): update color schemes post for new side-by-side composites"
```

---

## Task 7: Update the README

**Files:**
- Modify: `README.md`

Two surgical edits.

- [ ] **Step 1: Replace the Live demo & Preview hero images with the triptychs**

Edit `README.md`. Find this block (around lines 44-59):

```markdown
You can see it live at [www.adrianmoreno.info](https://www.adrianmoreno.info) (my personal website), as well as in these screenshots of the homepage, in the dark and light variations of the theme:

<table>
	<tbody>
	<tr>
		<td>
			<img src="https://user-images.githubusercontent.com/240085/230632835-74349170-d610-4731-8fac-62c413e6b3f5.png" alt="Light version of the Hugo theme Adritian"/>
</td>
		<td>
			<img src="https://raw.githubusercontent.com/zetxek/hugo-theme/main/images/screenshot-dark-fullscroll.jpeg" alt="Dark version of the Hugo theme Adritian"/>
</td>
	</tr>
	</tbody>
</table>

The dark color variation is selected automatically based on browser settings, and a color switcher is available in the footer and the mobile menu for visitors to override.
```

(The exact dark-image URL in the existing README may differ — match on the `<table>` block, not on that specific URL.)

Replace the `<table>` and the surrounding paragraph with:

```markdown
You can see it live at [www.adrianmoreno.info](https://www.adrianmoreno.info) (my personal website), as well as in these screenshots of the homepage, shown across three of the theme's seven built-in color schemes (Ocean, Default, Warm) in both light and dark modes:

<table>
	<tbody>
	<tr>
		<td>
			<img src="https://raw.githubusercontent.com/zetxek/adritian-free-hugo-theme/main/images/screenshot.png" alt="Adritian theme homepage in three color schemes (Ocean, Default, Warm) — light mode"/>
		</td>
	</tr>
	<tr>
		<td>
			<img src="https://raw.githubusercontent.com/zetxek/adritian-free-hugo-theme/main/images/screenshot-dark.png" alt="Adritian theme homepage in three color schemes (Ocean, Default, Warm) — dark mode"/>
		</td>
	</tr>
	</tbody>
</table>

The dark color variation is selected automatically based on browser settings, and a color switcher is available in the footer and the mobile menu for visitors to override. The theme ships with **7 built-in color schemes** — see them all in the [color schemes blog post](https://adritian-demo.vercel.app/blog/color-schemes/).
```

- [ ] **Step 2: Add the blog post link inside the `#### Color schemes` section**

In the same file, find this block (around lines 226-230):

```markdown
| `warm` | `#c17817` | `#e8a94f` | Ambers and oranges |

Colors are applied at build time to every component (links, buttons, tags, progress bars, focus rings, etc.) in both light and dark modes. No JavaScript is required.
```

Replace with:

```markdown
| `warm` | `#c17817` | `#e8a94f` | Ambers and oranges |

👉 **See all 7 schemes side-by-side (light + dark), with code samples and a live switcher demo, in the [Color schemes blog post](https://adritian-demo.vercel.app/blog/color-schemes/).**

Colors are applied at build time to every component (links, buttons, tags, progress bars, focus rings, etc.) in both light and dark modes. No JavaScript is required.
```

- [ ] **Step 3: Visual check the README on GitHub markdown preview**

Either push to a draft branch and view on GitHub, or open `README.md` in the IDE's markdown preview. Verify:
  - The Live demo & Preview section shows two stacked triptychs (light then dark).
  - The Color schemes section shows the new "👉 See all 7 schemes" callout right under the table.
  - No raw HTML or broken markdown.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs(readme): showcase 3-scheme triptych and link color schemes blog post"
```

---

## Task 8: End-to-end sanity check

**Files:** None modified.

- [ ] **Step 1: Stop and restart the Hugo server**

In the terminal running Hugo, Ctrl+C, then re-run:

```bash
cd exampleSite && hugo server --themesDir ../.. --buildDrafts --buildFuture --port 1313
```

- [ ] **Step 2: Walk through the user-facing surfaces**

Verify each of the following loads with no broken images:

  - `http://localhost:1313/` — homepage, default scheme
  - `http://localhost:1313/blog/` — blog list shows the color schemes post (with `featured_image` rendering as a side-by-side composite)
  - `http://localhost:1313/blog/color-schemes/` — the post itself: intro paragraph present, 7 composites render, code samples intact, live switcher selector renders at the top

- [ ] **Step 3: Try a few schemes in the live switcher**

On the blog post page, click the scheme selector embedded by the `{{< color-scheme-selector >}}` shortcode. Pick `rose`, then `midnight`, then back to `default`. Verify the page accent color updates instantly (this validates the live switcher still works — unchanged by this PR, but worth confirming).

- [ ] **Step 4: Run the existing color-scheme E2E tests**

To make sure none of the test selectors regressed (none should — we didn't touch layouts):

```bash
npm run test:e2e -- color-scheme
```

Expected: all color-scheme tests pass.

If any fail, read the failure carefully — most likely cause would be a navbar overflow change from one of the prior commits, not this work. Fix only if directly related.

- [ ] **Step 5: No commit needed; this is verification only.**

---

## Self-review checklist

Run these once before declaring the plan complete.

- [ ] **Spec coverage**: Each spec section has a task.
  - Capture pipeline → Tasks 3, 4, 5
  - Files created/modified → Tasks 1–7
  - Blog post update → Task 6
  - README update → Task 7
  - Theme preview strategy → Tasks 5 (triptych) + 7 (README placement) + 6 (blog post)
  - Build sequence → Tasks 1 → 8 mirror it
- [ ] **Placeholder scan**: no "TBD", no "appropriate error handling", no "similar to Task N", no missing code blocks. ✅
- [ ] **Type/name consistency**: `computePairLayout`, `computeTriptychLayout`, `captureAll`, `buildPairComposites`, `buildTriptychs`, `loadSchemeNames` — all names match across tasks. `RAW_DIR`, `PAIR_DIR`, `IMAGES_DIR`, `VIEWPORT`, `TRIPTYCH_SCHEMES` consistent. ✅
- [ ] **Final state**: `screenshot.png` is the new triptych; `screenshot-dark.png` is new; 7 composites overwrite the existing per-scheme blog images; capture script is reproducible via `npm run screenshots:colors`.

---

## Out of scope (per spec)

- Updating `adrianmoreno.info` external user-image URLs.
- Replacing `images/tn.png`.
- Updating `images/blog-default.jpeg` / `blog-sidebar.jpeg`.
- Animated GIF/WebP previews.
- Restructuring the blog post layout.
