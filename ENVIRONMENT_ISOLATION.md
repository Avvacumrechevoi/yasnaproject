# Environment isolation for yasnaproject

Updated: 2026-05-17.

## Rule

`yasnaproject` is the new development line. The old production repository
`yasnanegotiations` must keep working exactly as it works now.

Do not change, deploy to, or depend on the old repository during normal
`yasnaproject` work. Any shared external service must be treated as production
infrastructure until it has a separate `yasnaproject` namespace or replacement.

## Current shared resources found

| Resource | Current value | Used by | Risk | Quarantine state |
| --- | --- | --- | --- | --- |
| Yandex API Gateway | `https://d5dmdje8c5mk8811il5j.iwzqm34r.apigw.yandexcloud.net` | content fetch/publish, auth, submit, leaderboard | New site could publish content or submit leaderboard rows into old prod data | Disabled in `docs/*.html` and `docs/preview/*.html` by empty `yasna:api` |
| Telegram bot | `YasnaDuelBot` | Telegram login | New site could authenticate against old prod auth flow | Disabled by empty `yasna:tg-bot` |
| Firebase project | `yasna-rt` | realtime PvP rooms | New site could create/read/write old production rooms | Firebase SDK is not loaded in `duel.html`; `window.YASNA_DISABLE_SHARED_REALTIME = true` is set |
| Firebase RTDB path | `rooms/<KASTA-XXXX>` | realtime PvP state | Path collision with old production players | Disabled until a new path/project exists |
| YDB tables | `users`, `device_links`, `matches`, `content_revisions` | Yandex Cloud Functions | Schema/data are shared behind current API gateway | No writes from client because API is disabled |
| GitHub Pages | old repo URL vs new repo URL | static frontend | Accidental deploy to old Pages | Work only in local `yasnaproject` and push only to `Avvacumrechevoi/yasnaproject` |

## Quarantine behavior

The new static app remains usable for local/offline baseline flows:

- baseline content bundle still loads from GitHub Pages/local files;
- content live overrides are not fetched;
- admin publish is disabled and should show "API endpoint not configured";
- Telegram login is disabled;
- leaderboard submit/fetch is disabled;
- realtime PvP is disabled until isolated Firebase/Yandex infrastructure exists.

## Machine checks

Run `npm run check:isolation` before every build/deploy. The check fails if
active HTML pages reintroduce the old Yandex API host, old Telegram bot,
Firebase SDK loaders, non-empty `yasna:*` meta config, or realtime PvP without
the quarantine guard.

The public status page for the new project is `docs/environment-status.html`.

## How to safely re-enable features

Re-enable only after creating isolated resources for `yasnaproject`:

1. Create a new API gateway or versioned endpoints such as `/v2/submit`,
   `/v2/leaderboard`, `/v2/content`, `/v2/content/publish`.
2. Create separate YDB tables or a project/environment column that every query
   filters on.
3. Create a separate Firebase project or use a new RTDB root such as
   `yasnaproject_rooms`, with security rules that cannot affect `rooms`.
4. Create a separate Telegram bot for the new project, or explicitly verify
   that using the old bot is acceptable.
5. Replace the empty `yasna:api` and `yasna:tg-bot` values only in
   `yasnaproject`.
6. Remove `window.YASNA_DISABLE_SHARED_REALTIME = true` only after Firebase
   isolation is complete.

## Files intentionally changed for quarantine

- `docs/index.html`
- `docs/preview/index.html`
- `docs/admin.html`
- `docs/preview/admin.html`
- `docs/duel.html`
- `docs/preview/duel.html`
- `docs/games/duel/v2/duel.html`
- `docs/preview/games/duel/v2/duel.html`
- `docs/games/duel/rt-firebase.js`
- `docs/preview/games/duel/rt-firebase.js`
