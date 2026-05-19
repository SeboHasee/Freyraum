#!/usr/bin/env node
/**
 * FREYRAUM importer launcher.
 *
 * Why this wrapper exists:
 * - Older Node.js versions parse `import-artworks.mjs` as unsupported syntax
 *   and crash with "Unexpected token {" before we can show a helpful message.
 * - Some old Node.js versions also do not understand `node:` built-in module
 *   specifiers, so this launcher intentionally uses legacy built-in names.
 * - This CommonJS wrapper can run on old Node.js, check the version first,
 *   and fail with a plain-language report.
 */

const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REPORT_FILE = path.join(ROOT, 'customer-artworks', 'last-import-report.txt');
const requiredMajor = 18;
const major = parseInt(process.versions.node.split('.')[0], 10);

function ensureDirectory(dirPath) {
  if (fs.existsSync(dirPath)) return;
  ensureDirectory(path.dirname(dirPath));
  try {
    fs.mkdirSync(dirPath);
  } catch (err) {
    if (!fs.existsSync(dirPath)) throw err;
  }
}

function writeCompatibilityReport(message) {
  try {
    ensureDirectory(path.dirname(REPORT_FILE));
    const report = [
      `FREYRAUM — Gallery update finished at ${new Date().toLocaleString()}`,
      '',
      'Errors (1):',
      `  ! ${message}`,
      '',
      'Please install or switch to Node.js LTS (18 or newer) from https://nodejs.org and run Update Gallery again.',
      '',
    ].join('\n');
    fs.writeFileSync(REPORT_FILE, report, 'utf8');
  } catch (err) {
    // ignore report write failures; console output still informs user
  }
}

if (!isFinite(major) || major < requiredMajor) {
  const found = process.version || `v${process.versions.node}`;
  const message = `Node.js ${requiredMajor}+ is required for Update Gallery, but found ${found}.`;
  process.stderr.write(`${message}\n`);
  writeCompatibilityReport(message);
  process.exit(1);
}

const importerPath = path.join(__dirname, 'import-artworks.mjs');
const result = childProcess.spawnSync(process.execPath, [importerPath], { stdio: 'inherit' });

if (typeof result.status === 'number') {
  process.exit(result.status);
}
if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
}
process.exit(1);
