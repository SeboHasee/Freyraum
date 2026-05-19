#!/usr/bin/env node
/**
 * FREYRAUM importer launcher.
 *
 * Why this wrapper exists:
 * - Older Node.js versions parse `import-artworks.mjs` as unsupported syntax
 *   and crash with "Unexpected token {" before we can show a helpful message.
 * - This CommonJS wrapper can run on old Node.js, check the version first,
 *   and fail with a plain-language report.
 */

const { spawnSync } = require('node:child_process');
const { writeFileSync, mkdirSync } = require('node:fs');
const { join, dirname } = require('node:path');

const ROOT = join(__dirname, '..');
const REPORT_FILE = join(ROOT, 'customer-artworks', 'last-import-report.txt');
const requiredMajor = 18;
const major = Number.parseInt(process.versions.node.split('.')[0], 10);

function writeCompatibilityReport(message) {
  try {
    mkdirSync(dirname(REPORT_FILE), { recursive: true });
    const report = [
      `FREYRAUM — Gallery update finished at ${new Date().toLocaleString()}`,
      '',
      'Errors (1):',
      `  ! ${message}`,
      '',
      'Please install or switch to Node.js LTS (18 or newer) from https://nodejs.org and run Update Gallery again.',
      '',
    ].join('\n');
    writeFileSync(REPORT_FILE, report, 'utf8');
  } catch {
    // ignore report write failures; console output still informs user
  }
}

if (!Number.isFinite(major) || major < requiredMajor) {
  const found = process.version || `v${process.versions.node}`;
  const message = `Node.js ${requiredMajor}+ is required for Update Gallery, but found ${found}.`;
  process.stderr.write(`${message}\n`);
  writeCompatibilityReport(message);
  process.exit(1);
}

const importerPath = join(__dirname, 'import-artworks.mjs');
const result = spawnSync(process.execPath, [importerPath], { stdio: 'inherit' });

if (typeof result.status === 'number') {
  process.exit(result.status);
}
if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
}
process.exit(1);
