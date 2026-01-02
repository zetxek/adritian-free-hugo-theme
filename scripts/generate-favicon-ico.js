#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const pngToIco = require('png-to-ico');
const { PNG } = require('pngjs');
const { readPNG, resize } = require('png-to-ico/lib/png');

const args = process.argv.slice(2);
const getArgValue = (flag) => {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] || null;
};

const sourcePath = path.resolve(
  getArgValue('--source') || path.join(__dirname, '../assets/icons/favicon.png')
);
const outputPath = path.resolve(
  getArgValue('--output') || path.join(__dirname, '../static/favicon.ico')
);
const sizeArg = getArgValue('--size');
const targetSize = sizeArg ? parseInt(sizeArg, 10) : 16;

async function generateIco() {
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️  Favicon source not found: ${sourcePath}`);
    process.exit(0);
  }

  try {
    const png = await readPNG(sourcePath);
    const size = Number.isFinite(targetSize) && targetSize > 0 ? targetSize : 16;
    const resized = resize(png, size, size);
    const resizedBuffer = PNG.sync.write(resized);
    const icoBuffer = await pngToIco([resizedBuffer]);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, icoBuffer);
    console.log(`✅ favicon.ico (${size}x${size}) generated at ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate favicon.ico:', error);
    process.exit(1);
  }
}

generateIco();
