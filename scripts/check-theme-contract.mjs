#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function readProjectFile(file) {
  return readFileSync(resolve(rootDir, file), 'utf8');
}

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

const designFiles = [
  'docs/design-system.css',
  'docs/preview/design-system.css',
];

const requiredTokens = [
  '--ys-color-bg',
  '--ys-color-surface',
  '--ys-color-text',
  '--ys-color-text-muted',
  '--ys-color-accent',
  '--ys-color-focus',
  '--ys-font-sans',
  '--ys-radius-md',
  '--ys-space-5',
  '--bg',
  '--txt',
];

for (const file of designFiles) {
  const css = readProjectFile(file);
  for (const token of requiredTokens) {
    if (!css.includes(token)) addFailure(file, `missing token ${token}`);
  }
  if (!/html\[data-yasna-theme='light'\]/.test(css)) {
    addFailure(file, 'missing explicit light theme selector');
  }
  if (!/html\[data-yasna-theme='dark'\]/.test(css)) {
    addFailure(file, 'missing explicit dark theme selector');
  }
  if (!/body\.theme-vk-dark/.test(css)) {
    addFailure(file, 'missing legacy dark body class bridge');
  }
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

for (const file of activeHtmlFiles) {
  const html = readProjectFile(file);
  if (!/design-system\.css/.test(html)) {
    addFailure(file, 'must load design-system.css');
  }
  if (!/core\/theme\.js/.test(html)) {
    addFailure(file, 'must load core/theme.js');
  }
  if (!/name=["']yasna:theme["']/.test(html)) {
    addFailure(file, 'must declare meta yasna:theme');
  }
}

function makeClassList() {
  const values = new Set();
  return {
    add(value) { values.add(value); },
    remove(value) { values.delete(value); },
    contains(value) { return values.has(value); },
    toggle(value, force) {
      const shouldAdd = force === undefined ? !values.has(value) : !!force;
      if (shouldAdd) values.add(value);
      else values.delete(value);
      return shouldAdd;
    },
  };
}

function runTheme(file, metaTheme = 'light') {
  const code = readProjectFile(file);
  const store = new Map();
  const themeColor = { content: '' };
  const sandbox = {
    window: {},
    localStorage: {
      getItem(key) { return store.has(key) ? store.get(key) : null; },
      setItem(key, value) { store.set(key, String(value)); },
    },
    MutationObserver: class {
      observe() {}
    },
    document: {
      readyState: 'loading',
      documentElement: { dataset: {} },
      body: { classList: makeClassList() },
      addEventListener() {},
      querySelector(selector) {
        if (selector === 'meta[name="yasna:theme"]') {
          return { getAttribute: () => metaTheme };
        }
        if (selector === 'meta[name="theme-color"]') {
          return { setAttribute: (_name, value) => { themeColor.content = value; } };
        }
        return null;
      },
      querySelectorAll() { return []; },
      createElement() {
        return {
          addEventListener() {},
          setAttribute() {},
          querySelector() { return null; },
          className: '',
          innerHTML: '',
          type: '',
        };
      },
    },
  };
  sandbox.window.document = sandbox.document;
  vm.runInNewContext(code, sandbox, { filename: file });
  return { sandbox, store, themeColor };
}

for (const file of ['docs/core/theme.js', 'docs/preview/core/theme.js']) {
  const { sandbox, store, themeColor } = runTheme(file);
  const api = sandbox.window.YasnaTheme;
  if (!api) {
    addFailure(file, 'must expose window.YasnaTheme');
    continue;
  }
  if (api.project !== 'yasnaproject') addFailure(file, 'project must be yasnaproject');
  api.set('dark');
  if (sandbox.document.documentElement.dataset.yasnaTheme !== 'dark') addFailure(file, 'dark mode must set html dataset');
  if (!sandbox.document.body.classList.contains('theme-vk-dark')) addFailure(file, 'dark mode must set body class');
  if (store.get('yasna_theme_mode') !== 'dark') addFailure(file, 'dark mode must persist new storage key');
  if (store.get('yasna_theme_vk_dark') !== '1') addFailure(file, 'dark mode must persist legacy storage key');
  if (themeColor.content !== '#151515') addFailure(file, 'dark mode must update theme-color');

  api.set('light');
  if (sandbox.document.documentElement.dataset.yasnaTheme !== 'light') addFailure(file, 'light mode must set html dataset');
  if (sandbox.document.body.classList.contains('theme-vk-dark')) addFailure(file, 'light mode must remove body class');
  if (store.get('yasna_theme_vk_dark') !== '0') addFailure(file, 'light mode must clear legacy dark storage key');
}

if (failures.length) {
  console.error('Theme contract check failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Theme contract check passed.');
