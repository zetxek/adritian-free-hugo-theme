#!/usr/bin/env node
'use strict';

/**
 * Regression test for issue #570: logoText1/logoText2/blog.featuredSortByWeight
 * were added as camelCase aliases for the pre-existing snake_case params
 * (logo_text1/logo_text2/blog.featured_sort_by_weight), falling back to the
 * old names when the new ones aren't set. This is purely additive — no
 * existing site config using only the old snake_case names should break.
 *
 * This test builds a standalone site that sets *only* the legacy
 * snake_case params (no camelCase names at all) and asserts the theme
 * still picks them up correctly, exercising the fallback path directly.
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

const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'param-casing-fallback-test-'));

try {
  fs.mkdirSync(path.join(tmpSite, 'content', 'blog'), { recursive: true });

  fs.writeFileSync(
    path.join(tmpSite, 'hugo.toml'),
    [
      "baseURL = 'http://localhost/'",
      "languageCode = 'en-us'",
      "title = 'Param Casing Fallback Test'",
      `theme = '${themeName}'`,
      '',
      '[params]',
      "logo_text1 = 'LegacyBrand'",
      "logo_text2 = 'LegacySubtitle'",
      '',
      '[params.blog]',
      'featured_sort_by_weight = true',
      '',
    ].join('\n'),
  );

  // A featured post so the blog list's featured-sort-by-weight branch runs.
  fs.writeFileSync(
    path.join(tmpSite, 'content', 'blog', 'post-1.md'),
    [
      '+++',
      "title = 'Post 1'",
      'featured = true',
      'weight = 1',
      '+++',
      'Body.',
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

  const homeHtml = fs.readFileSync(path.join(tmpSite, 'public', 'index.html'), 'utf8');
  assert.ok(
    homeHtml.includes('LegacyBrand') && homeHtml.includes('LegacySubtitle'),
    `Expected header logo to fall back to legacy logo_text1/logo_text2 when logoText1/logoText2 are unset.\nOutput:\n${homeHtml}`,
  );

  const blogHtml = fs.readFileSync(path.join(tmpSite, 'public', 'blog', 'index.html'), 'utf8');
  assert.ok(
    blogHtml.includes('featured-post-container'),
    `Expected the blog list's featured-post section to build using the legacy blog.featured_sort_by_weight fallback.\nOutput:\n${blogHtml}`,
  );

  console.log('✅ param-casing-fallback test passed (legacy snake_case params still work when camelCase names are unset)');
} finally {
  fs.rmSync(tmpSite, { recursive: true, force: true });
}
