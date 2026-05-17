# Handoff: Scrumo — контекст для следующего чата

Используй этот файл как **системный промпт / бриф** в начале новой сессии: скопируй раздел «Промпт для ассистента» в первое сообщение или приложи файл.

**Последнее обновление handoff:** май 2026 (канбан `/board`, drag-and-drop, `updateTaskStatus`).

---

## Промпт для ассистента (вставить в новый чат)

```
Ты продолжаешь работу над проектом Scrumo (курсовой/дипломный код).

Репозиторий: Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 + Prisma 7 + PostgreSQL + NextAuth v5 (beta) + shadcn-стиль UI.

Корень проекта: `курсач и диплом/код/scrumo` (в workspace может быть `A:\Study\курсач и диплом\код\scrumo`).

ОБЯЗАТЕЛЬНО:
- Читай существующий код перед правками; не делай рефакторинг «заодно».
- Не коммить секреты; `.env` в git не должен попадать с реальными паролями в публичные репо.
- Пользователь предпочитает русский язык в ответах.
- Для проверки сессии на сервере используй `auth()` из `@/auth`, НЕ `getServerSession` (NextAuth v5).

УЖЕ СДЕЛАНО В ПРОШЛЫХ СЕССИЯХ (не ломай без причины):

1) **Prisma + PostgreSQL + driver adapter**
   - `src/lib/prisma.ts`: `pg.Pool` (max 10) + `PrismaPg` + singleton `prisma` в dev на `globalThis`.
   - Причина: один `pg`-клиент не выдерживает параллельные `Promise.all` на дашборде → Prisma P1017 ConnectionClosed.
   - `prisma/seed.ts`: тоже Pool + `pool.end()` после `$disconnect()`.
   - Клиент генерится в `src/generated/prisma` (в `.gitignore`). Импорт: `@/generated/prisma/client`.

2) **NextAuth (credentials) + клиент**
   - `src/auth.ts`: JWT-сессия, Credentials provider, bcrypt compare с `passwordHash` в БД.
   - API: `src/app/api/auth/[...nextauth]/route.ts` → `handlers` из `@/auth`.
   - Регистрация: `src/app/api/auth/register/route.ts`.
   - `src/components/providers/auth-session-provider.tsx` — `SessionProvider` из `next-auth/react`.
   - Логин: `src/app/login/page.tsx` + `login-form.tsx` (`useSearchParams` только внутри Suspense).
   - Расширение типов: `src/types/next-auth.d.ts` (`session.user.id`, `role`).

3) **Навигация и заглушки разделов**
   - Минимальные страницы: `(main)/analytics|backlog|planning|team|setting/page.tsx` — заглушки.
   - `src/lib/navigation.ts`: Settings → href `/setting` (папка `setting`, не `settings`).

4) **Канбан-доска (`/board`)**
   - `src/app/(main)/board/page.tsx` — выбор проекта (`?projectId=`), задачи только из проектов, где пользователь в `members`.
   - `src/components/kanban/` — `kanban-board.tsx` (dnd-kit), `kanban-column.tsx`, `task-card.tsx`, `board-project-select.tsx`.
   - `src/types/task.ts` — `KanbanTask`, `KANBAN_COLUMNS`, хелперы приоритетов.
   - `updateTaskStatus(taskId, status)` в `src/app/actions/tasks.ts` — `auth()`, проверка членства, `revalidatePath` для `/board` и проекта.
   - Drag-and-drop между колонками TODO → IN_PROGRESS → REVIEW → TESTING → DONE; оптимистичный UI + откат при ошибке.

5) **Удалены / не создавать снова**
   - Пустые `src/app/api/login/page.tsx` и `src/app/api/register/page.tsx` (ломали validator).
   - Не создавать пустые `src/app/api/tasks/` без полноценных `route.ts` (ломает validator).

6) **Шрифт и Turbopack**
   - Geist через `@import` в `globals.css`, не через `next/font/google` (баг Turbopack с font).
   - `npm run dev:webpack` — обход паник Turbopack.
   - Путь с кириллицей (`курсач и диплом`) может ломать `next build` (Turbopack: `start byte index is not a char boundary`) — при FATAL пробовать webpack или перенос проекта в ASCII-путь.

7) **npm scripts**
   - `dev`, `dev:webpack`, `build`, `start`, `lint`.

8) **Проекты и участники (сессия май 2026)**
   - Схема: модель `ProjectMember` (`userId`, `projectId`, `role`: OWNER | MANAGER | MEMBER | VIEWER), связь `Project.members`.
   - После смены схемы выполнен `npx prisma db push` (локально). При другой БД — `migrate dev` / `db push` по процессу команды.
   - **Список проектов** `src/app/(main)/projects/page.tsx`: только проекты, где текущий пользователь в `members`; UI — карточки + `CreateProjectDialog`.
   - **Создание проекта (основной путь):**
     - `src/components/projects/create-project-dialog.tsx` (client, shadcn Dialog).
     - `src/actions/project-actions.ts` — server action `createProject(formData)`: `auth()`, валидация ключа, `prisma.project.create` + `members.create` с `role: "OWNER"`, `revalidatePath("/projects")`.
   - **Альтернативный путь (форма с useActionState):**
     - `src/components/projects/create-project-form.tsx` + `src/app/actions/projects.ts` — Zod, возвращает `CreateProjectState`; тоже создаёт `ProjectMember` с OWNER. Сейчас на `/projects` используется Dialog, не Form.
   - **Детали проекта:** `src/app/(main)/projects/[projectId]/page.tsx` — статистика, список команды.
   - **Задачи проекта:** `src/app/(main)/projects/[projectId]/tasks/page.tsx` (фильтры, список), `tasks/new`, `tasks/[taskId]/edit` + `src/app/actions/tasks.ts` (server actions create/update).
   - **Дашборд:** `src/app/(main)/dashboard/page.tsx` — агрегаты по проектам/задачам/спринтам.
   - **API:** `src/app/api/projects/route.ts` — только `GET` всех проектов **без auth** (legacy/вспомогательный; для UI списка используется Server Component + Prisma, не этот route).

ИЗВЕСТНЫЕ РИСКИ / ТЕХДОЛГ:
- `src/auth.ts` — отладочные `console.log` (убрать перед сдачей).
- `GET /api/projects` без проверки сессии — при доработке API добавить `auth()`.
- Пустые или незавершённые файлы ломают сборку: не оставлять обрезанные `page.tsx` / нулевые байты на диске; после удаления routes чистить `.next`.
- Дублирование логики создания проекта в `project-actions.ts` и `app/actions/projects.ts` — при рефакторинге свести к одному месту.
- Заглушки: analytics, backlog, planning, team, setting.

ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (локально, в `.env`):
- `DATABASE_URL` — `postgresql://USER:PASSWORD@localhost:5432/scrumo?schema=public`
- `AUTH_SECRET` — длинная случайная строка для NextAuth

Prisma:
- Конфиг: `prisma.config.ts`, схема `prisma/schema.prisma`.
- После смены схемы: `npx prisma db push` или `npx prisma migrate dev`; сид: `npx prisma db seed`.
- При странных TS-ошибках на `members`: удалить `src/generated/prisma`, выполнить `npx prisma generate`.

ЗАДАЧИ НА БУДУЩЕЕ (если пользователь не уточнил — уточнить):
- REST API задач (`/api/tasks`) с `auth()` — сейчас статус меняется через server action `updateTaskStatus`.
- Защита и фильтрация `GET /api/projects` по участнику.
- Роли проекта (MANAGER/VIEWER) в UI.
- Заглушки разделов → реальный функционал.
- `AUTH_URL` при деплое.

Если «не работает логин/БД/сборка» — проверить: `.env`, Postgres, `prisma db push` / migrate, лог dev, `npm run dev:webpack`, удаление `.next`, `npx tsc --noEmit`.
```

---

## Карта проекта (кратко)

| Область | Путь |
|--------|------|
| App Router | `src/app/` |
| Защищённый shell | `src/app/(main)/layout.tsx` — `auth()` + redirect `/login` |
| Дашборд | `src/app/(main)/dashboard/page.tsx` |
| Канбан | `src/app/(main)/board/page.tsx`, `src/components/kanban/` |
| Типы задач | `src/types/task.ts` |
| Проекты (список) | `src/app/(main)/projects/page.tsx` |
| Проект (детали) | `src/app/(main)/projects/[projectId]/page.tsx` |
| Задачи проекта | `src/app/(main)/projects/[projectId]/tasks/` |
| Создание проекта (UI) | `src/components/projects/create-project-dialog.tsx` |
| Создание проекта (action) | `src/actions/project-actions.ts` |
| Создание проекта (форма+Zod) | `src/components/projects/create-project-form.tsx`, `src/app/actions/projects.ts` |
| Задачи (server actions) | `src/app/actions/tasks.ts` |
| Публичные страницы | `src/app/login/`, `src/app/register/` |
| Prisma client | `src/lib/prisma.ts` |
| Auth | `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts` |
| Навигация | `src/lib/navigation.ts`, `src/components/layout/app-sidebar.tsx` |
| UI (shadcn) | `src/components/ui/` (`dialog`, `button`, `input`, `card`, …) |
| Prisma schema | `prisma/schema.prisma` |
| Seed | `prisma/seed.ts` |

### Модели Prisma (актуально)

| Модель | Назначение |
|--------|------------|
| `User` | Пользователь, `passwordHash`, `UserRole` |
| `Project` | Проект (`key` unique, `status`) |
| `ProjectMember` | Участник проекта + `ProjectRole` |
| `Sprint` | Спринт проекта |
| `Task` | Задача (status, priority, storyPoints, assignee) |
| `Comment` | Комментарий к задаче |

---

## Команды

```bash
npm run dev              # dev (Turbopack)
npm run dev:webpack      # dev без Turbopack
npm run build            # production build
npx tsc --noEmit         # проверка типов без сборки
npx prisma db push       # синхрон схемы с БД (dev)
npx prisma migrate dev   # миграции (если используете)
npx prisma generate      # клиент в src/generated/prisma
npx prisma db seed
```

При ошибках validator про отсутствующие `api/.../route.ts`:

```powershell
Set-Location "A:\Study\курсач и диплом\код\scrumo"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npx prisma generate
```

---

## Что не стоит делать без явного запроса

- Не возвращать `next/font/google` для Geist без проверки Turbopack.
- Не создавать `page.tsx` внутри `src/app/api/**`.
- Не подменять `PrismaPg` + Pool на сырой `{ connectionString }` у адаптера.
- Не использовать `getServerSession` из next-auth v4 — только `auth()` из `@/auth`.
- Не создавать проект без записи в `ProjectMember` — иначе проект не попадёт в список на `/projects`.

---

## История handoff (кратко)

| Период | Изменения |
|--------|-----------|
| Ранние сессии | Auth, Prisma pool, заглушки маршрутов, фикс Turbopack/font, удаление битых api pages |
| Май 2026 | `ProjectMember`, диалог создания проекта, фильтр проектов по участнику, починка обрезанных файлов, `db push`, реген Prisma client |
| Май 2026 (2) | Канбан `/board` с dnd-kit, `updateTaskStatus`, выбор проекта на доске |

---

*Файл для handoff между чатами; обновляй по мере крупных архитектурных изменений.*
