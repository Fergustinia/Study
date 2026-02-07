import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as analyticsService from '../services/analyticsService.js';

const router = Router();
router.use(authMiddleware);

router.get('/velocity', (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });
  const data = analyticsService.getVelocityBySprint(projectId, req.user.id);
  res.json(data);
});

router.get('/burndown', (req, res) => {
  const sprintId = req.query.sprintId;
  if (!sprintId) return res.status(400).json({ error: 'sprintId required' });
  const data = analyticsService.getBurndown(sprintId, req.user.id);
  if (!data) return res.status(404).json({ error: 'Sprint not found' });
  res.json(data);
});

router.get('/cycle-time', (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });
  const sprintId = req.query.sprintId || null;
  const data = analyticsService.getCycleTime(projectId, sprintId, req.user.id);
  res.json(data);
});

router.get('/lead-time', (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });
  const sprintId = req.query.sprintId || null;
  const data = analyticsService.getLeadTime(projectId, sprintId, req.user.id);
  res.json(data);
});

router.get('/sprint-progress', (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });
  const data = analyticsService.getSprintProgress(projectId, req.user.id);
  res.json(data);
});

router.get('/done-by-type', (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });
  const data = analyticsService.getDoneByType(projectId, req.user.id);
  res.json(data);
});

export default router;
