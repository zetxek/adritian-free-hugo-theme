#!/usr/bin/env node
'use strict';

/**
 * Regression guard: the built exampleSite must not emit dead internal links.
 *
 * Defect class: menu entries and shortcode CTAs in exampleSite pointing at
 * language-prefixed paths that are never generated (e.g. `/es/skills` when
 * only `/skills` exists, or a French CTA copied from the Spanish file and
 * pointing at `/es/experience`). Hugo builds these happily; they only show
 * up as 404s on the live demo.
 *
 * This test runs a real `hugo build` into a temp directory, walks every
 * generated HTML file, and checks that every `<a href>` / `<area href>`
 * pointing inside the site resolves to a file (or a directory containing
 * index.html) in the build output.
 *
 * Hugo's alias pages (`<meta http-equiv="refresh" ...>` redirect stubs) are
 * skipped entirely: they only exist to forward an old URL to its canonical
 * page and carry no navigational links of their own worth checking.
 *
 * Like no-debug-logging.test.js, this build must NOT touch exampleSite/ —
 * a parallel Playwright `hugo server` serves it. Output and the resource
 * cache go to isolated temp directories.
 *
 * No browser required — suitable for CI/CD pre-e2e checks.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const themeDir = path.resolve(__dirname, '../..');
const exampleSiteDir = path.join(themeDir, 'exampleSite');

const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'internal-links-dest-'));
const resourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'internal-links-resources-'));

const isSpace = (c) => c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f';

/**
 * Character-scanning reader for the start tag beginning at `html[start]`
 * (which must be '<'). Returns { name, attrs, end } where `end` is the index
 * just past the closing '>', or null if this isn't an element start tag.
 */
function readStartTag(html, start) {
  let i = start + 1;
  const nameStart = i;
  while (i < html.length && /[A-Za-z0-9]/.test(html[i])) i++;
  if (i === nameStart) return null;
  const name = html.slice(nameStart, i).toLowerCase();
  const attrs = {};

  while (i < html.length) {
    while (i < html.length && (isSpace(html[i]) || html[i] === '/')) i++;
    if (i >= html.length) break;
    if (html[i] === '>') return { name, attrs, end: i + 1 };

    const attrStart = i;
    while (i < html.length && !isSpace(html[i]) && html[i] !== '=' && html[i] !== '>' && html[i] !== '/') i++;
    const attrName = html.slice(attrStart, i).toLowerCase();
    if (i === attrStart) {
      i++;
      continue;
    }
    while (i < html.length && isSpace(html[i])) i++;

    let value = '';
    if (html[i] === '=') {
      i++;
      while (i < html.length && isSpace(html[i])) i++;
      const quote = html[i];
      if (quote === '"' || quote === "'") {
        const close = html.indexOf(quote, i + 1);
        const stop = close === -1 ? html.length : close;
        value = html.slice(i + 1, stop);
        i = stop + 1;
      } else {
        const valueStart = i;
        while (i < html.length && !isSpace(html[i]) && html[i] !== '>') i++;
        value = html.slice(valueStart, i);
      }
    }
    if (!(attrName in attrs)) attrs[attrName] = value;
  }
  return { name, attrs, end: html.length };
}

const NAMED_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

/** Single-pass decode, so `&amp;lt;` becomes `&lt;` rather than `<`. */
function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, ref) => {
    if (ref[0] === '#') {
      const code = ref[1] === 'x' || ref[1] === 'X' ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[ref.toLowerCase()] ?? match;
  });
}

/** Yields every start tag in the document, skipping comments and raw-text elements. */
function* startTags(html) {
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) return;
    if (html.startsWith('<!--', lt)) {
      const close = html.indexOf('-->', lt + 4);
      i = close === -1 ? html.length : close + 3;
      continue;
    }
    const tag = readStartTag(html, lt);
    if (!tag) {
      i = lt + 1;
      continue;
    }
    yield tag;
    i = tag.end;
    if (tag.name === 'script' || tag.name === 'style') {
      const closeIdx = html.toLowerCase().indexOf(`</${tag.name}`, i);
      i = closeIdx === -1 ? html.length : closeIdx;
    }
  }
}

function isAliasPage(html) {
  for (const tag of startTags(html)) {
    if (tag.name === 'meta' && (tag.attrs['http-equiv'] || '').toLowerCase() === 'refresh') return true;
    if (tag.name === 'body') return false;
  }
  return false;
}

function listHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listHtmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function resolves(target) {
  try {
    const stat = fs.statSync(target);
    if (stat.isFile()) return true;
    if (stat.isDirectory()) return fs.existsSync(path.join(target, 'index.html'));
  } catch {
    // fall through
  }
  return false;
}

const IGNORED_PREFIXES = ['mailto:', 'tel:', 'javascript:', 'data:', '#'];

let result;
let htmlFileCount = 0;
let aliasCount = 0;
let linkCount = 0;
const broken = [];

try {
  result = spawnSync(
    'hugo',
    ['--minify', '--themesDir', '../..', '--destination', destDir],
    {
      encoding: 'utf8',
      cwd: exampleSiteDir,
      env: { ...process.env, HUGO_RESOURCEDIR: resourceDir },
    },
  );

  if (result.status === 0) {
    for (const file of listHtmlFiles(destDir)) {
      const html = fs.readFileSync(file, 'utf8');
      if (isAliasPage(html)) {
        aliasCount++;
        continue;
      }
      htmlFileCount++;
      const page = path.relative(destDir, file);

      for (const tag of startTags(html)) {
        if (tag.name !== 'a' && tag.name !== 'area') continue;
        if (!('href' in tag.attrs)) continue;
        const href = decodeEntities(tag.attrs.href).trim();
        if (href === '') continue;
        const lower = href.toLowerCase();
        if (IGNORED_PREFIXES.some((p) => lower.startsWith(p))) continue;
        // External: has a scheme (`https:`) or is protocol-relative (`//host`).
        if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) continue;

        linkCount++;
        let linkPath = href.split(/[?#]/, 1)[0];
        try {
          linkPath = decodeURIComponent(linkPath);
        } catch {
          // leave undecodable paths as-is; they'll most likely fail to resolve
        }
        const target = linkPath.startsWith('/')
          ? path.join(destDir, linkPath)
          : path.resolve(path.dirname(file), linkPath);
        if (!resolves(target)) broken.push(`${page} -> ${href}`);
      }
    }
  }
} finally {
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.rmSync(resourceDir, { recursive: true, force: true });
}

assert.strictEqual(
  result.status,
  0,
  `hugo build failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
);

const MAX_REPORTED = 40;
assert.strictEqual(
  broken.length,
  0,
  `Found ${broken.length} dead internal link(s) in the built exampleSite:\n` +
    broken.slice(0, MAX_REPORTED).join('\n') +
    (broken.length > MAX_REPORTED ? `\n... and ${broken.length - MAX_REPORTED} more` : ''),
);

// Sanity floor: a broken file walk or tag scanner must never turn this
// test into a silent no-op.
assert.ok(htmlFileCount > 100, `Expected to scan > 100 HTML files, scanned ${htmlFileCount}.`);
assert.ok(linkCount > 1000, `Expected to check > 1000 internal links, checked ${linkCount}.`);

console.log(
  `✅ internal-links test passed (${htmlFileCount} HTML file(s) scanned, ${aliasCount} alias page(s) skipped, ` +
    `${linkCount} internal link(s) checked, 0 broken)`,
);
