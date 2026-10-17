/**
 * v1.40 — Generates the FREYRAUM Editor app icon (desktop/build-resources/icon.png,
 * 1024 × 1024) without extra dependencies. electron-builder converts it into
 * the Windows .ico and the macOS .icns.
 *
 * Design follows the gallery branding: the dark brand colour (#12171b), the
 * light museum wall grey (#c7ced4 → #eef1f3) and a bold "F" inside a picture
 * frame. Run: node desktop/scripts/make-icon.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const SIZE = 1024;
const SAMPLES = 4; // 4 × 4 supersampling for smooth edges
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'build-resources', 'icon.png');

const DARK = [18, 23, 27];
const WALL_TOP = [238, 241, 243];
const WALL_BOTTOM = [199, 206, 212];

/** Signed distance to a rounded rectangle (negative inside). */
function roundedRect(x, y, left, top, right, bottom, radius) {
  const cx = (left + right) / 2;
  const cy = (top + bottom) / 2;
  const hx = (right - left) / 2 - radius;
  const hy = (bottom - top) / 2 - radius;
  const dx = Math.max(Math.abs(x - cx) - hx, 0);
  const dy = Math.max(Math.abs(y - cy) - hy, 0);
  const inside = Math.min(Math.max(Math.abs(x - cx) - hx, Math.abs(y - cy) - hy), 0);
  return Math.hypot(dx, dy) + inside - radius;
}

const inRect = (x, y, left, top, right, bottom) => x >= left && x < right && y >= top && y < bottom;

/** Colour (RGBA) of one sample point. */
function sample(x, y) {
  // Rounded app tile (macOS-style margin so the icon does not look oversized).
  if (roundedRect(x, y, 64, 64, 960, 960, 200) > 0) return [0, 0, 0, 0];
  const t = (y - 64) / 896;
  const wall = WALL_TOP.map((top, i) => Math.round(top + (WALL_BOTTOM[i] - top) * t));
  // Picture frame: dark outer frame, light passe-partout, dark "F".
  const frameOuter = roundedRect(x, y, 232, 192, 792, 832, 18);
  if (frameOuter > 0) {
    // Soft shadow under the frame.
    const shadow = roundedRect(x, y - 18, 232, 192, 792, 832, 18);
    if (shadow < 30) {
      const k = Math.max(0, Math.min(1, (30 - shadow) / 30)) * 0.22;
      return [...wall.map((c) => Math.round(c * (1 - k))), 255];
    }
    return [...wall, 255];
  }
  if (roundedRect(x, y, 276, 236, 748, 788, 6) > 0) return [...DARK, 255];
  // Bold geometric "F".
  const f =
    inRect(x, y, 392, 340, 468, 684) // stem
    || inRect(x, y, 392, 340, 640, 410) // top bar
    || inRect(x, y, 392, 482, 592, 548); // middle bar
  return f ? [...DARK, 255] : [250, 250, 248, 255];
}

const rowBytes = 1 + SIZE * 4;
const raw = Buffer.alloc(rowBytes * SIZE);
for (let py = 0; py < SIZE; py += 1) {
  raw[py * rowBytes] = 0;
  for (let px = 0; px < SIZE; px += 1) {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (let sy = 0; sy < SAMPLES; sy += 1) {
      for (let sx = 0; sx < SAMPLES; sx += 1) {
        const [cr, cg, cb, ca] = sample(px + (sx + 0.5) / SAMPLES, py + (sy + 0.5) / SAMPLES);
        r += cr * ca;
        g += cg * ca;
        b += cb * ca;
        a += ca;
      }
    }
    const offset = py * rowBytes + 1 + px * 4;
    raw[offset] = a ? Math.round(r / a) : 0;
    raw[offset + 1] = a ? Math.round(g / a) : 0;
    raw[offset + 2] = a ? Math.round(b / a) : 0;
    raw[offset + 3] = Math.round(a / (SAMPLES * SAMPLES));
  }
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buffer) => {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const sum = Buffer.alloc(4);
  sum.writeUInt32BE(crc(body));
  return Buffer.concat([length, body, sum]);
};
const header = Buffer.alloc(13);
header.writeUInt32BE(SIZE, 0);
header.writeUInt32BE(SIZE, 4);
header[8] = 8; // bit depth
header[9] = 6; // RGBA

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  Buffer.concat([
    Buffer.from('89504e470d0a1a0a', 'hex'),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
);
console.log(`✓ Wrote ${out}`);
