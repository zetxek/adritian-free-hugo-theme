#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pngToIco from 'png-to-ico';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const sourceBuffer = fs.readFileSync(sourcePath);
    const png = PNG.sync.read(sourceBuffer);
    const size = Number.isFinite(targetSize) && targetSize > 0 ? targetSize : 16;
    const resized = new PNG({ width: size, height: size });
    for (let y = 0; y < size; y += 1) {
      const srcY = Math.floor((y * png.height) / size);
      for (let x = 0; x < size; x += 1) {
        const srcX = Math.floor((x * png.width) / size);
        const srcIdx = (png.width * srcY + srcX) << 2;
        const dstIdx = (size * y + x) << 2;
        resized.data[dstIdx] = png.data[srcIdx];
        resized.data[dstIdx + 1] = png.data[srcIdx + 1];
        resized.data[dstIdx + 2] = png.data[srcIdx + 2];
        resized.data[dstIdx + 3] = png.data[srcIdx + 3];
      }
    }
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
