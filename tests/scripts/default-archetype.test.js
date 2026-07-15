#!/usr/bin/env node
'use strict';

/**
 * Regression test for issue #566: archetypes/default.md shipped empty
 * (`+++`/`+++`), which discards Hugo's built-in default archetype
 * (title/date/draft) for any content type without its own dedicated
 * archetype. `hugo new` produced files with no front matter at all.
 *
 * This test runs `hugo new` against exampleSite for a content type that has
 * no dedicated archetype (there's no archetypes/page.md, etc.) and asserts
 * the generated front matter includes title, date, and draft = true.
 *
 * No browser required — suitable for CI/CD pre-e2e checks.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const themeDir = path.resolve(__dirname, '../..');
const exampleSiteDir = path.join(themeDir, 'exampleSite');

const relPath = `content/_archetype-regression-test-${Date.now()}.md`;
const absPath = path.join(exampleSiteDir, relPath);

try {
  const result = spawnSync(
    'hugo',
    ['new', relPath, '--themesDir', '../..'],
    { encoding: 'utf8', cwd: exampleSiteDir },
  );

  assert.strictEqual(
    result.status,
    0,
    `hugo new failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );

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
  fs.rmSync(absPath, { force: true });
}
