#!/usr/bin/env node
'use strict';

/**
 * Dry-run test for scripts/generate-favicon-ico.js
 *
 * Verifies that the script can be invoked, produces a valid .ico file,
 * and that the ICO magic bytes are correct.
 *
 * No browser or Hugo server required — suitable for CI/CD pre-build checks.
 */

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');
const { PNG } = require('pngjs');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a minimal 16×16 opaque red PNG in a temp directory. */
function createTestPng(dir) {
  const size = 16;
  const png = new PNG({ width: size, height: size });
  for (let i = 0; i < size * size; i++) {
    png.data[i * 4 + 0] = 255; // R
    png.data[i * 4 + 1] = 0;   // G
    png.data[i * 4 + 2] = 0;   // B
    png.data[i * 4 + 3] = 255; // A
  }
  const buf = PNG.sync.write(png);
  const pngPath = path.join(dir, 'test-favicon.png');
  fs.writeFileSync(pngPath, buf);
  return pngPath;
}

/** Return true if buffer starts with the ICO magic bytes (0x00 0x00 0x01 0x00). */
function hasIcoMagic(buf) {
  return buf.length >= 4 &&
    buf[0] === 0x00 &&
    buf[1] === 0x00 &&
    buf[2] === 0x01 &&
    buf[3] === 0x00;
}

// ---------------------------------------------------------------------------
// Test
// ---------------------------------------------------------------------------

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'favicon-test-'));
const scriptPath = path.resolve(__dirname, '../../scripts/generate-favicon-ico.js');
const pngSource = createTestPng(tmpDir);
const icoOutput = path.join(tmpDir, 'favicon.ico');

try {
  const result = spawnSync(
    process.execPath,
    [scriptPath, '--source', pngSource, '--output', icoOutput, '--size', '16'],
    { encoding: 'utf8' },
  );

  // Script must exit cleanly
  assert.strictEqual(
    result.status,
    0,
    `Script exited with code ${result.status}.\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
  );

  // Output file must exist
  assert.ok(fs.existsSync(icoOutput), `Output file not found: ${icoOutput}`);

  // Output file must have non-zero size
  const { size } = fs.statSync(icoOutput);
  assert.ok(size > 0, 'Output .ico file is empty');

  // Output file must start with ICO magic bytes
  const buf = fs.readFileSync(icoOutput);
  assert.ok(hasIcoMagic(buf), `File does not start with ICO magic bytes. First 4 bytes: ${[...buf.slice(0, 4)]}`);

  console.log('✅ generate-favicon-ico.js test passed');
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}
