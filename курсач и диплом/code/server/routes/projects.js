import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as projectService from '../services/projectService.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const list = projectService.listProjects();
  res.json(list);
});

router.get('/:id', (req, res) => {
  const p = projectService.getProject(req.params.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(p);
});

router.post('/', (req, res) => {
  const p = projectService.createProject(req.body);
  res.status(201).json(p);
});

router.patch('/:id', (req, res) => {
  const p = projectService.updateProject(req.params.id, req.body);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(p);
});

router.put('/:id', (req, res) => {
  const p = projectService.updateProject(req.params.id, req.body);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(p);
});

router.delete('/:id', (req, res) => {
  projectService.deleteProject(req.params.id);
  res.status(204).send();
});

export default router;
