#!/usr/bin/env node
/**
 * FREYRAUM — v1.40 smoke check of a *packaged* FREYRAUM Editor
 * (`npm run smoke:desktop-package -- --exe <path to the app executable>`).
 *
 * Starts the installed/unpacked app on a temporary copy of the project and
 * checks that
 *   - it is the packaged app (not the development build),
 *   - its bundled importer ("Update Gallery", outside the asar archive)
 *     generated the gallery preview for the new project,
 *   - the editor opens at freyraum://app/ with the desktop bridge and the
 *     "Im Projekt speichern" button.
 * The project folder name contains a space, like most Windows user folders.
 *
 * Needs `npm i --no-save playwright` (root). On Linux run under xvfb-run -a.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function argValue(name) {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1];
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  return inline ? inline.slice(name.length + 1) : undefined;
}

const exe = argValue('--exe');
if (!exe || !existsSync(exe)) {
  console.error(`Usage: npm run smoke:desktop-package -- --exe <app executable> (not found: ${exe ?? '—'})`);
  process.exit(2);
}
let electron;
try {
  ({ _electron: electron } = await import('playwright'));
} catch {
  console.error('Playwright is not installed: npm i --no-save playwright');
  process.exit(2);
}

const TEMP = mkdtempSync(join(tmpdir(), 'freyraum-package-'));
const PROJECT = join(TEMP, 'FREYRAUM Projekt');
mkdirSync(PROJECT);
cpSync(join(ROOT, 'customer-artworks'), join(PROJECT, 'customer-artworks'), { recursive: true });
if (existsSync(join(ROOT, 'customer-audio'))) cpSync(join(ROOT, 'customer-audio'), join(PROJECT, 'customer-audio'), { recursive: true });
rmSync(join(PROJECT, 'customer-artworks', 'history'), { recursive: true, force: true });
writeFileSync(join(PROJECT, 'package.json'), '{ "name": "freyraum" }\n');
const hubBefore = readFileSync(join(PROJECT, 'customer-artworks', 'museum-hub.json'), 'utf8');

const failures = [];
const check = (condition, message) => {
  if (condition) console.log(`✓ ${message}`);
  else failures.push(message);
};

const app = await electron.launch({
  executablePath: resolve(exe),
  args: [`--project=${PROJECT}`, '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  timeout: 90_000,
});
try {
  const page = await app.firstWindow();
  await page.waitForURL(/placement-editor\.html/, { timeout: 180_000 });
  await page.waitForSelector('.loading-start-btn', { timeout: 90_000 });
  check(await app.evaluate(({ app: electronApp }) => electronApp.isPackaged), 'this is the packaged app');
  check(
    existsSync(join(PROJECT, 'customer-preview', 'customer-artworks.js')),
    'the bundled importer generated the gallery preview (no Node.js installation used)'
  );
  check(page.url().startsWith('freyraum://app/customer-preview/placement-editor.html'), 'the editor opens at freyraum://app/');
  const info = await page.evaluate(async () => {
    const result = await window.freyraumDesktop?.projectInfo();
    return result && result.ok ? result.value : null;
  });
  check(info?.name === 'FREYRAUM Projekt', `the editor sees the project folder (${info?.root ?? '—'})`);
  const start = page.locator('.loading-start-btn');
  await page.waitForFunction(() => !document.querySelector('.loading-start-btn')?.hasAttribute('disabled'), null, { timeout: 90_000 });
  await start.click();
  await page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 60_000 });
  const label = await page.locator('.museum-hub__publish-button').textContent({ timeout: 30_000 });
  check(label?.trim() === 'Im Projekt speichern', 'the save button reads "Im Projekt speichern"');
} finally {
  await app.close().catch(() => {});
}
check(
  readFileSync(join(PROJECT, 'customer-artworks', 'museum-hub.json'), 'utf8') === hubBefore,
  'opening the project did not change museum-hub.json'
);
rmSync(TEMP, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`\nFAIL (${failures.length}):`);
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}
console.log('\nPASS: the packaged FREYRAUM Editor opens a project and updates the gallery with its bundled importer.');
