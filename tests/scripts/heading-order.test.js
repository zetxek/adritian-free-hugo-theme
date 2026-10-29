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
 *
 * It also checks, on the same walk, that every taxonomy list page (`/tags/`,
 * `/es/categories/`, ...) shows its own locale's name for the taxonomy in its
 * `<h1>` — see the block above TAXONOMY_LABEL_KEYS.
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

// Some markup is inert until a browser clones or runs it: HTML comments and
// <script> bodies (the search page carries its result card in a
// <script type="text/x-js-template">). Those regions are skipped by index range
// instead of being edited out of the string, so only rendered markup is counted.
function inertRanges(html) {
  const lower = html.toLowerCase();
  const ranges = [];
  const addRange = (start, terminator, terminatorLength) => {
    const found = lower.indexOf(terminator, start + 1);
    const stop = found === -1 ? lower.length : found + terminatorLength;
    ranges.push([start, stop]);
    return stop;
  };
  let cursor = lower.indexOf('<!--');
  while (cursor !== -1) {
    cursor = addRange(cursor, '-->', 3);
    cursor = lower.indexOf('<!--', cursor);
  }
  cursor = lower.indexOf('<script');
  while (cursor !== -1) {
    cursor = addRange(cursor, '</script', 9);
    cursor = lower.indexOf('<script', cursor);
  }
  return ranges;
}

function isInert(ranges, position) {
  return ranges.some(([start, stop]) => position >= start && position < stop);
}

/** The visible text of a heading: its inner HTML with the tags taken out. */
function headingText(inner) {
  let text = '';
  let depth = 0;
  for (const char of inner) {
    if (char === '<') {
      depth += 1;
    } else if (char === '>') {
      depth = Math.max(0, depth - 1);
    } else if (depth === 0) {
      text += char;
    }
  }
  return text.replace(/\s+/g, ' ').trim();
}

/** Every heading jump of more than one level on one page. */
function findSkips(html) {
  const inert = inertRanges(html);
  const skips = [];
  let previous = null;
  for (const m of html.matchAll(HEADING_RE)) {
    if (isInert(inert, m.index)) {
      continue;
    }
    const level = Number(m[1]);
    const text = headingText(m[2]);
    if (previous && level > previous.level + 1) {
      skips.push({ from: previous, to: { level, text } });
    }
    previous = { level, text };
  }
  return skips;
}

// --- Taxonomy list pages name themselves from the locale ---------------------
//
// `layouts/_default/terms.html` renders the `<h1>` of a taxonomy list page
// (`/tags/`, `/es/categories/`, ...). It used to keep Hugo's synthesized
// `.Title` for `tags` and `categories` while overriding it with `i18n` for
// `authors` and `series` only, so a Spanish `/es/tags/` shipped an English
// "Tags" `<h1>` next to the breadcrumb's localized "Etiquetas" — the breadcrumb
// resolves its label with `i18n $plural` (layouts/partials/breadcrumb-label.html),
// which is the idiom the template now mirrors.
//
// Every bundled locale defines all four keys, so each taxonomy list page's
// `<h1>` must equal its own language's value; a taxonomy with no key (`topics`,
// a site's custom taxonomy) still falls back to `.Title` and is not checked.
const TAXONOMY_LABEL_KEYS = ['tags', 'categories', 'authors', 'series'];
const TAXONOMY_PAGE_RE = /class=["']section list-taxonomy["']/;
const HTML_LANG_RE = /<html[^>]*\blang=["']?([A-Za-z-]+)/;

/** The value a locale file gives a key, read straight out of i18n/<lang>.yaml. */
function readI18nValue(lang, key) {
  const file = path.join(themeDir, 'i18n', `${lang}.yaml`);
  if (!fs.existsSync(file)) {
    return null;
  }
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(new RegExp(`^"${key}":\\s*"([^"]*)"`, 'm'));
  return match ? match[1] : null;
}

/** The visible text of a page's first heading, whatever its level. */
function firstHeadingText(html) {
  const inert = inertRanges(html);
  for (const m of html.matchAll(HEADING_RE)) {
    if (!isInert(inert, m.index)) {
      return headingText(m[2]);
    }
  }
  return null;
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
  const taxonomyFailures = [];
  let taxonomyChecked = 0;

  for (const file of collectHtmlFiles(destDir)) {
  const html = fs.readFileSync(file, 'utf8');
  if (ALIAS_RE.test(html)) {
  continue;
  }
  scanned += 1;
  const page = '/' + path.relative(destDir, file).split(path.sep).join('/');
  for (const { from, to } of findSkips(html)) {
  failures.push(` ${page}: h${from.level} "${from.text}" -> h${to.level} "${to.text}"`);
  }

  // Taxonomy list pages must show the locale's own name for the taxonomy.
  if (TAXONOMY_PAGE_RE.test(html)) {
  const langMatch = html.match(HTML_LANG_RE);
  const lang = langMatch ? langMatch[1] : null;
  const taxKey = TAXONOMY_LABEL_KEYS.find((key) =>
  page.split('/').includes(key),
  );
  if (lang && taxKey) {
  const expected = readI18nValue(lang, taxKey);
  const actual = firstHeadingText(html);
  if (expected) {
  taxonomyChecked += 1;
  if (actual !== expected) {
  taxonomyFailures.push(
  ` ${page}: expected h1 "${expected}" (i18n "${taxKey}" of i18n/${lang}.yaml), got "${actual}"`,
  );
  }
  }
  }
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

  assert.ok(
 taxonomyChecked >= 8,
 `Expected to check at least 8 taxonomy list pages, checked ${taxonomyChecked}. ` +
 'A broken page/taxonomy matcher could silently turn this check into a no-op.',
 );

 assert.strictEqual(
 taxonomyFailures.length,
 0,
 `${taxonomyFailures.length} taxonomy list page(s) do not show their own ` +
 `locale's name for the taxonomy:\n${taxonomyFailures.join('\n')}`,
 );

 console.log(
 `✅ heading-order test passed (${scanned} pages scanned, no heading level skipped, ` +
 `${taxonomyChecked} taxonomy list pages localized)`,
 );
} finally {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.rmSync(resourceDir, { recursive: true, force: true });
}
