/**
 * Image Optimization Script
 * บีบอัดรูปภาพทุกรูปใน public/img ให้เล็กลงและ efficient ขึ้น
 * ใช้ sharp library ที่ติดตั้งมากับ Next.js อยู่แล้ว
 *
 * Usage: node scripts/optimize-images.mjs
 */

import sharp from "sharp";
import { readdir, stat, rename } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, "..", "public");

const JPEG_QUALITY = 80; // 80 = คุณภาพดี ขนาดเล็ก
const PNG_QUALITY = 80;
const WEBP_QUALITY = 82;

let totalOriginal = 0;
let totalOptimized = 0;
let fileCount = 0;

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

async function optimizeImage(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return;

  const originalStat = await stat(filePath);
  const originalSize = originalStat.size;

  const tmpPath = filePath + ".tmp";

  try {
    const image = sharp(filePath);
    const meta = await image.metadata();

    if (ext === ".jpg" || ext === ".jpeg") {
      await image
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true })
        .toFile(tmpPath);
    } else if (ext === ".png") {
      await image
        .png({ quality: PNG_QUALITY, compressionLevel: 9 })
        .toFile(tmpPath);
    } else if (ext === ".webp") {
      await image.webp({ quality: WEBP_QUALITY }).toFile(tmpPath);
    }

    const newStat = await stat(tmpPath);
    const newSize = newStat.size;

    // Only replace if actually smaller
    if (newSize < originalSize) {
      await rename(tmpPath, filePath);
      const saved = originalSize - newSize;
      const pct = ((saved / originalSize) * 100).toFixed(1);
      console.log(
        `✅ ${basename(filePath).padEnd(30)} ${formatBytes(originalSize).padStart(10)} → ${formatBytes(newSize).padStart(10)}  (ลด ${pct}%)`
      );
      totalOriginal += originalSize;
      totalOptimized += newSize;
    } else {
      // Already optimized, remove tmp
      const { unlink } = await import("fs/promises");
      await unlink(tmpPath);
      console.log(
        `⏭️  ${basename(filePath).padEnd(30)} ${formatBytes(originalSize).padStart(10)}  (ขนาดเล็กสุดแล้ว)`
      );
      totalOriginal += originalSize;
      totalOptimized += originalSize;
    }
    fileCount++;
  } catch (err) {
    console.error(`❌ Error optimizing ${filePath}:`, err.message);
    try {
      const { unlink } = await import("fs/promises");
      await unlink(tmpPath).catch(() => {});
    } catch {}
  }
}

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkDir(fullPath);
    } else {
      await optimizeImage(fullPath);
    }
  }
}

console.log("🚀 เริ่มบีบอัดรูปภาพใน public/img ...\n");
console.log("=".repeat(70));

await walkDir(join(PUBLIC_DIR, "img"));

// Also optimize root public PNGs
const rootFiles = await readdir(PUBLIC_DIR, { withFileTypes: true });
for (const f of rootFiles) {
  if (!f.isDirectory()) {
    const ext = extname(f.name).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      await optimizeImage(join(PUBLIC_DIR, f.name));
    }
  }
}

console.log("=".repeat(70));
console.log(`\n📊 สรุป:`);
console.log(`   ไฟล์ที่ประมวลผล : ${fileCount} ไฟล์`);
console.log(`   ขนาดเดิม        : ${formatBytes(totalOriginal)}`);
console.log(`   ขนาดหลังบีบ     : ${formatBytes(totalOptimized)}`);
console.log(
  `   ประหยัดได้      : ${formatBytes(totalOriginal - totalOptimized)} (${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%)`
);
console.log("\n✨ เสร็จแล้ว! รูปภาพทุกรูปถูกบีบอัดแล้ว");
