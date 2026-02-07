
REST API, JWT authentication, business logic and analytics layer.

## Run

```bash
npm install
npm run dev
```

API base: `http://localhost:3001`

## Environment

- `PORT` — default 3001
- `JWT_SECRET` — secret for JWT signing
- `DB_PATH` — path to SQLite file (default: `./scrum_pm.db`)

## API

### Auth (no JWT required)

- `POST /api/auth/register` — body: `{ name, email?, password }` → `{ user, token }`
- `POST /api/auth/login` — body: `{ nameOrEmail, password }` → `{ user, token }`
- `GET /api/auth/me` — header `Authorization: Bearer <token>` → `{ user }`
- `PATCH /api/auth/profile` — protected; body `{ name?, email? }` → `{ user }`

### Protected (header: `Authorization: Bearer <token>`)

- **Projects:** `GET/POST /api/projects`, `GET/PATCH/DELETE /api/projects/:id`. Projects list includes those where user is owner or member.  
  **Members:** `GET /api/projects/:id/members`, `POST /api/projects/:id/members` body `{ userId }`, `DELETE /api/projects/:id/members/:userId` (only owner).
- **Sprints:** `GET /api/sprints?projectId=`, `POST /api/sprints`, `GET/PATCH/DELETE /api/sprints/:id`
- **Tasks:** `GET /api/tasks?projectId=&sprintId=`, `POST /api/tasks`, `GET/PATCH/DELETE /api/tasks/:id`, `POST /api/tasks/:id/status` body `{ status, sprintId? }`
- **Analytics:**  
  - `GET /api/analytics/velocity?projectId=`
  - `GET /api/analytics/burndown?sprintId=`
  - `GET /api/analytics/cycle-time?projectId=&sprintId=`
  - `GET /api/analytics/lead-time?projectId=&sprintId=`
  - `GET /api/analytics/sprint-progress?projectId=`
  - `GET /api/analytics/done-by-type?projectId=`
- **Users (for assignee):** `GET /api/auth/users` — list users (id, name, email).
- **Comments:** `GET /api/comments/task/:taskId`, `POST /api/comments/task/:taskId` body `{ text }`.
- **Notifications:** `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `POST /api/notifications/read-all`, `POST /api/notifications/check-sprint-reminders` (creates reminders for sprints ending in 1–2 days).
- **Activity:** `GET /api/activity?projectId=`

Tasks support `dueAt` (ISO date); sprints support `retro` (retrospective notes).
