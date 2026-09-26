const assert = require('node:assert');
const test = require('node:test');
const { computePairLayout, computeTriptychLayout } = require('../../scripts/lib/composite-layout.js');

test('computePairLayout joins two 1280x800 panels with a 16px gutter', () => {
  const layout = computePairLayout({ width: 1280, height: 800, gutter: 16 });
  assert.strictEqual(layout.totalWidth, 1280 + 16 + 1280);
  assert.strictEqual(layout.totalHeight, 800);
  assert.deepStrictEqual(layout.leftPosition, { left: 0, top: 0 });
  assert.deepStrictEqual(layout.rightPosition, { left: 1280 + 16, top: 0 });
});

test('computeTriptychLayout joins three panels with no gutter', () => {
  const layout = computeTriptychLayout({ panelWidth: 1280, panelHeight: 800 });
  assert.strictEqual(layout.totalWidth, 1280 * 3);
  assert.strictEqual(layout.totalHeight, 800);
  assert.deepStrictEqual(layout.positions, [
    { left: 0, top: 0 },
    { left: 1280, top: 0 },
    { left: 2560, top: 0 },
  ]);
});

test('computeTriptychLayout respects a downscale targetWidth', () => {
  const layout = computeTriptychLayout({ panelWidth: 1280, panelHeight: 800, targetWidth: 1500 });
  assert.strictEqual(layout.totalWidth, 1280 * 3);
  assert.strictEqual(layout.totalHeight, 800);
  assert.strictEqual(layout.targetWidth, 1500);
  assert.strictEqual(layout.targetHeight, Math.round(800 * (1500 / (1280 * 3))));
});
