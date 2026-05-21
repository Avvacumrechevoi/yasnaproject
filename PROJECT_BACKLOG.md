# PROJECT_BACKLOG

Обновлено: 2026-05-21. Работы только в `yasnaproject`.

## P0 - безопасность и ясность

| Задача | Почему | Готовность |
| --- | --- | --- |
| Перевыпустить GitHub token, отправленный в чат | токен считается скомпрометированным | ручное действие владельца |
| Пометить legacy docs и обновить server README под `yasnaproject` | старые инструкции ведут к `yasnanegotiations` и старому bot/API | next |
| Расширить `check:isolation` на docs/server config | сейчас проверяется активный HTML, но не инструкции и backend drafts | next |
| Запретить включение API через старый gateway marker | защита от случайного возврата old prod | частично готово |

## P1 - фундамент разработки

| Задача | Что сделать | Acceptance criteria |
| --- | --- | --- |
| Единый env layer | `docs/core/env.js`, чтение meta/window, quarantine flags | app/duel/admin читают config из одного API |
| Единый storage layer | KEYS, safe JSON get/set, quota handling | localStorage keys больше не дублируются по файлам |
| Migration registry | версии для `yasna_duel_data`, `yasna2_subdata` | старые данные не reset при изменении схемы |
| Generated bundle policy | решить, коммитим generated output или только deploy artifact | обычный build не создаёт случайный timestamp-diff |
| Preview strategy | оставить preview с sync-check или убрать дубль | CI ловит расхождение либо дубля нет |

## P2 - backend изоляция

| Задача | Что сделать | Acceptance criteria |
| --- | --- | --- |
| Новая YDB schema | отдельные таблицы или `project_id='yasnaproject'` | невозможно писать в старые таблицы |
| Новый API Gateway | отдельный gateway URL для нового проекта | `yasna:api` указывает только на новый gateway |
| Telegram auth decision | новый bot или явно shared auth | README и env отражают решение |
| Firebase realtime decision | отдельный Firebase project или новый RTDB root | `rooms/` старого проекта не используется |
| Backend smoke tests | curl/API contract tests для `/submit`, `/leaderboard`, `/content` | CI или ручной checklist перед включением |

## P3 - продуктовые улучшения

| Задача | Что даст |
| --- | --- |
| Улучшить leaderboard states | понятная диагностика, когда backend отключён |
| Export/import локального прогресса | страховка до cloud sync |
| Admin auth hardening | publish без пароля/sessionStorage заменить на нормальную auth-схему |
| Accessibility pass | keyboard navigation и aria для duel/admin/main |
| Mobile visual regression screenshots | меньше риска сломать игру на телефоне |

## Рекомендованный следующий sprint

1. Обновить server docs/config под `yasnaproject`.
2. Расширить isolation check на server docs и config.
3. Добавить env layer без изменения поведения.
4. Перевести `docs/index.html`, `docs/duel.html`, `docs/admin.html` на env layer.
5. Прогнать GitHub Actions и Pages deploy.

Этот sprint не включает новый backend и не меняет старый production.
