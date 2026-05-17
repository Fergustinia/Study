# Handoff: Scrumo — контекст для следующего чата

Используй этот файл как **системный промпт / бриф** в начале новой сессии: скопируй раздел «Промпт для ассистента» в первое сообщение или приложи файл.

**Последнее обновление handoff:** май 2026 — полный UI всех разделов, навигация, спринты, бэклог, аналитика, команда, настройки.

---

## Промпт для ассистента (вставить в новый чат)

```
Ты продолжаешь работу над проектом Scrumo (курсовой/дипломный код).

Репозиторий: Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 + Prisma 7 + PostgreSQL + NextAuth v5 (beta) + shadcn-стиль UI.

Корень проекта: `курсач и диплом/код/scrumo` (в workspace: `A:\Study\курсач и диплом\код\scrumo`).

ОБЯЗАТЕЛЬНО:
- Читай существующий код перед правками; не делай рефакторинг «заодно».
- Не коммить секреты; `.env` не должен попадать в публичные репо с реальными паролями.
- Пользователь предпочитает русский язык в ответах.
- Для проверки сессии на сервере: `auth()` из `@/auth`, НЕ `getServerSession` (NextAuth v5).
- Проверка доступа к проекту: `requireUserId()` / `requireProjectMember()` из `@/lib/access`.
- URL настроек: `/setting` (папка `setting`, не `settings`).

УЖЕ СДЕЛАНО (не ломай без причины):

1) **Prisma + PostgreSQL**
   - `src/lib/prisma.ts`: `pg.Pool` (max 10) + `PrismaPg` + singleton в dev на `globalThis`.
   - Клиент: `src/generated/prisma` (в `.gitignore`), импорт `@/generated/prisma/client`.
   - Схема: `prisma/schema.prisma` — User, Project, ProjectMember, Sprint, Task, Comment.
   - Сид: `prisma/seed.ts` — `npx prisma db seed`.

2) **Auth**
   - `src/auth.ts` — JWT, Credentials, bcrypt.
   - `src/app/api/auth/[...nextauth]/route.ts`, `src/app/api/auth/register/route.ts`.
   - Логин/регистрация: `src/app/login/`, `src/app/register/`.
   - Типы: `src/types/next-auth.d.ts` (`session.user.id`, `role`).

3) **Layout и навигация**
   - `src/app/(main)/layout.tsx` — auth, проекты пользователя, `ProjectProvider`, `AppShell`.
   - `src/components/layout/` — актуальная цепочка:
     - `app-shell.tsx` — client: мобильное меню + sidebar + header.
     - `app-sidebar.tsx` — desktop sidebar + mobile drawer.
     - `sidebar-nav.tsx` — пункты меню + `ProjectSwitcher`.
     - `app-header-bar.tsx` — заголовок страницы, пользователь, кнопка меню (lg:hidden).
     - `sign-out-button.tsx` — server action выхода.
   - `src/lib/navigation.ts` — единый список маршрутов (русские названия), `isNavItemActive()`, `getPageTitle()`.
   - **Не использовать** (мёртвый код, можно удалить): `header.tsx`, `sidebar.tsx`, `top-header.tsx`, `app-header.tsx`.
   - `src/contexts/project-context.tsx` — `activeProject` в localStorage; switcher в сайдбаре.
   - **Важно:** доска `/board` выбирает проект через URL `?projectId=`, а не через `ProjectProvider` — при доработке можно синхронизировать.

4) **Все основные страницы (реализованы, не заглушки)**

   | Маршрут | Файл | Что делает |
   |---------|------|------------|
   | `/dashboard` | `dashboard/page.tsx` | Статистика, проекты, последние задачи, быстрые ссылки |
   | `/projects` | `projects/page.tsx` | Список проектов (только где user в members), создание |
   | `/projects/[id]` | `projects/[projectId]/page.tsx` | Детали, команда, ссылки на доску/задачи/бэклог/планирование |
   | `/projects/[id]/tasks` | `.../tasks/page.tsx` | Фильтры, список, StatCard |
   | `/projects/[id]/tasks/new` | `.../tasks/new/page.tsx` | `CreateTaskForm` |
   | `/projects/[id]/tasks/[taskId]/edit` | `.../edit/page.tsx` | `EditTaskForm` |
   | `/board` | `board/page.tsx` | Kanban + dnd-kit, `?projectId=` |
   | `/backlog` | `backlog/page.tsx` | Задачи без спринта, назначение в спринт |
   | `/planning` | `planning/page.tsx` | Спринты: создание, статусы, задачи в спринте |
   | `/analytics` | `analytics/page.tsx` | Метрики и прогресс-бары по статусам/приоритетам |
   | `/team` | `team/page.tsx` | Участники всех доступных проектов |
   | `/setting` | `setting/page.tsx` | Профиль (имя), email readonly |

   Общий паттерн для backlog/planning/analytics/board:
   - `getProjectsForUser()` + `resolveSelectedProjectId()` из `src/lib/projects.ts`
   - `ProjectPageSelect` — `src/components/shared/project-page-select.tsx`
   - `EmptyProjectsState` — пустое состояние без проектов

5) **Server actions**

   | Файл | Функции |
   |------|---------|
   | `src/app/actions/tasks.ts` | `createTask`, `updateTask`, `updateTaskStatus` — с `auth()` и проверкой членства |
   | `src/app/actions/sprints.ts` | `createSprint`, `updateSprintStatus`, `assignTaskToSprint` |
   | `src/app/actions/settings.ts` | `updateProfile` (имя) |
   | `src/app/actions/projects.ts` | `createProject` (Zod + useActionState) — **не используется в UI** |
   | `src/actions/project-actions.ts` | `createProject` — **используется** в `CreateProjectDialog` |

6) **Канбан**
   - `src/components/kanban/` — board, column, task-card, board-project-select.
   - `updateTaskStatus` — optimistic UI + откат.
   - `src/types/task.ts` — статусы, колонки, лейблы.

7) **Компоненты фич**
   - `components/sprints/` — `create-sprint-dialog.tsx`, `sprint-status-actions.tsx`
   - `components/tasks/` — create/edit forms, `assign-sprint-select.tsx`
   - `components/settings/` — `settings-form.tsx`
   - `components/shared/` — `stat-card`, `project-page-select`, `empty-projects-state`

8) **Инфраструктура**
   - Geist через `@import` в `globals.css` (не `next/font/google` — баг Turbopack).
   - `npm run dev:webpack` — обход паник Turbopack.
   - Путь с кириллицей может ломать `next build` (Turbopack) — тогда webpack или ASCII-путь.
   - `npm run build` проходит успешно (проверено май 2026).

9) **Не создавать снова**
   - Пустые `src/app/api/login/page.tsx`, `src/app/api/register/page.tsx`.
   - Пустые папки `src/app/api/tasks/` без `route.ts`.
   - Проект без `ProjectMember` — иначе не виден в `/projects`.

ИЗВЕСТНЫЕ РИСКИ / ТЕХДОЛГ:
- `src/auth.ts` — отладочные `console.log` (убрать перед сдачей).
- `GET /api/projects` без auth — legacy, UI не использует.
- Дублирование `createProject` в `project-actions.ts` и `app/actions/projects.ts`.
- Модель `Comment` в схеме — **нет UI и actions**.
- `recharts` в package.json — **не используется** (аналитика на CSS-барах).
- `ProjectSwitcher` (localStorage) не связан с `?projectId=` на доске/бэклоге.
- Нет смены пароля в настройках.
- Нет приглашения участников / смены ролей в UI (только просмотр в Team и на странице проекта).
- Нет удаления задач/проектов/спринтов.
- `createTask`/`updateTask` — assignee не проверяется на членство в проекте (только существование User).
- Роли `UserRole` / `ProjectRole` в БД есть, в UI почти не используются (кроме отображения).
- Мёртвые файлы layout: `header.tsx`, `sidebar.tsx`, `top-header.tsx`, `app-header.tsx`.

ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (`.env`):
- `DATABASE_URL` — `postgresql://USER:PASSWORD@localhost:5432/scrumo?schema=public`
- `AUTH_SECRET` — случайная строка для NextAuth
- `AUTH_URL` — при деплое (например `http://localhost:3000`)

Prisma:
- `prisma.config.ts`, схема `prisma/schema.prisma`.
- После смены схемы: `npx prisma db push` или `migrate dev`; сид: `npx prisma db seed`.
- TS-ошибки на `members`: удалить `src/generated/prisma`, `npx prisma generate`.

ЗАДАЧИ НА ДОРАБОТКУ (приоритет для «сделать всё»):

**Высокий приоритет (продукт / курсовой)**
- [ ] Комментарии к задачам (`Comment` + UI на edit task page).
- [ ] Синхронизация выбора проекта: `ProjectProvider` ↔ `?projectId=` на board/backlog/planning/analytics.
- [ ] Удаление задачи (action + кнопка на edit/list).
- [ ] Приглашение участника в проект (email → User + ProjectMember).
- [ ] Смена пароля в `/setting`.
- [ ] Убрать `console.log` из `auth.ts`.
- [ ] Защитить или удалить `GET /api/projects`.

**Средний приоритет (UX / polish)**
- [ ] Recharts на `/analytics` (уже в dependencies).
- [ ] Редактирование/удаление спринта.
- [ ] Drag задач из бэклога в спринт (или bulk-assign).
- [ ] Фильтры на бэклоге (приоритет, поиск).
- [ ] Ссылки с карточек Kanban на edit task.
- [ ] Avatar (`components/ui/avatar.tsx`) в header и team.
- [ ] Удалить мёртвые layout-файлы.
- [ ] Свести создание проекта к одному action.

**Низкий приоритет / деплой**
- [ ] REST API задач с `auth()` (если нужен для диплома).
- [ ] Роли MANAGER/VIEWER — ограничения в actions (кто может создавать спринт, удалять задачу).
- [ ] Архивация проекта (`ProjectStatus.ARCHIVED`).
- [ ] Email-уведомления, activity log.
- [ ] E2E-тесты (Playwright).

Если «не работает» — проверить: `.env`, Postgres, `prisma db push`, лог dev, `npm run dev:webpack`, удалить `.next`, `npx tsc --noEmit`.
```

---

## Статус страниц (актуально)

| Раздел | Статус | Ключевые файлы |
|--------|--------|----------------|
| Дашборд | ✅ Готово | `dashboard/page.tsx` |
| Проекты | ✅ Готово | `projects/page.tsx`, `create-project-dialog.tsx` |
| Проект (детали) | ✅ Готово | `projects/[projectId]/page.tsx` |
| Задачи CRUD | ✅ Готово | `tasks/page.tsx`, `tasks/new`, `tasks/.../edit`, `actions/tasks.ts` |
| Доска | ✅ Готово | `board/page.tsx`, `components/kanban/` |
| Бэклог | ✅ Готово | `backlog/page.tsx`, `assign-sprint-select.tsx` |
| Планирование | ✅ Готово | `planning/page.tsx`, `actions/sprints.ts`, sprint components |
| Аналитика | ✅ Готово (базово) | `analytics/page.tsx` — CSS-бары, без recharts |
| Команда | ✅ Готово (просмотр) | `team/page.tsx` |
| Настройки | ✅ Готово (имя) | `setting/page.tsx`, `actions/settings.ts` |
| Комментарии | ❌ Нет UI | модель `Comment` в Prisma |
| API tasks | ❌ Нет | только server actions |

---

## Карта проекта

| Область | Путь |
|--------|------|
| App Router | `src/app/` |
| Защищённый shell | `src/app/(main)/layout.tsx` |
| Доступ | `src/lib/access.ts` |
| Проекты (хелперы) | `src/lib/projects.ts` |
| Навигация | `src/lib/navigation.ts` |
| Layout UI | `src/components/layout/app-shell.tsx`, `app-sidebar.tsx`, `sidebar-nav.tsx`, `app-header-bar.tsx` |
| Контекст проекта | `src/contexts/project-context.tsx` |
| Дашборд | `src/app/(main)/dashboard/page.tsx` |
| Канбан | `src/app/(main)/board/page.tsx`, `src/components/kanban/` |
| Бэклог | `src/app/(main)/backlog/page.tsx` |
| Планирование | `src/app/(main)/planning/page.tsx` |
| Аналитика | `src/app/(main)/analytics/page.tsx` |
| Команда | `src/app/(main)/team/page.tsx` |
| Настройки | `src/app/(main)/setting/page.tsx` |
| Типы задач | `src/types/task.ts` |
| Типы спринтов/ролей | `src/types/sprint.ts` |
| Server actions | `src/app/actions/tasks.ts`, `sprints.ts`, `settings.ts`, `projects.ts` |
| Создание проекта (UI) | `src/components/projects/create-project-dialog.tsx` |
| Создание проекта (action) | `src/actions/project-actions.ts` |
| Prisma | `prisma/schema.prisma`, `src/lib/prisma.ts` |
| Auth | `src/auth.ts`, `src/app/api/auth/` |

### Модели Prisma

| Модель | Назначение | UI |
|--------|------------|-----|
| `User` | Пользователь, `passwordHash`, `UserRole` | login, settings, team |
| `Project` | Проект (`key` unique) | projects, dashboard |
| `ProjectMember` | Участник + `ProjectRole` | team, project page |
| `Sprint` | Спринт (`PLANNED`/`ACTIVE`/`COMPLETED`) | planning, backlog assign |
| `Task` | Задача (status, priority, storyPoints, sprintId?) | tasks, board, backlog |
| `Comment` | Комментарий к задаче | **не реализовано** |

### Enums

`UserRole`, `ProjectRole`, `ProjectStatus`, `SprintStatus`, `TaskStatus`, `TaskPriority` — см. `prisma/schema.prisma`.

---

## Server actions (кратко)

### `tasks.ts`
- `createTask` / `updateTask` — Zod, membership check, redirect.
- `updateTaskStatus` — для Kanban DnD, возвращает `{ success, error? }`.
- `revalidateTaskViews()` — board, backlog, planning, analytics, dashboard, project paths.

### `sprints.ts`
- `createSprint` — диалог на planning.
- `updateSprintStatus` — при `ACTIVE` остальные ACTIVE → `PLANNED`.
- `assignTaskToSprint` — из бэклога (`sprintId` пустой = убрать из спринта).

### `settings.ts`
- `updateProfile` — только `name`.

---

## Потоки данных (для доработки)

```
Пользователь → (main)/layout
  → ProjectProvider (localStorage: activeProject)
  → AppShell
       → AppSidebar → SidebarNav → ProjectSwitcher
       → AppHeaderBar → getPageTitle(pathname)
       → children (страницы)

Страницы с выбором проекта:
  board, backlog, planning, analytics
  → ?projectId= в URL (НЕ из ProjectProvider)

Создание задачи:
  CreateTaskForm → createTask → redirect /projects/[id]

Kanban:
  drag → updateTaskStatus → revalidate
```

---

## Команды

```bash
npm run dev              # dev (Turbopack)
npm run dev:webpack      # dev без Turbopack
npm run build            # production build
npm run start            # production server
npm run lint             # eslint
npx tsc --noEmit         # типы без сборки
npx prisma db push       # синхрон схемы (dev)
npx prisma migrate dev   # миграции
npx prisma generate      # клиент → src/generated/prisma
npx prisma db seed       # тестовые данные
```

При ошибках validator / битой сборке:

```powershell
Set-Location "A:\Study\курсач и диплом\код\scrumo"
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npx prisma generate
npm run build
```

---

## Что не стоит делать без явного запроса

- Не возвращать `next/font/google` для Geist без проверки Turbopack.
- Не создавать `page.tsx` внутри `src/app/api/**`.
- Не подменять `PrismaPg` + Pool на сырой `{ connectionString }`.
- Не использовать `getServerSession` — только `auth()` из `@/auth`.
- Не создавать проект без `ProjectMember` (role OWNER).
- Не менять URL `/setting` на `/settings` без переименования папки.

---

## История handoff

| Период | Изменения |
|--------|-----------|
| Ранние сессии | Auth, Prisma pool, заглушки маршрутов, Turbopack/font |
| Май 2026 | `ProjectMember`, диалог проекта, задачи CRUD |
| Май 2026 (2) | Kanban `/board`, dnd-kit, `updateTaskStatus` |
| Май 2026 (3) | Единая навигация: `AppShell`, mobile menu, `ProjectProvider` |
| Май 2026 (4) | Все разделы: backlog, planning, analytics, team, settings; sprint actions; auth на tasks |

---

*Обновляй этот файл после крупных архитектурных изменений или перед новым чатом.*
