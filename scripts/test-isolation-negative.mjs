#!/usr/bin/env node
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const checkScript = resolve(rootDir, 'scripts/check-environment-isolation.mjs');
const nodeBin = process.execPath;

const requiredFiles = [
  'docs/index.html',
  'docs/preview/index.html',
  'docs/admin.html',
  'docs/preview/admin.html',
  'docs/duel.html',
  'docs/preview/duel.html',
  'docs/negotiations.html',
  'docs/preview/negotiations.html',
  'docs/games/duel/v2/duel.html',
  'docs/preview/games/duel/v2/duel.html',
  'docs/core/theme.js',
  'docs/preview/core/theme.js',
  'docs/games/duel/duel.js',
  'docs/preview/games/duel/duel.js',
  'docs/games/duel/duel-page.js',
  'docs/preview/games/duel/duel-page.js',
  'docs/admin.js',
  'docs/preview/admin.js',
  'docs/negotiations.js',
  'server/README.md',
  'server/api-gateway.yaml',
  'docs/core/env.js',
  'docs/preview/core/env.js',
  'docs/games/duel/rt-firebase.js',
  'docs/preview/games/duel/rt-firebase.js',
];

function copyFixture() {
  const fixtureRoot = mkdtempSync(resolve(tmpdir(), 'yasna-isolation-negative-'));
  for (const rel of requiredFiles) {
    const from = resolve(rootDir, rel);
    const to = resolve(fixtureRoot, rel);
    mkdirSync(dirname(to), { recursive: true });
    cpSync(from, to);
  }
  return fixtureRoot;
}

function runCheck(fixtureRoot) {
  try {
    execFileSync(nodeBin, [checkScript], {
      cwd: rootDir,
      env: { ...process.env, YASNA_ISOLATION_ROOT: fixtureRoot },
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { ok: true, output: '' };
  } catch (error) {
    return {
      ok: false,
      output: `${error.stdout || ''}${error.stderr || ''}`,
    };
  }
}

function assertNegative({ file, marker, expected }) {
  const fixtureRoot = copyFixture();
  try {
    const target = resolve(fixtureRoot, file);
    const original = readFileSync(target, 'utf8');
    writeFileSync(target, `${original}\n${marker}\n`);
    const result = runCheck(fixtureRoot);
    if (result.ok) {
      throw new Error(`${file}: isolation check unexpectedly passed for ${expected}`);
    }
    if (!result.output.includes(expected)) {
      throw new Error(`${file}: failure did not mention ${expected}\n${result.output}`);
    }
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
}

assertNegative({
  file: 'docs/duel.html',
  marker: '<!-- https://avvacumrechevoi.github.io/yasnanegotiations/duel.html -->',
  expected: 'old GitHub Pages URL',
});

assertNegative({
  file: 'docs/games/duel/duel-page.js',
  marker: '// https://github.com/Avvacumrechevoi/yasnanegotiations',
  expected: 'old GitHub repository URL',
});

assertNegative({
  file: 'server/README.md',
  marker: 'YasnaDuelBot',
  expected: 'old Telegram bot username',
});

assertNegative({
  file: 'server/api-gateway.yaml',
  marker: 'server_api_gateway',
  expected: 'legacy server_api_gateway filename',
});

console.log('Negative isolation tests passed.');
