#!/usr/bin/env node
'use strict';

/**
 * Regression test: exampleSite content must not declare its own page-level
 * `<h1>` in the body.
 *
 * `layouts/_default/single.html` already renders the page title as the page's
 * single `<h1>` (`<h1 id=blog-post-title>`). A markdown ATX h1 — or a setext
 * `===` h1 — in the body therefore renders a *second*, visually identical
 * heading directly below the title: an invalid heading structure for
 * assistive tech and a duplicated top-level heading for search engines.
 *
 * Measured before the fix on `exampleSite/content/blog/new-icons.md`:
 * `/blog/new-icons/` contained
 *   <h1 id=blog-post-title><a href=/blog/new-icons/>How to Add Custom Icons…</a></h1>
 *   <h1 id=how-to-add-custom-icons-to-the-adritian-theme>How to Add Custom Icons…</h1>
 *
 * exampleSite is the source of truth for the demo site (every push to main
 * mirrors it into zetxek/adritian-demo), so a duplicate heading here also
 * ships to the demo, and the example content is what users copy when they
 * start their own site. Body sections must start at `##`; the page heading
 * comes from the template.
 *
 * Front matter and fenced/indented code blocks are skipped: the guides
 * legitimately show `# comments` and `# Heading 1` inside code fences.
 *
 * No browser required — suitable for CI/CD pre-e2e checks.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const themeDir = path.resolve(__dirname, '../..');
const contentDir = path.join(themeDir, 'exampleSite', 'content');

/** Recursively collect every markdown content file under `dir`. */
function collectMarkdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectMarkdownFiles(entryPath);
    }
    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

/** Drop `+++` (TOML) or `---` (YAML) front matter from the top of a file. */
function stripFrontMatter(text) {
  const lines = text.split('\n');
  const first = lines[0].trim();
  if (first !== '+++' && first !== '---') {
    return { lines, offset: 0 };
  }
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === first);
  return end === -1 ? { lines, offset: 0 } : { lines: lines.slice(end + 1), offset: end + 1 };
}

/**
 * Body-level h1s of one markdown file: ATX (`# Heading`) and setext
 * (`Heading` + `===` underline), outside front matter, fenced code (``` or
 * ~~~), indented code (4+ spaces — CommonMark treats an indented heading as
 * code) and block quotes.
 */
function findBodyH1s(file) {
  const { lines, offset } = stripFrontMatter(fs.readFileSync(file, 'utf8'));
  const offenders = [];
  let fence = null;

  lines.forEach((rawLine, index) => {
    const lineNumber = index + offset + 1;
    const trimmed = rawLine.trim();

    // Fenced code blocks: opening and closing markers use the same character.
    const fenceMatch = /^(`{3,}|~{3,})/.exec(trimmed);
    if (fence) {
      if (fenceMatch && fenceMatch[1][0] === fence) {
        fence = null;
      }
      return;
    }
    if (fenceMatch) {
      fence = fenceMatch[1][0];
      return;
    }

    // Indented code blocks and block quotes cannot contain a page heading.
    if (/^(?: {4,}|\t)/.test(rawLine) || trimmed.startsWith('>')) {
      return;
    }

    if (/^#(?!#)\s+\S/.test(trimmed)) {
      offenders.push({ lineNumber, text: trimmed });
      return;
    }

    // Setext h1: a non-empty text line underlined with `=`.
    if (/^=+\s*$/.test(trimmed)) {
      const previous = lines[index - 1];
      if (previous && previous.trim() !== '' && !/^=+\s*$/.test(previous.trim())) {
        offenders.push({ lineNumber, text: `${previous.trim()}  (setext underline at line ${lineNumber})` });
      }
    }
  });

  return offenders;
}

const files = collectMarkdownFiles(contentDir);

// Guard the guard: a broken path/glob must not turn this test into a no-op.
assert.ok(
  files.length >= 40,
  `Expected to scan the exampleSite content (>= 40 markdown files), found ${files.length} in ${contentDir}`,
);

const failures = files
  .map((file) => ({ file: path.relative(themeDir, file), offenders: findBodyH1s(file) }))
  .filter(({ offenders }) => offenders.length > 0);

assert.strictEqual(
  failures.length,
  0,
  [
    'exampleSite content defines its own page-level <h1>, which duplicates the',
    'page title rendered by layouts/_default/single.html. Demote these headings',
    'to `##` or remove them if they repeat the title:',
    ...failures.map(
      ({ file, offenders }) =>
        `\n  ${file}\n${offenders.map(({ lineNumber, text }) => `    line ${lineNumber}: ${text}`).join('\n')}`,
    ),
  ].join('\n'),
);

console.log(
  `✅ content-page-heading test passed (no body-level h1 in ${files.length} exampleSite content files)`,
);
