#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pairs = [
  ['docs/core/env.js', 'docs/preview/core/env.js'],
  ['docs/core/theme.js', 'docs/preview/core/theme.js'],
  ['docs/design-system.css', 'docs/preview/design-system.css'],
  ['docs/vk-tech-tokens.css', 'docs/preview/vk-tech-tokens.css'],
  ['docs/games/duel/theme-vk-dark.css', 'docs/preview/games/duel/theme-vk-dark.css'],
];

function hash(file) {
  return createHash('sha256').update(readFileSync(resolve(rootDir, file))).digest('hex');
}

const failures = [];
for (const [source, preview] of pairs) {
  if (hash(source) !== hash(preview)) {
    failures.push(`${source} and ${preview} diverged`);
  }
}

if (failures.length) {
  console.error('Preview sync check failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Preview sync check passed.');
