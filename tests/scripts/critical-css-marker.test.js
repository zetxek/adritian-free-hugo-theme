#!/usr/bin/env node
'use strict';

/**
 * Regression test for layouts/partials/head.html's critical-CSS inlining:
 *
 *   - when a site provides its own non-empty assets/css/critical.css, its
 *     content must be inlined into <head> as a <style> element carrying both
 *     data-generator="critical-css" and data-critical;
 *   - when a site has no critical.css of its own (only the theme's empty
 *     placeholder applies), that <style> element must NOT be emitted at all.
 *     Previously the theme always emitted an empty
 *     <style data-generator="critical-css"></style>, which this guards against.
 *
 * Builds standalone temp sites (own hugo.toml, classic --themesDir theme
 * import) and lets the theme's REAL templates render — no custom layout
 * override — then checks the built home page HTML. Playwright auto-discovers
 * every tests/**\/*.test.js file and runs it in parallel with the browser
 * specs against a live hugo server on exampleSite/, so this must never write
 * into exampleSite/ itself.
 *
 * No browser required — suitable for CI/CD pre-e2e checks.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const themeDir = path.resolve(__dirname, '../..');
const themeName = path.basename(themeDir);

// Tolerant of Hugo's --minify stripping attribute-value quotes.
const CRITICAL_STYLE_RE = /<style[^>]*data-generator=["']?critical-css["']?[^>]*>/;
const DATA_CRITICAL_RE = /<style[^>]*data-critical[^>]*>/;

function buildSite(criticalCssContent) {
  const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'critical-css-marker-'));
  try {
    fs.writeFileSync(
      path.join(tmpSite, 'hugo.toml'),
      [
        "baseURL = 'http://localhost/'",
        "languageCode = 'en-us'",
        "title = 'Critical CSS Marker Test'",
        `theme = '${themeName}'`,
        '',
      ].join('\n'),
    );

    if (criticalCssContent !== null) {
      fs.mkdirSync(path.join(tmpSite, 'assets', 'css'), { recursive: true });
      fs.writeFileSync(path.join(tmpSite, 'assets', 'css', 'critical.css'), criticalCssContent);
    }

    const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'critical-css-marker-out-'));
    try {
      const result = spawnSync(
        'hugo',
        ['--themesDir', path.join(themeDir, '..'), '--destination', destDir, '--quiet'],
        { encoding: 'utf8', cwd: tmpSite },
      );

      assert.strictEqual(
        result.status,
        0,
        `hugo build failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
      );

      return fs.readFileSync(path.join(destDir, 'index.html'), 'utf8');
    } finally {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(tmpSite, { recursive: true, force: true });
  }
}

// --- Case a: site provides its own non-empty critical.css ---

const withCritical = buildSite('body{color:#111}');

assert.ok(
  CRITICAL_STYLE_RE.test(withCritical),
  'Expected a <style data-generator="critical-css"> element when the site provides ' +
    'its own non-empty assets/css/critical.css, but none was found.',
);

assert.ok(
  DATA_CRITICAL_RE.test(withCritical),
  'Expected the critical-css <style> element to also carry data-critical, but it did not.',
);

assert.ok(
  withCritical.includes('color:#111') || withCritical.includes('color: #111'),
  'Expected the inlined <style> block to contain the critical.css rule we wrote, but it was missing.',
);

// --- Case b: no site-level critical.css (only the theme's empty placeholder) ---

const withoutCritical = buildSite(null);

assert.ok(
  !CRITICAL_STYLE_RE.test(withoutCritical),
  'Expected NO <style data-generator="critical-css"> element when only the theme\'s ' +
    'empty placeholder critical.css applies, but one was found (the empty block should be omitted).',
);

console.log('✅ critical-css-marker test passed (block present+marked with site CSS, absent with only the placeholder)');
