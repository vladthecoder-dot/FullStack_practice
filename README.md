# Task Manager

Небольшое full-stack приложение для управления задачами.

Проект создан в учебных целях для практики TypeScript, HTTP API, Node.js и PostgreSQL.

## Возможности

- создание задач;
- удаление задач;
- изменение текста задачи;
- отметка задачи как выполненной;
- фильтрация задач;
- сохранение задач в PostgreSQL.

## Технологии

- TypeScript
- Node.js
- PostgreSQL
- `pg`
- `dotenv`
- HTML
- CSS

## Запуск

Установить зависимости:

```bash
npm install
```

Создать `.env` в корне проекта:

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_password
```

Собрать TypeScript:

```bash
npm run build
```

Запустить backend:

```bash
node dist/server/server.js
```

После этого открыть `index.html` через локальный HTTP-сервер.

## API

`GET /tasks` — получить все задачи.

`POST /tasks` — создать задачу.

`PATCH /tasks/:id` — изменить текст и/или статус задачи.

`DELETE /tasks/:id` — удалить задачу.
