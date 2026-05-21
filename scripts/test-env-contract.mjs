#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const envFiles = [
  'docs/core/env.js',
  'docs/preview/core/env.js',
];

function createDocument(metaValues = {}) {
  return {
    querySelector(selector) {
      const match = selector.match(/^meta\[name="yasna:([^"]+)"\]$/);
      if (!match) return null;
      const value = metaValues[match[1]];
      if (value === undefined) return null;
      return {
        getAttribute(name) {
          return name === 'content' ? value : null;
        },
      };
    },
  };
}

function runEnv(file, metaValues = {}, windowValues = {}) {
  const code = readFileSync(resolve(rootDir, file), 'utf8');
  const sandbox = {
    window: { ...windowValues },
    document: createDocument(metaValues),
  };
  vm.runInNewContext(code, sandbox, { filename: file });
  return sandbox.window;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of envFiles) {
  const blank = runEnv(file);
  assert(blank.YasnaEnv.project === 'yasnaproject', `${file}: project must be yasnaproject`);
  assert(blank.YasnaEnv.apiBase === '', `${file}: apiBase must default to empty`);
  assert(blank.YasnaEnv.telegramBot === '', `${file}: telegramBot must default to empty`);
  assert(blank.YasnaEnv.isQuarantine === true, `${file}: blank env must be quarantine`);
  assert(blank.YasnaEnv.realtimeDisabled === true, `${file}: blank env must disable realtime`);
  assert(blank.YASNA_DISABLE_SHARED_REALTIME === true, `${file}: blank env must set realtime flag`);

  const fallback = runEnv(file, {}, {
    YASNA_LEADERBOARD_API: ' https://api.example.test ',
    YASNA_TG_BOT: ' YasnaProjectBot ',
  });
  assert(fallback.YasnaEnv.apiBase === 'https://api.example.test', `${file}: must trim fallback API`);
  assert(fallback.YasnaEnv.telegramBot === 'YasnaProjectBot', `${file}: must trim fallback bot`);
  assert(fallback.YasnaEnv.isQuarantine === false, `${file}: populated env must leave quarantine`);
  assert(fallback.YasnaEnv.realtimeDisabled === false, `${file}: populated env should not disable realtime by default`);

  const meta = runEnv(file, {
    api: ' https://meta-api.example.test ',
    'tg-bot': ' MetaBot ',
  }, {
    YASNA_LEADERBOARD_API: 'https://fallback.example.test',
    YASNA_TG_BOT: 'FallbackBot',
  });
  assert(meta.YasnaEnv.apiBase === 'https://meta-api.example.test', `${file}: meta API must override fallback`);
  assert(meta.YasnaEnv.telegramBot === 'MetaBot', `${file}: meta bot must override fallback`);

  const forcedRealtime = runEnv(file, {
    api: 'https://meta-api.example.test',
    'tg-bot': 'MetaBot',
  }, {
    YASNA_DISABLE_SHARED_REALTIME: true,
  });
  assert(forcedRealtime.YasnaEnv.realtimeDisabled === true, `${file}: explicit realtime flag must win`);
}

console.log('YasnaEnv contract tests passed.');
