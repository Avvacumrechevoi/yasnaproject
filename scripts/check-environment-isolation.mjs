#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function readProjectFile(file) {
  return readFileSync(resolve(rootDir, file), 'utf8');
}

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

const activeHtmlFiles = [
  'docs/index.html',
  'docs/preview/index.html',
  'docs/admin.html',
  'docs/preview/admin.html',
  'docs/duel.html',
  'docs/preview/duel.html',
  'docs/games/duel/v2/duel.html',
  'docs/preview/games/duel/v2/duel.html',
];

const forbiddenActiveHtml = [
  { label: 'old Yandex API gateway host', pattern: /d5dmdje8c5mk8811il5j/i },
  { label: 'old Telegram bot username', pattern: /YasnaDuelBot/i },
  { label: 'Firebase SDK loader', pattern: /www\.gstatic\.com\/firebasejs/i },
];

for (const file of activeHtmlFiles) {
  const html = readProjectFile(file);
  for (const rule of forbiddenActiveHtml) {
    if (rule.pattern.test(html)) {
      addFailure(file, `contains ${rule.label}`);
    }
  }
}

const emptyMetaExpectations = [
  { file: 'docs/index.html', names: ['api', 'tg-bot'] },
  { file: 'docs/preview/index.html', names: ['api', 'tg-bot'] },
  { file: 'docs/admin.html', names: ['api'] },
  { file: 'docs/preview/admin.html', names: ['api'] },
  { file: 'docs/duel.html', names: ['api', 'tg-bot'] },
  { file: 'docs/preview/duel.html', names: ['api', 'tg-bot'] },
];

function getMetaContent(html, metaName) {
  const tag = html.match(new RegExp(`<meta\\b[^>]*\\bname=["']yasna:${metaName}["'][^>]*>`, 'i'))?.[0];
  if (!tag) return null;
  return tag.match(/\bcontent=["']([^"']*)["']/i)?.[1] ?? null;
}

for (const expectation of emptyMetaExpectations) {
  const html = readProjectFile(expectation.file);
  for (const name of expectation.names) {
    const content = getMetaContent(html, name);
    if (content === null) {
      addFailure(expectation.file, `missing meta yasna:${name}`);
    } else if (content !== '') {
      addFailure(expectation.file, `meta yasna:${name} must stay empty in quarantine`);
    }
  }
}

const realtimeDisabledFiles = [
  'docs/duel.html',
  'docs/preview/duel.html',
  'docs/games/duel/v2/duel.html',
  'docs/preview/games/duel/v2/duel.html',
];

for (const file of realtimeDisabledFiles) {
  const html = readProjectFile(file);
  if (!/window\.YASNA_DISABLE_SHARED_REALTIME\s*=\s*true\b/.test(html)) {
    addFailure(file, 'must set window.YASNA_DISABLE_SHARED_REALTIME = true');
  }
}

const v2WindowConfigFiles = [
  'docs/games/duel/v2/duel.html',
  'docs/preview/games/duel/v2/duel.html',
];

for (const file of v2WindowConfigFiles) {
  const html = readProjectFile(file);
  if (!/window\.YASNA_LEADERBOARD_API\s*=\s*["']\s*["']/.test(html)) {
    addFailure(file, 'must keep window.YASNA_LEADERBOARD_API empty');
  }
  if (!/window\.YASNA_TG_BOT\s*=\s*["']\s*["']/.test(html)) {
    addFailure(file, 'must keep window.YASNA_TG_BOT empty');
  }
}

const realtimeModules = [
  'docs/games/duel/rt-firebase.js',
  'docs/preview/games/duel/rt-firebase.js',
];

for (const file of realtimeModules) {
  const js = readProjectFile(file);
  if (!/window\.YASNA_DISABLE_SHARED_REALTIME\s*===\s*true/.test(js)) {
    addFailure(file, 'must guard Firebase initialization with YASNA_DISABLE_SHARED_REALTIME');
  }
  if (!/Realtime PvP disabled in yasnaproject quarantine mode/.test(js)) {
    addFailure(file, 'must throw a quarantine-specific realtime error');
  }
}

if (failures.length) {
  console.error('Environment isolation check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Environment isolation check passed.');
