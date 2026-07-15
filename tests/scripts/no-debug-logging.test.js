#!/usr/bin/env node
'use strict';

/**
 * Regression test for issue #564: layouts/_default/home.html and
 * layouts/partials/footer.html used to loop over every page (in every
 * language) and emit a `warnf` for each one, on every render. This flooded
 * `hugo build` output with hundreds of debug lines and buried genuinely
 * actionable warnings.
 *
 * This test runs a real `hugo build` against exampleSite and asserts none
 * of the removed debug-log patterns reappear in the build output.
 *
 * No browser required — suitable for CI/CD pre-e2e checks.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const themeDir = path.resolve(__dirname, '../..');
const exampleSiteDir = path.join(themeDir, 'exampleSite');

// Clean cached build artifacts so this is a true from-scratch build.
for (const dir of ['public', 'resources']) {
  fs.rmSync(path.join(exampleSiteDir, dir), { recursive: true, force: true });
}
for (const file of ['.hugo_build.lock', 'hugo_stats.json']) {
  fs.rmSync(path.join(exampleSiteDir, file), { force: true });
}

const result = spawnSync(
  'hugo',
  ['--minify', '--themesDir', '../..'],
  { encoding: 'utf8', cwd: exampleSiteDir },
);

assert.strictEqual(
  result.status,
  0,
  `hugo build failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
);

const output = `${result.stdout}\n${result.stderr}`;

// Debug patterns that layouts/_default/home.html and
// layouts/partials/footer.html used to print for every single page.
const debugPatterns = [
  { name: 'per-page "Path: ... | Kind: ..." debug dump', re: /WARN\s+Path:.*\|\s*Kind:\s*\S+/ },
  { name: '"[HOME] Path: ..." debug dump', re: /WARN\s+\[HOME]\s+Path:/ },
  { name: '"[FOOTER] Path: ..." debug dump', re: /WARN\s+\[FOOTER]\s+Path:/ },
  { name: '"No .File for this page" debug dump', re: /WARN\s+No \.File for this page:/ },
];

const failures = [];
for (const { name, re } of debugPatterns) {
  const matches = output.match(new RegExp(re, 'g')) || [];
  if (matches.length > 0) {
    failures.push(`${name}: found ${matches.length} occurrence(s)`);
  }
}

assert.strictEqual(
  failures.length,
  0,
  `Debug logging regression detected in hugo build output:\n${failures.join('\n')}`,
);

// Sanity ceiling: a healthy build should have a small, bounded number of
// WARN lines (deprecation notices, config issues) — not hundreds.
const warnCount = (output.match(/WARN\s/g) || []).length;
assert.ok(
  warnCount < 20,
  `Expected a small number of WARN lines, found ${warnCount}. ` +
    `This may indicate a new per-page debug logging regression.`,
);

// Clean up build artifacts produced by this test run.
for (const dir of ['public', 'resources']) {
  fs.rmSync(path.join(exampleSiteDir, dir), { recursive: true, force: true });
}
for (const file of ['.hugo_build.lock', 'hugo_stats.json']) {
  fs.rmSync(path.join(exampleSiteDir, file), { force: true });
}

console.log(`✅ no-debug-logging test passed (${warnCount} legitimate WARN line(s), 0 debug-dump lines)`);
