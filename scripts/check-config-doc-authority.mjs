import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const canonical = resolve(root, 'docs/QUERY_PARAMETERS.md');

const targets = [
  'README.md',
  'ARCHITECTURE_MAP.md',
  'DOCUMENTATION_RULES.md',
  'CONTRIBUTING.md',
  'docs/HANDOFF.md',
  'docs/CUSTOMER_PICTURE_GUIDE.md',
  'docs/CUSTOMER_TEXT_GUIDE.md',
  'docs/architecture/README.md',
];

const forbidden = [
  /\?startup\s*=/i,
  /\?debug\s*=/i,
  /\?backend\s*=\s*webgpu/i,
  /freyraum\.diagnostics\.mode/i,
  /freyraum:startup-readiness/i,
  /freyraum\.backend/i,
  /freyraum\.preferences\.v1/i,
  /window\.__FREYRAUM_DIAGNOSTICS__/i,
];

if (!existsSync(canonical)) {
  console.error('Missing canonical config doc: docs/QUERY_PARAMETERS.md');
  process.exit(1);
}

const failures = [];
for (const rel of targets) {
  const file = resolve(root, rel);
  if (!existsSync(file)) continue;
  const content = readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(content)) {
      failures.push(`${rel}: contains config detail matching ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Configuration authority check failed. Keep config details only in docs/QUERY_PARAMETERS.md');
  for (const line of failures) console.error(`- ${line}`);
  process.exit(1);
}

console.log('Configuration authority check passed.');
