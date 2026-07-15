#!/usr/bin/env node
'use strict';

/**
 * Regression test for issue #572: all 14 i18n/*.yaml files were converted
 * from the legacy go-i18n verbose array format to a flat key-value map.
 *
 * This test builds a bare-minimum standalone site (its own hugo.toml and a
 * single throwaway layout) that imports *only* the theme's mounted i18n —
 * deliberately bypassing exampleSite, which (until this same fix) had its
 * own exampleSite/i18n/*.yaml shadow copy that silently overrode the
 * theme's i18n for its 5 active locales. Building a fresh standalone site
 * is the only way to verify the theme's own i18n/*.yaml files directly.
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

const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-format-test-'));

try {
  fs.mkdirSync(path.join(tmpSite, 'content'), { recursive: true });
  fs.mkdirSync(path.join(tmpSite, 'layouts'), { recursive: true });

  fs.writeFileSync(
    path.join(tmpSite, 'hugo.toml'),
    `baseURL = 'http://localhost/'\nlanguageCode = 'en-us'\ntitle = 'i18n Format Test'\ntheme = '${themeName}'\n`,
  );

  // Dump the i18n keys of interest as plain text so we can assert on the
  // built HTML without depending on any of the theme's real templates.
  fs.writeFileSync(
    path.join(tmpSite, 'layouts', 'index.html'),
    [
      'skipToMainContent={{ i18n "skipToMainContent" }}',
      'contact_button={{ i18n "contact_button" }}',
      'toggle_navigation={{ i18n "toggle_navigation" }}',
    ].join('\n'),
  );

  const result = spawnSync(
    'hugo',
    ['--source', tmpSite, '--themesDir', path.join(themeDir, '..'), '--quiet'],
    { encoding: 'utf8' },
  );

  assert.strictEqual(
    result.status,
    0,
    `hugo build failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );

  const output = fs.readFileSync(path.join(tmpSite, 'public', 'index.html'), 'utf8');

  assert.ok(
    output.includes('skipToMainContent=Skip to main content'),
    `Expected flat-format translation for "skipToMainContent" not found.\nOutput:\n${output}`,
  );
  assert.ok(
    output.includes('contact_button=Send message'),
    `Expected "contact_button" to resolve to the first (deduplicated) definition "Send message".\nOutput:\n${output}`,
  );
  assert.ok(
    output.includes('toggle_navigation=Toggle navigation'),
    `Expected flat-format translation for "toggle_navigation" not found.\nOutput:\n${output}`,
  );

  console.log('✅ i18n-format test passed (theme i18n/*.yaml resolves correctly in a standalone site)');
} finally {
  fs.rmSync(tmpSite, { recursive: true, force: true });
}
