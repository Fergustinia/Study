# Handoff: Scrumo — контекст для следующего чата

Используй этот файл как **системный промпт / бриф** в начале новой сессии: скопируй раздел «Промпт для ассистента» в первое сообщение или приложи файл.

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

УЖЕ СДЕЛАНО В ПРОШЛЫХ СЕССИЯХ (не ломай без причины):

1) **Prisma + PostgreSQL + driver adapter**
   - `src/lib/prisma.ts`: `pg.Pool` (max 10) + `PrismaPg` + singleton `prisma` в dev на `globalThis`.
   - Причина: один `pg`-клиент не выдерживает параллельные `Promise.all` на дашборде → Prisma P1017 ConnectionClosed.
   - `prisma/seed.ts`: тоже Pool + `pool.end()` после `$disconnect()`.

2) **NextAuth (credentials) + клиент**
   - `src/auth.ts`: JWT-сессия, Credentials provider, bcrypt compare с `passwordHash` в БД.
   - API: `src/app/api/auth/[...nextauth]/route.ts` → `handlers` из `@/auth`.
   - Регистрация: `src/app/api/auth/register/route.ts`.
   - `src/components/providers/auth-session-provider.tsx` оборачивает приложение в `SessionProvider` из `next-auth/react` (нужно для `signIn` на клиенте).
   - Логин: `src/app/login/page.tsx` — только `<Suspense>` + `login-form.tsx`; форма в `login-form.tsx` (`useSearchParams` только внутри Suspense).

3) **Навигация и пустые страницы**
   - В сайдбаре пункты вели на **пустые** `page.tsx` → Next считал файл «не модулем», ломались переходы/сборка.
   - Добавлены минимальные заглушки: `(main)/analytics|backlog|planning|team|setting|board/page.tsx`.
   - В `src/lib/navigation.ts` исправлено: **Settings → href `/setting`**, не `/settings` (сегмент папки `setting`).

4) **Удалены ошибочные файлы**
   - Были пустые `src/app/api/login/page.tsx` и `src/app/api/register/page.tsx` — ломали `next build` / TypeScript validator. Удалены. Логин — это `/login`, не страница под `app/api/`.

5) **Шрифт и Turbopack**
   - `next/font/google` (Geist) убран из `layout.tsx` из-за бага Turbopack: `Module not found: @vercel/turbopack-next/internal/font/google/font`.
   - Geist подключается через `@import` Google Fonts в `globals.css` + `--font-sans` в `:root`.

6) **npm scripts**
   - `npm run dev:webpack` — `next dev --webpack` если Turbopack сыпется (FATAL panic, `next/document`, MODULE_UNPARSABLE).

ИЗВЕСТНЫЕ РИСКИ:
- Next 16 по умолчанию dev на Turbopack — иногда паники и странные ошибки; обход: `dev:webpack`, очистка `.next` после остановки dev-сервера.
- Путь проекта с кириллицей (`курсач и диплом`) иногда усложняет скрипты в PowerShell — при ошибках путей использовать `Set-Location` с кавычками.

ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (локально, в `.env`):
- `DATABASE_URL` — PostgreSQL, формат `postgresql://USER:PASSWORD@localhost:5432/scrumo?schema=public`
- `AUTH_SECRET` — длинная случайная строка для NextAuth

Prisma:
- Конфиг: `prisma.config.ts`, схема `prisma/schema.prisma`, клиент генерится в `src/generated/prisma` (в `.gitignore`).
- После смены схемы: `npx prisma migrate dev` / `db push` по принятому в команде процессу; сид: `npx prisma db seed`.

ЗАДАЧИ НА БУДУЩЕЕ (если пользователь не уточнил — уточнить):
- Заменить заглушки разделов (analytics, backlog, planning, board, team, setting) на реальный функционал.
- Убрать отладочные `console.log` из `src/auth.ts` при подготовке к сдаче.
- При деплое: `AUTH_URL` под канонический URL сайта; пароли БД не в репо.

Если пользователь пишет «не работает логин/БД/сборка» — сначала проверить: `.env`, запущен ли Postgres, миграции, лог dev-сервера, и при необходимости `npm run dev:webpack` и удаление `.next`.
```

---

## Карта проекта (кратко)

| Область | Путь |
|--------|------|
| App Router, страницы | `src/app/` |
| Защищён shell (сайдбар + хедер) | `src/app/(main)/layout.tsx` — `auth()` + `redirect("/login")` |
| Публичные страницы | `src/app/login/`, `src/app/register/` |
| Prisma client | `src/lib/prisma.ts` |
| Auth config | `src/auth.ts` |
| NextAuth route | `src/app/api/auth/[...nextauth]/route.ts` |
| Навигация сайдбара | `src/lib/navigation.ts` + `src/components/layout/app-sidebar.tsx` |
| Prisma schema | `prisma/schema.prisma` |
| Seed | `prisma/seed.ts` |

---

## Команды

```bash
npm run dev              # dev (Turbopack)
npm run dev:webpack      # dev без Turbopack
npm run build            # production build
npx prisma db execute --stdin   # проверка подключения: echo SELECT 1 | ...
npx prisma migrate status
npx prisma db seed
```

---

## Что не стоит делать без явного запроса

- Не возвращать `next/font/google` для Geist без проверки, что Turbopack в вашей версии Next это переваривает.
- Не создавать `page.tsx` внутри `src/app/api/**` (только `route.ts` и т.п.).
- Не подменять `PrismaPg` + Pool на сырой `{ connectionString }` у адаптера — снова появятся P1017 при параллельных запросах.

---

*Файл создан для handoff между чатами; обновляй его по мере крупных архитектурных изменений.*
