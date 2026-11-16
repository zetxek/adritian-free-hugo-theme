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
 * It also runs a static census: every `i18n "key"` / `T "key"` literal
 * referenced from layouts/** must be defined in at least one i18n/*.yaml
 * locale, except for an explicit allowlist of intentional site-override
 * hooks. A lookup that names a key no locale defines renders as an empty
 * string — e.g. contact.html once rendered an empty submit button and three
 * empty <h3> headings because its fallbacks named drifted keys.
 *
 * No browser required — suitable for CI/CD pre-e2e checks.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');

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

  // --- Static census: every key referenced from layouts/ is defined somewhere ---

  // Keys deliberately left undefined in the theme: a site may define them in
  // its own i18n/ to opt in, and the templates fall back gracefully if not.
  const ALLOWED_UNDEFINED_KEYS = new Set([
    'contact_name_placeholder', // sites may define it to customise the contact-form name placeholder
    'contact_email_placeholder', // sites may define it to customise the contact-form email placeholder
    'contact_phone_placeholder', // sites may define it to customise the contact-form phone placeholder
    'contact_message_placeholder', // sites may define it to customise the contact-form message placeholder
    'theme_auto_short', // hook inside an aria-hidden="true" d-none icon span of the theme switcher
    'theme_dark_short', // hook inside an aria-hidden="true" d-none icon span of the theme switcher
    'theme_light_short', // hook inside an aria-hidden="true" d-none icon span of the theme switcher
    'experience_description', // intro-description override a site can translate
    'contact_button_text', // legacy name kept as a site override above contact_button
    'contact_phone_heading', // legacy name kept as a site override above contact_phone_title
    'contact_email_heading', // legacy name kept as a site override above contact_email_title
    'contact_location_heading', // legacy name kept as a site override above contact_address_title
  ]);

  // Keys contact.html falls back to for its submit button and contact-info
  // headings. Every locale must define them, or that locale renders them empty.
  const CONTACT_FALLBACK_KEYS = [
    'contact_button',
    'contact_phone_title',
    'contact_email_title',
    'contact_address_title',
  ];

  const EXPECTED_LOCALE_FILES = [
    'ar.yaml', 'da.yaml', 'de.yaml', 'en.yaml', 'es.yaml', 'fr.yaml', 'he.yaml',
    'it.yaml', 'ko.yaml', 'nl.yaml', 'no.yaml', 'pl.yaml', 'pt.yaml', 'sv.yaml',
  ];

  function walk(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      return entry.isDirectory() ? walk(full) : [full];
    });
  }

  // Go templates accept both "interpreted" and `raw` string literals.
  function lookupKeys(source) {
    return [...source.matchAll(/\b(?:i18n|T)\s+(?:"([^"]+)"|`([^`]+)`)/g)].map((m) => m[1] || m[2]);
  }

  assert.deepStrictEqual(
    lookupKeys('{{ i18n "quoted_key" }} {{ T `raw_key` }} {{ i18n `raw_key_2` | default "x" }}'),
    ['quoted_key', 'raw_key', 'raw_key_2'],
    'The lookup census must recognise both "quoted" and `raw` i18n keys.',
  );

  const referencedKeys = new Set();
  for (const file of walk(path.join(themeDir, 'layouts'))) {
    for (const key of lookupKeys(fs.readFileSync(file, 'utf8'))) {
      referencedKeys.add(key);
    }
  }

  const i18nDir = path.join(themeDir, 'i18n');
  const localeFiles = fs.readdirSync(i18nDir).filter((f) => f.endsWith('.yaml')).sort();
  const definedKeys = new Set();
  const keysByLocale = new Map();
  for (const file of localeFiles) {
    // Parse as YAML so quoted and unquoted keys are both recognised.
    const parsed = yaml.load(fs.readFileSync(path.join(i18nDir, file), 'utf8')) || {};
    assert.ok(
      typeof parsed === 'object' && !Array.isArray(parsed),
      `Expected i18n/${file} to be a flat key-value map, got ${Array.isArray(parsed) ? 'an array' : typeof parsed}.`,
    );
    const keys = new Set(Object.keys(parsed));
    keysByLocale.set(file, keys);
    for (const key of keys) definedKeys.add(key);
  }

  assert.ok(
    referencedKeys.size > 90,
    `Expected the layouts/ census to find more than 90 referenced i18n keys, found ${referencedKeys.size}. ` +
      'A broken walk or regex could silently turn this guard into a no-op.',
  );
  assert.deepStrictEqual(
    localeFiles,
    EXPECTED_LOCALE_FILES,
    `Expected exactly these i18n/*.yaml locale files: ${JSON.stringify(EXPECTED_LOCALE_FILES)}, ` +
      `found ${JSON.stringify(localeFiles)}. Update EXPECTED_LOCALE_FILES when adding or removing a locale.`,
  );

  const missingContactKeys = [];
  for (const [file, keys] of keysByLocale) {
    for (const key of CONTACT_FALLBACK_KEYS) {
      if (!keys.has(key)) missingContactKeys.push(`${file}:${key}`);
    }
  }
  assert.deepStrictEqual(
    missingContactKeys,
    [],
    `Every locale must define the contact.html fallback keys; missing: ${missingContactKeys.join(', ')}.`,
  );

  const undefinedKeys = [...referencedKeys]
    .filter((key) => !definedKeys.has(key) && !ALLOWED_UNDEFINED_KEYS.has(key))
    .sort();

  assert.deepStrictEqual(
    undefinedKeys,
    [],
    `layouts/ references i18n keys that no i18n/*.yaml locale defines: ${undefinedKeys.join(', ')}. ` +
      'They render as an empty string. Fix the key name, add it to the locales, or (if it is an ' +
      'intentional site-override hook) add it to ALLOWED_UNDEFINED_KEYS with a reason.',
  );

  console.log(
    `✅ i18n-format test passed (theme i18n/*.yaml resolves correctly in a standalone site; all ${referencedKeys.size} ` +
      `keys referenced from layouts/ are defined in one of ${localeFiles.length} locales or allowlisted)`,
  );
} finally {
  fs.rmSync(tmpSite, { recursive: true, force: true });
}
