# Архитектурный аудит yasnaproject

Обновлено: 2026-05-21. Скоп: новый репозиторий
`Avvacumrechevoi/yasnaproject`. Старый `yasnanegotiations` не трогаем.

## 1. Короткий вывод

Проект сейчас стабилизирован как отдельная GitHub Pages-линия: deploy зелёный,
shared backend отключён, есть smoke tests и isolation check.

Главный архитектурный риск больше не в деплое, а в смешении ролей внутри кода:
static app, preview-копия, генерация контента, локальные хранилища, backend-
заготовки и старые документы живут рядом и местами противоречат друг другу.

Рекомендованный следующий курс: сначала закрепить границы среды и ownership,
затем вынести storage/config/API слой, и только после этого включать новый
backend.

## 2. Текущая карта системы

```text
GitHub Actions
  -> npm ci
  -> check:isolation
  -> build content bundle
  -> build static app bundles
  -> Playwright smoke tests
  -> deploy docs/ to GitHub Pages

docs/index.html
  -> CDN React / ReactDOM / Three.js / PeerJS
  -> docs/dist/app.min.js

docs/duel.html
  -> CDN React / ReactDOM / Three.js
  -> docs/dist/duel.min.js

content/*.json
  -> scripts/build-content.mjs
  -> docs/games/duel/content.bundle.js
  -> docs/preview/games/duel/content.bundle.js
```

## 3. Активные слои

| Слой | Файлы | Роль | Риск |
| --- | --- | --- | --- |
| Static shell | `docs/*.html` | Entry points, meta config, CDN scripts | env config сейчас распределён по HTML |
| Core | `docs/core/*.js` | данные, диаграмма, 3D, проверки, карточки | глобальные `window.*` контракты |
| Main app | `docs/app.js` | оркестратор Ясны, уроков, туров, UI | 1200+ строк, много inline state/style |
| Duel | `docs/games/duel/*.js` | профиль, auth, storage, transports, turnir, UI | 2000+ строк в `duel.js` и `duel-page.js` |
| Content | `content/*`, `content.bundle.js` | baseline-вопросы и темы | build меняет timestamps в generated bundle |
| Admin | `docs/admin.*` | локальные overrides + publish hook | publish должен оставаться выключенным в quarantine |
| Server drafts | `server/*` | Yandex Cloud Functions/YDB | docs и config всё ещё используют старые имена/URL |
| Legacy prototypes | `backend/`, `frontend/` | ранние прототипы | могут сбить с толку, в deploy не участвуют |

## 4. Что уже сделано правильно

- Новый repo и Pages работают отдельно: `yasnaproject`.
- Shared Yandex API, Telegram bot и Firebase realtime выключены в активных
  страницах.
- `scripts/check-environment-isolation.mjs` блокирует возврат старого API host,
  старого Telegram bot и Firebase SDK loaders в активный HTML.
- Deploy теперь gated: build и smoke tests проходят до публикации.
- Playwright smoke tests покрывают загрузку главной, звезду, уроки, дуэль,
  manifest и SEO meta.
- Страница `docs/environment-status.html` публично показывает quarantine status.

## 5. Главные риски

### P0: Документы всё ещё частично говорят про старый проект

`ARCHITECTURE.md`, `server/README.md` и часть старых инструкций ссылаются на
`yasnanegotiations`, старые Pages URL, старый bot name и старый API gateway.
Это не ломает runtime, но опасно для человека, который будет делать следующий
deploy backend.

Решение: пометить старые документы как legacy/context и создать новые
`yasnaproject`-инструкции перед включением backend.

### P0: Backend нельзя включать без отдельной среды

Клиентский код уже умеет обращаться к `/content`, `/content/publish`,
`/submit`, `/leaderboard`, `/auth/telegram`, но meta config пустой. Это
правильно. Нельзя просто вернуть старый gateway: новый проект начнёт писать в
старые таблицы.

Решение: новый API gateway, новые таблицы/namespace, новый bot или явное
решение о shared auth.

### P1: Нет единого env/config слоя

Сейчас config читается из meta tags и window globals в разных файлах. Это
работает, но усложняет безопасное включение фич.

Решение: добавить единый `docs/core/env.js` или аналог, который отдаёт:
`apiBase`, `telegramBot`, `realtimeEnabled`, `environmentName`,
`isQuarantine`.

### P1: Storage слой разбросан

LocalStorage keys находятся в `app.js`, `duel.js`, `admin.js`, content store и
start page. Есть retry queue и profile migration, но нет общего safe storage
API, quota policy и migration registry.

Решение: централизовать keys и safe get/set, затем миграции.

### P1: `docs/` и `docs/preview/` дублируют код

Дублирование помогает ручному preview, но создаёт риск расхождения. Сейчас build
собирает обе ветки, а isolation check проверяет обе.

Решение: решить, остаётся ли preview-копия как staging artifact. Если да -
добавить механический sync/check. Если нет - убрать из активного workflow
постепенно.

### P2: Большие файлы затрудняют изменения

Точки концентрации:

- `docs/games/duel/duel.js` - 2217 строк.
- `docs/games/duel/duel-page.js` - 2095 строк.
- `docs/games/duel/turnir-engine.js` - 1752 строки.
- `docs/core/yasna-3d.js` - 1489 строк.
- `docs/app.js` - 1218 строк.

Решение: резать по устойчивым контрактам, не по вкусу: env, storage, API,
transport, UI-компоненты.

## 6. Рекомендуемая целевая архитектура

```text
docs/core/env.js
  -> единая runtime-конфигурация и quarantine flags

docs/core/storage.js
  -> KEYS, safe get/set, quota handling, migrations, export/import

docs/core/api-client.js
  -> content/auth/leaderboard clients, no-op в quarantine

docs/games/duel/
  storage-duel.js
  leaderboard-client.js
  profile.js
  transports/
  turnir-engine.js
  duel-page.js

server/
  yasnaproject-only deploy docs
  isolated YDB schema
  API gateway without old host/bot references
```

## 7. Ближайшие проверки перед кодовыми изменениями

1. Проверить, какие старые docs-инструкции всё ещё могут привести к включению
   old prod resources.
2. Проверить все `localStorage` keys и подготовить карту миграций.
3. Проверить, какие `window.*` globals являются публичными контрактами, а какие
   можно спрятать за модулем.
4. Проверить, что generated bundle timestamps не создают лишний diff в обычном
   dev flow.
5. Проверить server drafts: актуальны ли `server/*.js` под новый `yasnaproject`
   namespace.

## 8. Definition of Done для следующего этапа

Следующий этап можно считать готовым, когда:

- README и backend-инструкции больше не ведут к старому repo/API/bot.
- Новый env слой запрещает включение shared realtime/API без явного флага.
- Storage keys собраны в одном месте.
- CI проверяет не только HTML, но и server docs/config на старые prod markers.
- Smoke tests остаются зелёными.
