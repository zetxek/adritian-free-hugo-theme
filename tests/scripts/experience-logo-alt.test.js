#!/usr/bin/env node
'use strict';

/**
 * Regression test for the experience company-logo alt text.
 *
 * layouts/partials/experience.html, layouts/shortcodes/experience-list.html and
 * layouts/experience/single.html all do:
 *
 *   {{ $img := resources.Get .Params.companyLogo }}
 *   {{ with $img }}
 *     ...
 *     alt="{{ .Params.company }} logo"
 *
 * Inside {{ with $img }} the dot is rebound to the image resource, so
 * .Params.company is nil and the alt collapses to " logo". The fix captures
 * $company before the `with` shadows the dot.
 *
 * Builds a standalone temp site (own hugo.toml, classic --themesDir theme
 * import) and lets the theme's REAL templates render — no custom layout
 * override — then checks the built HTML of the pages that exercise all three
 * call sites: the /experience/ list (partial), a content page using both
 * shortcodes, and the experience single page (sidebar).
 *
 * No browser required — suitable for CI/CD pre-e2e checks. Never writes into
 * exampleSite/.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const themeDir = path.resolve(__dirname, '../..');
const themeName = path.basename(themeDir);

const COMPANY = 'Acme Corp';
const LOGO_IMG_RE = /<img[^>]*class=["']?[^"'>]*experience__company-logo[^"'>]*["']?[^>]*>/g;
// Tolerant of Hugo's --minify stripping attribute-value quotes where it can
// (it can't here, since the alt value contains spaces, but stay defensive).
const ALT_RE = /\balt=(?:"([^"]*)"|'([^']*)'|(\S+))/;

function extractAlts(html) {
  const imgs = html.match(LOGO_IMG_RE) || [];
  return imgs.map((imgTag) => {
    const m = ALT_RE.exec(imgTag);
    assert.ok(m, `experience__company-logo <img> has no alt attribute at all: ${imgTag}`);
    const alt = m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3];
    return { imgTag, alt };
  });
}

const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'experience-logo-alt-'));
const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'experience-logo-alt-out-'));

try {
  fs.writeFileSync(
    path.join(tmpSite, 'hugo.toml'),
    [
      "baseURL = 'http://localhost/'",
      "languageCode = 'en-us'",
      "title = 'Experience Logo Alt Test'",
      `theme = '${themeName}'`,
      '',
    ].join('\n'),
  );

  fs.mkdirSync(path.join(tmpSite, 'content', 'experience'), { recursive: true });
  fs.mkdirSync(path.join(tmpSite, 'assets', 'images'), { recursive: true });

  fs.copyFileSync(
    path.join(themeDir, 'exampleSite', 'assets', 'images', 'experience', 'internet-affairs.png'),
    path.join(tmpSite, 'assets', 'images', 'logo.png'),
  );

  fs.writeFileSync(path.join(tmpSite, 'content', 'experience', '_index.md'), ['---', 'title: Experience', '---', ''].join('\n'));

  fs.writeFileSync(
    path.join(tmpSite, 'content', 'experience', 'job-1.md'),
    [
      '---',
      'title: "Job 1"',
      'jobTitle: "Software Engineer"',
      `company: "${COMPANY}"`,
      'location: "Remote"',
      'duration: "2022-2024"',
      'companyLogo: "images/logo.png"',
      '---',
      '',
      'Job 1 body.',
      '',
    ].join('\n'),
  );

  fs.writeFileSync(
    path.join(tmpSite, 'content', 'shortcodes.md'),
    [
      '---',
      'title: Shortcodes',
      '---',
      '',
      '{{< experience-section title="Experience Section" >}}',
      '',
      '{{< experience-list title="Experience List" >}}',
      '',
    ].join('\n'),
  );

  const result = spawnSync(
    'hugo',
    ['--source', tmpSite, '--themesDir', path.join(themeDir, '..'), '--destination', destDir, '--minify', '--quiet'],
    { encoding: 'utf8' },
  );

  assert.strictEqual(
    result.status,
    0,
    `hugo build failed (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );

  const pages = {
    '/experience/ list (partial)': path.join(destDir, 'experience', 'index.html'),
    '/shortcodes/ (both shortcodes)': path.join(destDir, 'shortcodes', 'index.html'),
    '/experience/job-1/ (single sidebar)': path.join(destDir, 'experience', 'job-1', 'index.html'),
  };

  let totalLogoImgs = 0;

  for (const [label, filePath] of Object.entries(pages)) {
    assert.ok(fs.existsSync(filePath), `Expected built page for ${label} at ${filePath}, but it was missing.`);
    const html = fs.readFileSync(filePath, 'utf8');
    const alts = extractAlts(html);

    assert.ok(alts.length > 0, `Expected at least one experience__company-logo <img> on ${label}, found none.`);

    for (const { imgTag, alt } of alts) {
      const trimmed = alt.trim();

      assert.notStrictEqual(
        trimmed,
        'logo',
        `Broken alt text on ${label}: got alt="${alt}" (trimmed to "logo"), the .Params.company lookup is ` +
          `shadowed by {{ with $img }} and resolved to nothing.\nOffending tag: ${imgTag}`,
      );

      assert.strictEqual(
        trimmed,
        `${COMPANY} logo`,
        `Wrong alt text on ${label}: expected "${COMPANY} logo", got "${alt}".\nOffending tag: ${imgTag}`,
      );
    }

    totalLogoImgs += alts.length;
  }

  assert.ok(
    totalLogoImgs >= 3,
    `Expected at least 3 experience__company-logo images across the three pages, found ${totalLogoImgs}. ` +
      'A broken path/glob could silently turn this test into a no-op.',
  );

  console.log(
    `✅ experience-logo-alt test passed (${totalLogoImgs} company-logo images checked across ` +
      `${Object.keys(pages).length} pages, all alt="${COMPANY} logo")`,
  );
} finally {
  fs.rmSync(tmpSite, { recursive: true, force: true });
  fs.rmSync(destDir, { recursive: true, force: true });
}
