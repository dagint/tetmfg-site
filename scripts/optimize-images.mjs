#!/usr/bin/env node
/**
 * Optimize images for web use - resize, convert to WebP, and compress
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename } from 'path';

const SOURCE_DIR = '/mnt/c/Users/dagin/Downloads';
const DEST_EQUIPMENT = 'public/images/equipment';
const DEST_PORTFOLIO = 'public/images/portfolio';

// Image optimization settings
const FULL_SIZE_WIDTH = 1200;
const THUMB_WIDTH = 400;
const QUALITY = 85;

// Ensure directories exist
async function ensureDir(dir) {
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

// Optimize a single image
async function optimizeImage(inputPath, outputDir, filename, isEquipment = false) {
  const baseName = basename(filename, '.jpg');

  console.log(`\n📸 Processing ${filename}...`);

  // Full size WebP
  const fullPath = join(outputDir, `${baseName}.webp`);
  await sharp(inputPath)
    .resize(FULL_SIZE_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(fullPath);

  const fullStats = await sharp(fullPath).metadata();
  console.log(`  ✅ Full size: ${fullStats.width}x${fullStats.height} → ${fullPath}`);

  // Thumbnail WebP
  const thumbPath = join(outputDir, `${baseName}-thumb.webp`);
  await sharp(inputPath)
    .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(thumbPath);

  const thumbStats = await sharp(thumbPath).metadata();
  console.log(`  ✅ Thumbnail: ${thumbStats.width}x${thumbStats.height} → ${thumbPath}`);

  // Also keep original JPG optimized (for fallback)
  const jpgPath = join(outputDir, `${baseName}.jpg`);
  await sharp(inputPath)
    .resize(FULL_SIZE_WIDTH, null, { withoutEnlargement: true })
    .jpeg({ quality: QUALITY })
    .toFile(jpgPath);

  console.log(`  ✅ JPG fallback → ${jpgPath}`);
}

async function main() {
  console.log('🚀 Starting image optimization...\n');

  // Ensure output directories exist
  await ensureDir(DEST_EQUIPMENT);
  await ensureDir(DEST_PORTFOLIO);

  // Process equipment image (img1)
  console.log('📦 Processing equipment images...');
  const img1 = join(SOURCE_DIR, 'tet-img1.jpg');
  if (existsSync(img1)) {
    await optimizeImage(img1, DEST_EQUIPMENT, 'mazak-megaturn-1600.jpg', true);
  }

  // Process portfolio images (img2-8)
  console.log('\n📦 Processing portfolio images...');
  for (let i = 2; i <= 8; i++) {
    const imgPath = join(SOURCE_DIR, `tet-img${i}.jpg`);
    if (existsSync(imgPath)) {
      await optimizeImage(imgPath, DEST_PORTFOLIO, `work-sample-${i}.jpg`);
    }
  }

  console.log('\n✨ Image optimization complete!');
  console.log(`\nEquipment images: ${DEST_EQUIPMENT}`);
  console.log(`Portfolio images: ${DEST_PORTFOLIO}`);
}

main().catch(console.error);
