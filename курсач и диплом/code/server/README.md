# Scrum PM — Server (Section 4.1)

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

### Protected (header: `Authorization: Bearer <token>`)

- **Projects:** `GET/POST /api/projects`, `GET/PATCH/DELETE /api/projects/:id`
- **Sprints:** `GET /api/sprints?projectId=`, `POST /api/sprints`, `GET/PATCH/DELETE /api/sprints/:id`
- **Tasks:** `GET /api/tasks?projectId=&sprintId=`, `POST /api/tasks`, `GET/PATCH/DELETE /api/tasks/:id`, `POST /api/tasks/:id/status` body `{ status, sprintId? }`
- **Analytics:**  
  - `GET /api/analytics/velocity?projectId=`
  - `GET /api/analytics/burndown?sprintId=`
  - `GET /api/analytics/cycle-time?projectId=&sprintId=`
  - `GET /api/analytics/lead-time?projectId=&sprintId=`
  - `GET /api/analytics/sprint-progress?projectId=`
  - `GET /api/analytics/done-by-type?projectId=`
