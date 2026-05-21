# yasnaproject backend notes

Эта папка содержит заготовки для будущего изолированного backend нового
проекта. Backend пока не подключён к опубликованному сайту: `yasna:api` и
`yasna:tg-bot` в HTML остаются пустыми.

## Важное правило

Не использовать production backend старого проекта. Не копировать старый API
Gateway host и старое имя Telegram bot из исторических документов. Все значения
для `yasnaproject` должны быть новыми и отдельными.

## Файлы

```text
schema.sql            YDB schema
auth-telegram.js      Cloud Function: Telegram Login
submit.js             Cloud Function: запись матча
leaderboard.js        Cloud Function: чтение leaderboard
content-fetch.js      Cloud Function: чтение live content overrides
content-publish.js    Cloud Function: публикация content overrides
api-gateway.yaml      API Gateway spec
README.md             этот документ
```

## Required isolated resources

Перед включением backend создать отдельные ресурсы:

- YDB database или отдельные таблицы/namespace только для `yasnaproject`;
- Yandex API Gateway с новым URL: `<YASNAPROJECT_API_GATEWAY_URL>`;
- Telegram bot с новым username: `<YASNAPROJECT_BOT_USERNAME>`;
- service account с минимальными правами на новые функции и новую YDB;
- отдельные secrets: `JWT_SECRET`, `ADMIN_PASSWORD`, `BOT_TOKEN`.

## Deployment outline

1. Создать YDB serverless database.
2. Выполнить `schema.sql` в новой базе.
3. Создать service account для функций.
4. Создать Cloud Functions из файлов:
   - `auth-telegram.js`
   - `submit.js`
   - `leaderboard.js`
   - `content-fetch.js`
   - `content-publish.js`
5. В `api-gateway.yaml` заменить placeholders:
   - `{AUTH_TELEGRAM_FUNCTION_ID}`
   - `{SUBMIT_FUNCTION_ID}`
   - `{LEADERBOARD_FUNCTION_ID}`
   - `{CONTENT_FETCH_FUNCTION_ID}`
   - `{CONTENT_PUBLISH_FUNCTION_ID}`
   - `{SERVICE_ACCOUNT_ID}`
   - `<YASNAPROJECT_API_GATEWAY_HOST>`
6. Создать API Gateway по `api-gateway.yaml`.
7. Только после ручной проверки isolated backend заменить meta values в
   `yasnaproject`:

```html
<meta name="yasna:api" content="<YASNAPROJECT_API_GATEWAY_URL>"/>
<meta name="yasna:tg-bot" content="<YASNAPROJECT_BOT_USERNAME>"/>
```

## Client contract

Клиент читает runtime config через `window.YasnaEnv`:

```js
window.YasnaEnv = {
  project: 'yasnaproject',
  apiBase: '',
  telegramBot: '',
  isQuarantine: true,
  realtimeDisabled: true
};
```

Пока `apiBase` и `telegramBot` пустые, функции публикации, login, leaderboard и
server submit должны оставаться выключенными.

## Verification before enabling

- `npm run check:isolation` проходит.
- `npm run build` проходит.
- `npm test` проходит.
- Новый API Gateway отвечает на `/leaderboard` и `/content` без обращения к
  старым таблицам.
- `server/api-gateway.yaml` не содержит старых production identifiers.
