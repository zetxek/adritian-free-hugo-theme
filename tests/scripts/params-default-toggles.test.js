#!/usr/bin/env node
'use strict';

/**
 * Regression test for issue #575: layouts/partials/reading-progress.html
 * and layouts/_default/{home,baseof}.html gated "default-on unless
 * explicitly disabled" features with:
 *
 *   {{- if or .Site.Params.X (not (isset .Site.Params "X")) }}
 *
 * Hugo lowercases all config keys, so isset with a camelCase literal
 * ("readingProgress", "viewTransitions") always returns false — the
 * "not isset" branch was therefore always true, and setting the param to
 * `false` had no effect: the feature could never be disabled.
 *
 * This test builds standalone temp sites (own hugo.toml, classic
 * --themesDir theme import) and lets the theme's REAL templates render —
 * no custom layout override — then checks the built HTML for each
 * feature's marker across all three states: unset, explicit true, explicit
 * false. Playwright auto-discovers every tests/**\/*.test.js file and runs
 * it in parallel with the browser specs against a live hugo server on
 * exampleSite/, so this must never write into exampleSite/ itself.
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

/**
 * Build a standalone site with the given extra hugo.toml config appended,
 * containing one blog post (type = "blog") so reading-progress.html's
 * `.IsPage` + `.Type "blog"` guard is satisfied. Returns the built HTML of
 * the home page and the blog post.
 */
function buildSite(extraConfig) {
  const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'params-default-toggles-'));
  try {
    fs.mkdirSync(path.join(tmpSite, 'content', 'blog'), { recursive: true });

    fs.writeFileSync(
      path.join(tmpSite, 'hugo.toml'),
      [
        "baseURL = 'http://localhost/'",
        "languageCode = 'en-us'",
        "title = 'Params Default Toggles Test'",
        `theme = '${themeName}'`,
        '',
        extraConfig,
        '',
      ].join('\n'),
    );

    fs.writeFileSync(
      path.join(tmpSite, 'content', 'blog', 'post.md'),
      ['+++', "title = 'Post'", "type = 'blog'", '+++', 'Body.'].join('\n'),
    );

    const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'params-default-toggles-out-'));
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

      return {
        home: fs.readFileSync(path.join(destDir, 'index.html'), 'utf8'),
        blogPost: fs.readFileSync(path.join(destDir, 'blog', 'post', 'index.html'), 'utf8'),
      };
    } finally {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(tmpSite, { recursive: true, force: true });
  }
}

// --- viewTransitions: marker is the bare substring "view-transition" in
// the built home page. Some Hugo builds (e.g. with --minify) may omit
// attribute-value quotes (name=view-transition, not name="view-transition"), so the
// assertion must not depend on quoting. ---

const vtUnset = buildSite('');
assert.ok(
  vtUnset.home.includes('view-transition'),
  'Expected view-transition meta to be present when viewTransitions is unset (default-on).',
);

const vtTrue = buildSite('[params]\nviewTransitions = true');
assert.ok(
  vtTrue.home.includes('view-transition'),
  'Expected view-transition meta to be present when viewTransitions = true.',
);

const vtFalse = buildSite('[params]\nviewTransitions = false');
assert.ok(
  !vtFalse.home.includes('view-transition'),
  'Expected view-transition meta to be ABSENT when viewTransitions = false — ' +
    'this is exactly the bug from #575 (isset with a camelCase key is always false in Hugo).',
);

// --- readingProgress: marker is "reading-progress-bar" on a blog single
// page (the partial only fires for .IsPage + .Type "blog"). ---

const rpUnset = buildSite('');
assert.ok(
  rpUnset.blogPost.includes('reading-progress-bar'),
  'Expected reading-progress-bar to be present when readingProgress is unset (default-on).',
);

const rpTrue = buildSite('[params.blog]\nreadingProgress = true');
assert.ok(
  rpTrue.blogPost.includes('reading-progress-bar'),
  'Expected reading-progress-bar to be present when readingProgress = true.',
);

const rpFalse = buildSite('[params.blog]\nreadingProgress = false');
assert.ok(
  !rpFalse.blogPost.includes('reading-progress-bar'),
  'Expected reading-progress-bar to be ABSENT when readingProgress = false — ' +
    'this is exactly the bug from #575 (isset with a camelCase key is always false in Hugo).',
);

console.log('✅ params-default-toggles test passed (viewTransitions and readingProgress both respect unset/true/false)');
