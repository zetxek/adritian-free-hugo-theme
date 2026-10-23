#!/usr/bin/env node
'use strict';

/**
 * Regression test for layouts/partials/contact.html's accessible names and
 * autocomplete attributes.
 *
 * On a default site (no shortcode parameters, no locale overrides), the
 * four contact-form controls (full_name, email, phone, message) rendered
 * with NO programmatic accessible name: no <label>, no aria-label, and an
 * empty placeholder (the contact_*_placeholder i18n keys it fell back to
 * don't exist in any locale file). The fix adds aria-label to each control,
 * falling back to the translated contact_form_name / contact_form_email /
 * contact_phone_title / contact_form_message keys (which DO exist in every
 * locale) when no placeholder value is available — mirroring how
 * newsletter.html labels its email input.
 *
 * It also covers WCAG 2.1 1.3.5 Identify Input Purpose (AA): full_name,
 * email and phone must carry a hardcoded autocomplete="name"/"email"/"tel",
 * while the free-form message textarea must carry none at all.
 *
 * Builds two standalone temp sites (own hugo.toml, classic --themesDir theme
 * import) and lets the theme's REAL templates render — no custom layout
 * override. Each site needs a content/home/home.md with `type: home`, since
 * layouts/_default/home.html only renders content of that type.
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

// Tolerant of Hugo's --minify stripping attribute-value quotes.
const ARIA_LABEL_RE = /aria-label=["']?([^"'>]*)["']?/;
const AUTOCOMPLETE_RE = /autocomplete=["']?([^"'>]*)["']?/;
const CONTROL_RE = /<(?:input[^>]*name=["']?(?:full_name|email|phone)["']?[^>]*|textarea[^>]*name=["']?message["']?[^>]*)>/g;

function extractAriaLabels(html) {
  const tags = html.match(CONTROL_RE) || [];
  return tags.map((tag) => {
    const m = ARIA_LABEL_RE.exec(tag);
    assert.ok(m, `Contact form control has no aria-label attribute at all: ${tag}`);
    return { tag, ariaLabel: m[1] };
  });
}

// Expects labels in full_name, email, phone, message order (as produced by
// extractAriaLabels). Returns the three input autocomplete values, and
// separately asserts the message textarea carries none at all.
function extractAutocomplete(labels) {
  const [nameTag, emailTag, phoneTag, messageTag] = labels.map((l) => l.tag);

  const autocompleteValues = [nameTag, emailTag, phoneTag].map((tag) => {
    const m = AUTOCOMPLETE_RE.exec(tag);
    assert.ok(m, `Contact form input has no autocomplete attribute at all: ${tag}`);
    return m[1];
  });

  assert.ok(
    !messageTag.includes('autocomplete='),
    `Expected message textarea to carry NO autocomplete attribute, got: ${messageTag}`,
  );

  return autocompleteValues;
}

function buildSite(siteLabel, shortcodeLine) {
  const tmpSite = fs.mkdtempSync(path.join(os.tmpdir(), 'contact-form-labels-'));
  const destDir = fs.mkdtempSync(path.join(os.tmpdir(), 'contact-form-labels-out-'));
  try {
    fs.writeFileSync(
      path.join(tmpSite, 'hugo.toml'),
      [
        "baseURL = 'http://localhost/'",
        "languageCode = 'en-us'",
        `title = 'Contact Form Labels Test - ${siteLabel}'`,
        `theme = '${themeName}'`,
        '',
      ].join('\n'),
    );

    fs.mkdirSync(path.join(tmpSite, 'content', 'home'), { recursive: true });

    fs.writeFileSync(
      path.join(tmpSite, 'content', 'home', 'home.md'),
      ['---', 'title: Home', 'type: home', '---', '', shortcodeLine, ''].join('\n'),
    );

    const result = spawnSync(
      'hugo',
      ['--themesDir', path.join(themeDir, '..'), '--destination', destDir, '--quiet'],
      { encoding: 'utf8', cwd: tmpSite },
    );

    assert.strictEqual(
      result.status,
      0,
      `hugo build failed for ${siteLabel} (exit ${result.status}).\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
    );

    return fs.readFileSync(path.join(destDir, 'index.html'), 'utf8');
  } finally {
    fs.rmSync(tmpSite, { recursive: true, force: true });
    fs.rmSync(destDir, { recursive: true, force: true });
  }
}

// --- Site A: no shortcode parameters -> localized defaults ---

const defaultHtml = buildSite('default', '{{< contact-section >}}');
const defaultLabels = extractAriaLabels(defaultHtml);

assert.strictEqual(
  defaultLabels.length,
  4,
  `Expected exactly 4 contact-form controls, found ${defaultLabels.length}. ` +
    'A broken selector could silently turn this test into a no-op.',
);

for (const { tag, ariaLabel } of defaultLabels) {
  assert.ok(
    ariaLabel && ariaLabel.trim().length > 0,
    `Expected a non-empty aria-label on default-site contact control, got "${ariaLabel}": ${tag}`,
  );
}

const defaultExpected = ['Full Name', 'Email Address', 'Phone Number', 'Type Your Message Here'];
const defaultActual = defaultLabels.map((l) => l.ariaLabel);

assert.deepStrictEqual(
  defaultActual,
  defaultExpected,
  `Expected default-site aria-labels ${JSON.stringify(defaultExpected)} (full_name, email, phone, message order), ` +
    `got ${JSON.stringify(defaultActual)}.`,
);

const defaultAutocompleteExpected = ['name', 'email', 'tel'];
const defaultAutocompleteActual = extractAutocomplete(defaultLabels);

assert.deepStrictEqual(
  defaultAutocompleteActual,
  defaultAutocompleteExpected,
  `Expected default-site autocomplete ${JSON.stringify(defaultAutocompleteExpected)} (full_name, email, phone order), ` +
    `got ${JSON.stringify(defaultAutocompleteActual)}.`,
);

// --- Site B: explicit shortcode parameters -> placeholder chain wins ---

const customShortcode =
  '{{< contact-section contact_form_name="Your name" contact_form_email="Your e-mail" ' +
  'contact_form_phone="Your phone" contact_form_message="Your text" >}}';

const customHtml = buildSite('custom', customShortcode);
const customLabels = extractAriaLabels(customHtml);

assert.strictEqual(
  customLabels.length,
  4,
  `Expected exactly 4 contact-form controls on the custom-parameter site, found ${customLabels.length}.`,
);

const customExpected = ['Your name', 'Your e-mail', 'Your phone', 'Your text'];
const customActual = customLabels.map((l) => l.ariaLabel);

assert.deepStrictEqual(
  customActual,
  customExpected,
  `Expected custom-parameter aria-labels ${JSON.stringify(customExpected)} (placeholder chain should win), ` +
    `got ${JSON.stringify(customActual)}.`,
);

const customAutocompleteExpected = ['name', 'email', 'tel'];
const customAutocompleteActual = extractAutocomplete(customLabels);

assert.deepStrictEqual(
  customAutocompleteActual,
  customAutocompleteExpected,
  `Expected custom-parameter autocomplete ${JSON.stringify(customAutocompleteExpected)} (full_name, email, phone order), ` +
    `got ${JSON.stringify(customAutocompleteActual)}.`,
);

console.log(
  '✅ contact-form-labels test passed (4 controls carry a non-empty aria-label, full_name/email/phone carry the correct ' +
    'hardcoded autocomplete value, the message textarea carries none, defaults and overrides both correct)',
);
