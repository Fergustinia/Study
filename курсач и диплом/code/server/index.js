/**
 * Scrum PM Server — REST API, JWT auth, business logic, analytics.
 * Section 4.1: Server-side implementation.
 */

import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';
import db from './db.js';

import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import sprintsRoutes from './routes/sprints.js';
import tasksRoutes from './routes/tasks.js';
import analyticsRoutes from './routes/analytics.js';
import commentsRoutes from './routes/comments.js';
import notificationsRoutes from './routes/notifications.js';
import activityRoutes from './routes/activity.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    name: 'Scrum PM API',
    version: '1.0',
    docs: 'See server/README.md',
    endpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/register, POST /api/auth/login',
      projects: 'GET/POST /api/projects, GET/PATCH/DELETE /api/projects/:id',
      sprints: 'GET /api/sprints?projectId=, POST /api/sprints, ...',
      tasks: 'GET /api/tasks?projectId=&sprintId=, POST /api/tasks, ...',
      analytics: 'GET /api/analytics/velocity?projectId=, /burndown, /cycle-time, ...',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/sprints', sprintsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/activity', activityRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: 'sqlite' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Scrum PM API running at http://localhost:${PORT}`);
});
