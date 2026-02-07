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

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/sprints', sprintsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/analytics', analyticsRoutes);

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
