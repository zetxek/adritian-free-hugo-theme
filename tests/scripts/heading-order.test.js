#!/usr/bin/env node
'use strict';

/**
 * Regression test: no page of the built exampleSite may skip a heading level.
 *
 * Lighthouse's `heading-order` audit fails when a heading is more than one
 * level deeper than the heading before it (e.g. an `<h1>` followed directly
 * by an `<h3>`), since assistive tech users navigating by heading lose the
 * document outline. Measured before the fix: 69 of 159 built pages jumped a
 * level — sidebar widgets, the table of contents, social sharing, search
 * results, list/term cards, the 404 page and three blog posts whose first
 * body section started at `###`.
 *
 * The theme's headings are styled per element (assets/scss/adritian.scss),
 * so most of the fixed headings keep their old rendering through a Bootstrap
 * size class (`.h5`) or a scoped SCSS rule rather than through the tag.
 *
 * Builds the real exampleSite (which imports this repo via its go.mod
 * `replace`) into a temp dir, then walks every generated .html file, skipping
 * Hugo's meta-refresh alias pages, and checks each page's heading sequence.
 *
 * No browser required — suitable for CI/CD pre-e2e checks. The build output
 * and resource cache go to temp dirs; hugo_stats.json writing is disabled so
 * nothing is written into exampleSite/.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const themeDir = path.resolve(__dirname, '../..');
const exampleSiteDir = path.join(themeDir, 'exampleSite');

const MIN_PAGES = 100;
const ALIAS_RE = /<meta[^>]*http-equiv=["']?refresh["']?/i;
// Opening <h1>..<h6> through its matching close tag. Headings never nest, so
// a lazy match to the same-level close tag is safe.
const HEADING_RE = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi;
// Template blocks (e.g. the search-result <script type=text/x-js-template>)
// are inert until cloned; strip all script bodies so only rendered markup counts.
const SCRIPT_RE = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;
const COMMENT_RE = /<!--[\s\S]*?-->/g;

/** Recursively collect every .html file under `dir`. */
function collectHtmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectHtmlFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

function headingText(inner) {
  return inner
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every heading jump of more than one level on one page. */
function findSkips(html) {
  const body = html.replace(COMMENT_RE, '').replace(SCRIPT_RE, '');
  const skips = [];
  let previous = null;
  for (const m of body.matchAll(HEADING_RE)) {
    const level = Number(m[1]);
    const text = headingText(m[2]);
    if (previous && level > previous.level + 1) {
      skips.push({ from: previous, to: { level, text } });
    }
    previous = { level, text };
  }
  return skips;
}

const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'heading-order-out-'));
const resourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'heading-order-resources-'));

try {
  const result = spawnSync(
    'hugo',
    ['--source', exampleSiteDir, '--destination', destDir, '--minify', '--buildDrafts', '--quiet'],
    {
      encoding: 'utf8',
      env: { ...process.env, HUGO_RESOURCEDIR: resourceDir, HUGO_BUILD_WRITESTATS: 'false' },
    },
  );

  assert.strictEqual(
    result.status,
    0,
    `hugo build failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );

  let scanned = 0;
  const failures = [];

  for (const file of collectHtmlFiles(destDir)) {
    const html = fs.readFileSync(file, 'utf8');
    if (ALIAS_RE.test(html)) {
      continue;
    }
    scanned += 1;
    const page = '/' + path.relative(destDir, file).split(path.sep).join('/');
    for (const { from, to } of findSkips(html)) {
      failures.push(`  ${page}: h${from.level} "${from.text}" -> h${to.level} "${to.text}"`);
    }
  }

  assert.ok(
    scanned >= MIN_PAGES,
    `Expected to scan at least ${MIN_PAGES} non-alias pages, scanned ${scanned}. ` +
      'A broken path/glob could silently turn this test into a no-op.',
  );

  const failingPages = new Set(failures.map((line) => line.split(':')[0])).size;
  assert.strictEqual(
    failures.length,
    0,
    `${failingPages} of ${scanned} pages skip a heading level (a heading more than one level deeper ` +
      `than the one before it):\n${failures.join('\n')}`,
  );

  console.log(`✅ heading-order test passed (${scanned} pages scanned, no heading level skipped)`);
} finally {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.rmSync(resourceDir, { recursive: true, force: true });
}
