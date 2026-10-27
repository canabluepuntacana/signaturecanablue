import { deflateSync } from 'node:zlib';
import qrcode from '../assets/qrcode.min.js';

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let value = n;
  for (let i = 0; i < 8; i++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function pngChunk(type, data = Buffer.alloc(0)) {
  const chunk = Buffer.alloc(data.length + 12);
  chunk.writeUInt32BE(data.length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  let crc = 0xffffffff;
  for (let i = 4; i < data.length + 8; i++) {
    crc = CRC_TABLE[(crc ^ chunk[i]) & 255] ^ (crc >>> 8);
  }
  chunk.writeUInt32BE((crc ^ 0xffffffff) >>> 0, data.length + 8);
  return chunk;
}

function qrPng(text) {
  const qr = qrcode(0, 'M');
  qr.addData(Buffer.from(text, 'utf8').toString('latin1'), 'Byte');
  qr.make();

  const modules = qr.getModuleCount();
  const quiet = 4;
  const cell = Math.max(3, Math.floor(320 / (modules + quiet * 2)));
  const size = (modules + quiet * 2) * cell;
  const rowBytes = size * 3 + 1;
  const pixels = Buffer.alloc(size * rowBytes, 255);
  for (let y = 0; y < size; y++) pixels[y * rowBytes] = 0;
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (!qr.isDark(row, col)) continue;
      for (let y = (row + quiet) * cell; y < (row + quiet + 1) * cell; y++) {
        for (let x = (col + quiet) * cell; x < (col + quiet + 1) * cell; x++) {
          pixels.fill(0, y * rowBytes + 1 + x * 3, y * rowBytes + 1 + x * 3 + 3);
        }
      }
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // 8 bits per color channel
  ihdr[9] = 2; // RGB
  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(pixels, { level: 9 })),
    pngChunk('IEND')
  ]);
}

export function GET(request) {
  const data = new URL(request.url).searchParams.get('data') || '';
  if (!data || data.length > 1800) {
    return new Response('Invalid contact', { status: 400 });
  }
  try {
    return new Response(qrPng(data), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=0, s-maxage=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Could not generate contact QR', error);
    return new Response('Could not generate contact QR', { status: 422 });
  }
}
