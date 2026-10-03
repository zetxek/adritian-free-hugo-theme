#!/usr/bin/env node
'use strict';

/**
 * Regression test for the per-page JSON-LD `schema` front-matter override
 * (layouts/partials/seo/jsonld.html). Hugo lowercases every front-matter
 * param key, nested ones included, even quoted ones, so a map-valued
 * `schema` param (e.g. YAML `mainEntity: [...]`) silently turns into
 * `mainentity` and produces invalid JSON-LD for schema.org's case-sensitive
 * properties. The only safe route is a raw JSON string (YAML `|` block
 * scalar / TOML `"""` multiline string) parsed at build time with
 * transform.Unmarshal, which preserves case.
 *
 * This test builds standalone temp sites (own hugo.toml, classic
 * --themesDir theme import) and lets the theme's REAL templates render —
 * no custom layout override. Playwright auto-discovers every
 * tests/**\/*.test.js file and runs it in parallel with the browser specs
 * against a live hugo server on exampleSite/, so this must never write
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

function buildSite(frontMatterExtra) {
  const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-override-'));
  try {
    fs.mkdirSync(path.join(tmpSite, 'content', 'blog'), { recursive: true });

    fs.writeFileSync(
      path.join(tmpSite, 'hugo.toml'),
      [
        "baseURL = 'http://localhost/'",
        "languageCode = 'en-us'",
        "title = 'Schema Override Test'",
        `theme = '${themeName}'`,
        '',
      ].join('\n'),
    );

    fs.writeFileSync(
      path.join(tmpSite, 'content', 'blog', 'post.md'),
      ['---', "title: 'Post'", "type: 'blog'", frontMatterExtra, '---', 'Body.'].join('\n'),
    );

    const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'schema-override-out-'));
    try {
      // No --quiet: case (c) below asserts on the error text hugo prints for
      // a map-valued `schema` param, and --quiet suppresses ERROR lines too.
      const result = spawnSync(
        'hugo',
        ['--themesDir', path.join(themeDir, '..'), '--destination', destDir],
        { encoding: 'utf8', cwd: tmpSite },
      );

      let blogPost = null;
      const blogPostPath = path.join(destDir, 'blog', 'post', 'index.html');
      if (fs.existsSync(blogPostPath)) {
        blogPost = fs.readFileSync(blogPostPath, 'utf8');
      }

      return { result, blogPost };
    } finally {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
  } finally {
    fs.rmSync(tmpSite, { recursive: true, force: true });
  }
}

function extractJsonLdScripts(html) {
  const scripts = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  while ((match = re.exec(html)) !== null) {
    scripts.push(JSON.parse(match[1]));
  }
  return scripts;
}

// --- (a) raw-JSON-string schema -> build succeeds, FAQPage script present,
// camelCase mainEntity/acceptedAnswer survive. ---

const withString = buildSite(
  [
    'schema: |',
    '  {',
    '    "@context": "https://schema.org",',
    '    "@type": "FAQPage",',
    '    "mainEntity": [',
    '      {',
    '        "@type": "Question",',
    '        "name": "Does casing survive?",',
    '        "acceptedAnswer": {',
    '          "@type": "Answer",',
    '          "text": "Yes, because schema is a raw JSON string."',
    '        }',
    '      }',
    '    ]',
    '  }',
  ].join('\n'),
);

assert.strictEqual(
  withString.result.status,
  0,
  `hugo build failed (exit ${withString.result.status}).\nstdout: ${withString.result.stdout}\nstderr: ${withString.result.stderr}`,
);

const scriptsA = extractJsonLdScripts(withString.blogPost);
const faqPage = scriptsA.find((s) => s['@type'] === 'FAQPage');
assert.ok(faqPage, 'Expected a FAQPage JSON-LD script when `schema` front matter is a raw JSON string.');
assert.ok(Array.isArray(faqPage.mainEntity), 'Expected FAQPage.mainEntity to be an array (camelCase key preserved).');
assert.strictEqual(faqPage.mainEntity.length, 1);
assert.ok(
  faqPage.mainEntity[0].acceptedAnswer,
  'Expected mainEntity[0].acceptedAnswer to survive with camelCase intact.',
);
assert.strictEqual(faqPage.mainEntity[0].acceptedAnswer.text, 'Yes, because schema is a raw JSON string.');

// --- (b) no `schema` param -> no FAQPage script, build still succeeds. ---

const withoutSchema = buildSite('');
assert.strictEqual(
  withoutSchema.result.status,
  0,
  `hugo build failed (exit ${withoutSchema.result.status}).\nstdout: ${withoutSchema.result.stdout}\nstderr: ${withoutSchema.result.stderr}`,
);
const scriptsB = extractJsonLdScripts(withoutSchema.blogPost);
assert.ok(
  !scriptsB.some((s) => s['@type'] === 'FAQPage'),
  'Expected no FAQPage JSON-LD script when `schema` front matter is unset.',
);

// --- (c) map-valued `schema` -> build fails with guidance pointing at the
// raw-JSON-string requirement. ---

const withMap = buildSite(['schema:', '  mainEntity:', '    - "@type": Question'].join('\n'));
assert.notStrictEqual(
  withMap.result.status,
  0,
  'Expected hugo build to fail when `schema` front matter is a map, not a raw JSON string.',
);
const combinedOutput = `${withMap.result.stdout}\n${withMap.result.stderr}`;
assert.ok(
  combinedOutput.includes('raw JSON string'),
  `Expected build error to mention "raw JSON string" guidance. Got:\n${combinedOutput}`,
);

// --- (d) regression: the theme's own JSON-LD (BlogPosting / WebSite) must
// still be present alongside the schema override. ---

assert.ok(
  scriptsA.some((s) => s['@type'] === 'BlogPosting'),
  'Expected the theme\'s own BlogPosting JSON-LD to still be present alongside the schema override.',
);
assert.ok(
  scriptsA.some((s) => s['@type'] === 'WebSite'),
  'Expected the theme\'s own WebSite JSON-LD to still be present alongside the schema override.',
);

console.log('✅ schema-override test passed (raw-JSON string override renders with case preserved, map-valued schema fails the build with guidance, theme JSON-LD untouched)');
