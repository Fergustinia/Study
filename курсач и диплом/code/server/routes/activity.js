import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as activityService from '../services/activityService.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const projectId = req.query.projectId;
  if (!projectId) return res.status(400).json({ error: 'projectId required' });
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 50);
  const list = activityService.listByProject(projectId, req.user.id, limit);
  res.json(list);
});

export default router;
