# Yasna Design System

## Status

The current design system is a guarded migration layer. It does not rewrite the app UI yet; it gives new work a stable contract and keeps the legacy VK dark-theme overrides working.

## Source Files

| Layer | Main | Preview | Purpose |
| --- | --- | --- | --- |
| Theme tokens | `docs/design-system.css` | `docs/preview/design-system.css` | Light/dark `--ys-*` tokens, legacy aliases, focus styles |
| Theme runtime | `docs/core/theme.js` | `docs/preview/core/theme.js` | `window.YasnaTheme`, `html[data-yasna-theme]`, legacy `body.theme-vk-dark` bridge |
| Legacy dark overrides | `docs/vk-tech-tokens.css` | `docs/preview/vk-tech-tokens.css` | Existing VK dark mapping for inline-heavy legacy UI |
| Duel dark overrides | `docs/games/duel/theme-vk-dark.css` | `docs/preview/games/duel/theme-vk-dark.css` | Existing duel-specific dark theme |

## Public Runtime Contract

`window.YasnaTheme` is available on active runtime pages:

- `project`: `yasnaproject`
- `current()`: returns `light` or `dark`
- `set(mode)`: applies `light` or `dark`
- `toggle()`: switches between themes
- `apply(mode, options)`: low-level apply hook
- `mount()`: mounts the theme toggle when a header host exists

The runtime always sets:

- `html[data-yasna-theme="light|dark"]`
- `body.theme-vk-dark` only in dark mode for legacy compatibility
- `localStorage.yasna_theme_mode`
- legacy `localStorage.yasna_theme_vk_dark`

## Token Rules

New CSS should use `--ys-*` tokens first:

- color: `--ys-color-*`
- typography: `--ys-font-*`, `--ys-text-*`, `--ys-line-*`
- spacing: `--ys-space-*`
- radii: `--ys-radius-*`
- shadows: `--ys-shadow-*`

Legacy aliases `--bg`, `--txt`, `--accent`, and related variables stay as compatibility shims for `docs/styles.css`.

## Component Rules

New shared UI should start from these primitives:

- `.ys-button`
- `.ys-button--primary`
- `.ys-card`
- `.dp-theme-toggle`

Existing React/inline-styled UI can remain as-is until the corresponding module is refactored. When a module is touched, prefer moving repeated colors, borders, focus states, and spacing to the `--ys-*` contract.

## New Pattern: Trainer Workbench

The negotiations trainer introduces a reusable workbench pattern for dense tools:

| Area | Purpose | Tokens |
| --- | --- | --- |
| Input panel | Scenario capture and presets | `--ys-color-surface-raised`, `--ys-color-border-soft`, `--ys-space-*` |
| Central map | Primary interactive diagram | `--ys-color-surface`, `--ys-color-accent`, semantic status colors |
| Output panel | Diagnostics, questions, next action | `--ys-color-surface-raised`, `--ys-color-text-muted` |

The pattern is intentionally not a landing page: controls, diagnostics, and the diagram are visible immediately on desktop and stack in the same order on mobile.

## Checks

These checks protect the design-system boundary:

- `npm run check:themes` verifies theme tokens, runtime behavior, and active HTML integration.
- `npm run check:preview-sync` verifies critical `docs/` and `docs/preview/` copies stay identical.
- Playwright smoke tests switch `window.YasnaTheme` between light and dark and verify computed theme state.

## Migration Path

1. Keep `design-system.css` and `core/theme.js` synced between main and preview.
2. Convert one surface at a time from inline colors to `--ys-*` tokens.
3. Remove broad legacy `[style*="rgb(...)"]` dark overrides only after the corresponding component owns semantic classes.
4. Promote repeated component patterns into documented `.ys-*` primitives.
