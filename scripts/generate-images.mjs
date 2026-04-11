#!/usr/bin/env node
/**
 * Generates the branded OG image, app icons, and favicon from a single source
 * profile photo + brand palette. Re-run any time the source photo changes or
 * the brand colors move.
 *
 *   node scripts/generate-images.mjs
 *
 * Source:  public/george_khananaev_ws.png  (1854×2102)
 * Outputs:
 *   public/og-image.png         1200×630   social share banner (indigo brand)
 *   public/icon-512.png          512×512   PWA icon
 *   public/icon-192.png          192×192   PWA icon
 *   public/apple-touch-icon.png  180×180   iOS home-screen icon
 *   public/favicon.ico           16+32+48  GK monogram on indigo gradient
 */

import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SOURCE = path.join(PUBLIC_DIR, 'george_khananaev_ws.png');

// Brand palette — matches Tailwind indigo shades used across the site
const INDIGO_700 = '#4338ca';
const INDIGO_500 = '#6366f1';
const INDIGO_400 = '#818cf8';
const INDIGO_300 = '#a5b4fc';
const NEUTRAL_950 = '#0a0a0a';
const INDIGO_950 = '#1e1b4b';

/**
 * Top-aligned square crop of the face from the source portrait. The source
 * image is 1854×2102 (portrait) — cropping a 1854×1854 square from y=0
 * keeps the face + shoulders and drops the extra bottom third.
 */
async function cropSquare(size) {
    const src = await sharp(SOURCE).metadata();
    const squareSize = Math.min(src.width, src.height);
    return sharp(SOURCE)
        .extract({left: 0, top: 0, width: squareSize, height: squareSize})
        .resize(size, size, {fit: 'cover'});
}

async function generateIcons() {
    const icons = [
        {name: 'icon-512.png', size: 512},
        {name: 'icon-192.png', size: 192},
        {name: 'apple-touch-icon.png', size: 180},
    ];

    for (const {name, size} of icons) {
        const pipeline = await cropSquare(size);
        await pipeline.png({compressionLevel: 9}).toFile(path.join(PUBLIC_DIR, name));
        console.log(`  icons  ${name.padEnd(22)} ${size}×${size}`);
    }
}

async function generateOgImage() {
    const WIDTH = 1200;
    const HEIGHT = 630;
    const PHOTO_SIZE = 430;
    const PHOTO_X = WIDTH - PHOTO_SIZE - 75;
    const PHOTO_Y = Math.round((HEIGHT - PHOTO_SIZE) / 2);

    // 1) Profile photo, face-cropped + masked to a circle
    const photoSquare = await (await cropSquare(PHOTO_SIZE)).png().toBuffer();
    const circleMask = Buffer.from(
        `<svg width="${PHOTO_SIZE}" height="${PHOTO_SIZE}" xmlns="http://www.w3.org/2000/svg">` +
        `<circle cx="${PHOTO_SIZE / 2}" cy="${PHOTO_SIZE / 2}" r="${PHOTO_SIZE / 2}" fill="white"/>` +
        `</svg>`,
    );
    const circularPhoto = await sharp(photoSquare)
        .composite([{input: circleMask, blend: 'dest-in'}])
        .png()
        .toBuffer();

    // 2) Indigo ring rendered as its own SVG so we can sit it behind the photo
    const ringSize = PHOTO_SIZE + 28;
    const ringSvg = Buffer.from(
        `<svg width="${ringSize}" height="${ringSize}" xmlns="http://www.w3.org/2000/svg">` +
        `<circle cx="${ringSize / 2}" cy="${ringSize / 2}" r="${ringSize / 2 - 3}" ` +
        `fill="none" stroke="${INDIGO_400}" stroke-width="5" stroke-opacity="0.55"/>` +
        `</svg>`,
    );

    // 3) Background — dark gradient + editorial grid mesh + indigo radial glow
    //    behind the photo + all the typography (pill, name, subtitle, URL).
    const backgroundSvg = Buffer.from(
        `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${NEUTRAL_950}"/>
      <stop offset="55%" stop-color="${INDIGO_950}"/>
      <stop offset="100%" stop-color="${NEUTRAL_950}"/>
    </linearGradient>
    <radialGradient id="glow" cx="72%" cy="50%" r="42%">
      <stop offset="0%" stop-color="${INDIGO_500}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${INDIGO_500}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" stroke-width="1" opacity="0.04"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Eyebrow pill -->
  <g transform="translate(70, 110)">
    <rect x="0" y="0" width="302" height="44" rx="22"
          fill="${INDIGO_500}" fill-opacity="0.14"
          stroke="${INDIGO_400}" stroke-opacity="0.45" stroke-width="1"/>
    <text x="151" y="29"
          font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size="14" font-weight="700" letter-spacing="2.8"
          fill="${INDIGO_300}" text-anchor="middle">FULL STACK DEVELOPER</text>
  </g>

  <!-- Name (two lines, tight) -->
  <text x="70" y="248"
        font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="78" font-weight="800" fill="white">George</text>
  <text x="70" y="328"
        font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="78" font-weight="800" fill="white">Khananaev</text>

  <!-- Subtitle -->
  <text x="70" y="388"
        font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="26" font-weight="500" fill="${INDIGO_300}">Head of Development · Bangkok</text>

  <!-- Tech line -->
  <text x="70" y="426"
        font-family="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="20" font-weight="400" fill="#a3a3a3">Python · TypeScript · Swift · AI &amp; LLMs</text>

  <!-- URL pill -->
  <g transform="translate(70, 520)">
    <rect x="0" y="0" width="310" height="44" rx="22"
          fill="white" fill-opacity="0.05"
          stroke="white" stroke-opacity="0.14" stroke-width="1"/>
    <text x="22" y="29"
          font-family="'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace"
          font-size="17" font-weight="600" fill="${INDIGO_300}">→ george.khananaev.com</text>
  </g>
</svg>`,
    );

    // 4) Composite in z-order: background → ring → circular photo
    await sharp(backgroundSvg)
        .composite([
            {input: ringSvg, left: PHOTO_X - 14, top: PHOTO_Y - 14},
            {input: circularPhoto, left: PHOTO_X, top: PHOTO_Y},
        ])
        .png({compressionLevel: 9})
        .toFile(path.join(PUBLIC_DIR, 'og-image.png'));

    console.log(`  og     og-image.png           ${WIDTH}×${HEIGHT}`);
}

/**
 * Packs one or more PNG buffers into a single `favicon.ico` container.
 *
 * Format reference: https://en.wikipedia.org/wiki/ICO_(file_format)
 *   - 6-byte ICONDIR header
 *   - 16-byte ICONDIRENTRY per image
 *   - PNG payload for each image (all modern browsers support PNG-in-ICO)
 *
 * Kept inline so the script pulls no extra npm dependencies.
 */
function packIco(pngs) {
    const count = pngs.length;
    const headerSize = 6 + count * 16;

    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // image type: 1 = icon
    header.writeUInt16LE(count, 4);

    const entries = [];
    let offset = headerSize;

    for (const png of pngs) {
        // PNG width/height live in bytes 16–23 as big-endian uint32s.
        const width = png.readUInt32BE(16);
        const height = png.readUInt32BE(20);

        const entry = Buffer.alloc(16);
        entry.writeUInt8(width >= 256 ? 0 : width, 0); // 0 means 256
        entry.writeUInt8(height >= 256 ? 0 : height, 1);
        entry.writeUInt8(0, 2); // color palette (0 for non-paletted)
        entry.writeUInt8(0, 3); // reserved
        entry.writeUInt16LE(1, 4); // color planes
        entry.writeUInt16LE(32, 6); // bits per pixel
        entry.writeUInt32LE(png.length, 8); // image byte size
        entry.writeUInt32LE(offset, 12); // image offset from start of file
        entries.push(entry);

        offset += png.length;
    }

    return Buffer.concat([header, ...entries, ...pngs]);
}

/**
 * Dark favicon with a ligature-style "GK" mark. Boutique ligature fonts
 * (Mickon, Chuterolk, Reval) aren't free / aren't installed on macOS, so we
 * use Futura Condensed ExtraBold — a genuinely chunky geometric face that
 * ships with macOS — plus a small indigo underline accent that visually ties
 * the two letters together the way a real ligature would.
 *
 *   background    neutral-950 with indigo radial glow behind the mark
 *   no border     comfortable corner margin via fontSize instead
 *   font          Futura Condensed ExtraBold (macOS) → Futura Bold →
 *                 Oswald → Impact → sans-serif
 *   accent        indigo-300 underline under the letters, width matches the mark
 *   fontSize      ≈ 66% leaves a breathing margin but the mark stays prominent
 *   baseline      midline + fontSize × 0.32
 */
function monogramSvg(size) {
    const fontSize = Math.round(size * 0.66);
    const radius = Math.round(size * 0.2);
    const letterSpacing = -(size * 0.03).toFixed(2);
    const baselineY = (size * 0.5 + fontSize * 0.32).toFixed(2);
    // Underline accent geometry — sits just below the letters, centered.
    const underlineY = Number(baselineY) + size * 0.08;
    const underlineW = size * 0.38;
    const underlineX = (size - underlineW) / 2;
    const underlineH = Math.max(1, size * 0.04);

    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="${NEUTRAL_950}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="55%" r="55%">
      <stop offset="0%" stop-color="${INDIGO_500}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${INDIGO_500}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="url(#glow)"/>
  <text x="50%" y="${baselineY}"
        font-family="'Futura', 'Futura Bold', 'Oswald', 'Impact', 'Helvetica Neue', sans-serif"
        font-size="${fontSize}" font-weight="900" font-stretch="condensed" letter-spacing="${letterSpacing}"
        fill="white" text-anchor="middle">GK</text>
  <rect x="${underlineX}" y="${underlineY}" width="${underlineW}" height="${underlineH}" rx="${underlineH / 2}" fill="${INDIGO_300}"/>
</svg>`;
}

async function generateFavicon() {
    // Render each ICO-packed size from its own same-size SVG so text rendering
    // stays crisp. Using one 512 source downscaled to 16 works but the letter
    // spacing drifts at tiny sizes.
    const sizes = [16, 32, 48];
    const pngs = [];

    for (const size of sizes) {
        const png = await sharp(Buffer.from(monogramSvg(size)))
            .resize(size, size)
            .png({compressionLevel: 9})
            .toBuffer();
        pngs.push(png);
    }

    const ico = packIco(pngs);
    await writeFile(path.join(PUBLIC_DIR, 'favicon.ico'), ico);
    console.log(`  favicon  favicon.ico            ${sizes.join(' + ')} px`);
}

async function main() {
    console.log('');
    console.log('Generating images from', path.relative(ROOT, SOURCE));
    console.log('─'.repeat(55));
    await generateIcons();
    await generateOgImage();
    await generateFavicon();
    console.log('─'.repeat(55));
    console.log('Done.');
    console.log('');
}

main().catch(err => {
    console.error('Error generating images:', err);
    process.exit(1);
});
