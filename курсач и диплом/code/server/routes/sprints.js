import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as sprintService from '../services/sprintService.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const projectId = req.query.projectId;
  if (projectId) {
    const list = sprintService.listSprintsByProject(projectId, req.user.id);
    return res.json(list);
  }
  const list = sprintService.listSprintsByUser(req.user.id);
  res.json(list);
});

router.get('/:id', (req, res) => {
  const s = sprintService.getSprint(req.params.id, req.user.id);
  if (!s) return res.status(404).json({ error: 'Sprint not found' });
  res.json(s);
});

router.post('/', (req, res) => {
  const s = sprintService.createSprint(req.body, req.user.id);
  if (!s) return res.status(403).json({ error: 'Project not found or access denied' });
  res.status(201).json(s);
});

router.patch('/:id', (req, res) => {
  const s = sprintService.updateSprint(req.params.id, req.body, req.user.id);
  if (!s) return res.status(404).json({ error: 'Sprint not found' });
  res.json(s);
});

router.delete('/:id', (req, res) => {
  sprintService.deleteSprint(req.params.id, req.user.id);
  res.status(204).send();
});

export default router;
