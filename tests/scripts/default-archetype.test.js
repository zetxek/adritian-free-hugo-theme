#!/usr/bin/env node
'use strict';

/**
 * Regression test for issue #566: archetypes/default.md shipped empty
 * (`+++`/`+++`), which discards Hugo's built-in default archetype
 * (title/date/draft) for any content type without its own dedicated
 * archetype. `hugo new` produced files with no front matter at all.
 *
 * This test builds a standalone site that imports only the theme (via the
 * classic --themesDir mechanism) and runs `hugo new` against it, asserting
 * the generated front matter includes title, date, and draft = true.
 *
 * Playwright auto-discovers every tests/**\/*.test.js file (testDir is
 * './tests') and runs it in parallel with the browser specs, alongside a
 * live `hugo server` that's also serving exampleSite/ for those specs. This
 * test previously created (then deleted) a content file directly inside
 * exampleSite/content/, which the live dev server's file-watcher picks up
 * and rebuilds on — that create+delete churn, racing against the other
 * ~290 concurrently-running specs, was a plausible source of the
 * intermittent Spanish-search-index timeouts seen in CI (search.spec.ts).
 * Using a fully isolated standalone site avoids touching exampleSite/ at
 * all, matching the safe pattern used by generate-favicon-ico.test.js and
 * the i18n-format/param-casing-fallback scripts.
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

const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'default-archetype-test-'));

try {
  fs.mkdirSync(path.join(tmpSite, 'content'), { recursive: true });

  fs.writeFileSync(
    path.join(tmpSite, 'hugo.toml'),
    `baseURL = 'http://localhost/'\nlanguageCode = 'en-us'\ntitle = 'Default Archetype Test'\ntheme = '${themeName}'\n`,
  );

  const relPath = 'content/regression-test.md';

  const result = spawnSync(
    'hugo',
    ['new', relPath, '--themesDir', path.join(themeDir, '..')],
    { encoding: 'utf8', cwd: tmpSite },
  );

  assert.strictEqual(
    result.status,
    0,
    `hugo new failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );

  const absPath = path.join(tmpSite, relPath);
  assert.ok(fs.existsSync(absPath), `Expected generated file not found: ${absPath}`);

  const content = fs.readFileSync(absPath, 'utf8');

  assert.ok(
    /^title\s*=/m.test(content),
    `Generated archetype is missing a "title" field.\nContent:\n${content}`,
  );
  assert.ok(
    /^date\s*=/m.test(content),
    `Generated archetype is missing a "date" field.\nContent:\n${content}`,
  );
  assert.ok(
    /^draft\s*=\s*true/m.test(content),
    `Generated archetype is missing "draft = true".\nContent:\n${content}`,
  );

  console.log('✅ default-archetype test passed (title/date/draft present in hugo new output)');
} finally {
  fs.rmSync(tmpSite, { recursive: true, force: true });
}
