# yasnaproject

Новая линия разработки проекта "Ясна".

- Сайт: https://avvacumrechevoi.github.io/yasnaproject/
- Тренажёр переговоров: https://avvacumrechevoi.github.io/yasnaproject/negotiations.html
- Статус среды: https://avvacumrechevoi.github.io/yasnaproject/environment-status.html
- Репозиторий: https://github.com/Avvacumrechevoi/yasnaproject

## Главное правило

`yasnaproject` развивается отдельно от старого production-репозитория
`yasnanegotiations`.

Старый проект не меняем, не деплоим и не подключаем к новым экспериментам.
Все shared backend-ресурсы считаются production-инфраструктурой, пока для
`yasnaproject` не создана отдельная среда.

Подробно: [ENVIRONMENT_ISOLATION.md](./ENVIRONMENT_ISOLATION.md).

## Текущее состояние

- GitHub Pages включён для нового репозитория.
- Deploy проходит через GitHub Actions.
- Перед публикацией выполняются:
  - `npm run check:isolation`
  - `npm run check:safety`
  - `npm run build`
  - `npm test`
- Shared Yandex API, Telegram bot и Firebase realtime PvP отключены в новой
  линии до отдельной инфраструктуры.

## Структура

```text
docs/                    Static app для GitHub Pages
docs/preview/            Дублирующая preview-ветка внутри static app
docs/design-system.css   Контракт токенов и light/dark тем
docs/negotiations.html   Интерактивный тренажёр переговоров по Ясне
docs/games/duel/         Дуэль, турниры, локальная статистика, leaderboard UI
docs/core/               Ядро Ясны: env, theme, данные, 3D, карточки, проверки
content/                 Исходный контент для content bundle
scripts/                 Сборка, валидация, isolation guard, static server
server/                  Заготовки Yandex Cloud Functions и YDB
backend/                 Ранний Express-прототип, сейчас не участвует в deploy
frontend/                Ранний Vite-прототип, сейчас не является источником app
tests/                   Playwright smoke tests
```

## Локальная разработка

```bash
npm ci
npm run check:safety
npm run build
npm test
npm run serve
```

Если `npm` недоступен в локальном окружении, минимальные проверки можно
запускать напрямую через Node:

```bash
node scripts/check-environment-isolation.mjs
node scripts/check-theme-contract.mjs
node scripts/validate-content.mjs
```

## Документы

- [ARCHITECTURE_AUDIT_YASNAPROJECT.md](./ARCHITECTURE_AUDIT_YASNAPROJECT.md) -
  актуальный аудит новой линии.
- [PROJECT_BACKLOG.md](./PROJECT_BACKLOG.md) - приоритетный план следующих
  работ.
- [ENVIRONMENT_ISOLATION.md](./ENVIRONMENT_ISOLATION.md) - карантин shared
  ресурсов.
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - токены, тема и правила миграции UI.
- [FRONTEND_MODULE_MAP.md](./FRONTEND_MODULE_MAP.md) - карта runtime-страниц,
  preview-копий и безопасных границ рефакторинга.
- [NEGOTIATIONS_TRAINER.md](./NEGOTIATIONS_TRAINER.md) - анализ и устройство
  тренажёра переговоров.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - старый архитектурный аудит,
  полезен как исторический контекст, но содержит ссылки на `yasnanegotiations`.

## Безопасность

Если токен GitHub или backend-секрет был отправлен в чат, его нужно считать
скомпрометированным и перевыпустить.
