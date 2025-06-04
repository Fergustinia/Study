# Agile Project Management System

Система управления проектами с применением Agile и Scrum методологии.

## Функциональность

- Управление проектами и спринтами
- Управление задачами (user stories и tasks)
- Доска задач (Kanban board)
- Отслеживание прогресса спринта
- Управление командой
- Бэклог продукта

## Технологии

- Frontend: React.js с TypeScript
- Backend: Node.js с Express
- База данных: PostgreSQL
- UI: Material-UI

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   npm install
   cd client
   npm install
   ```
3. Создайте файл .env в корневой директории:
   ```
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=agile_pm
   JWT_SECRET=your_secret_key
   ```
4. Запустите базу данных PostgreSQL
5. Запустите сервер разработки:
   ```bash
   npm run dev:full
   ```

## Структура проекта

```
├── client/                 # Frontend React приложение
├── server/                 # Backend Node.js приложение
│   ├── config/            # Конфигурация базы данных
│   ├── controllers/       # Контроллеры
│   ├── models/           # Модели данных
│   ├── routes/           # Маршруты API
│   └── middleware/       # Middleware функции
└── package.json
``` 