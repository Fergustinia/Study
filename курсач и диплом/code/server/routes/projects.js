import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as projectService from '../services/projectService.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const list = projectService.listProjects(req.user.id);
  res.json(list);
});

router.get('/:id', (req, res) => {
  const p = projectService.getProject(req.params.id, req.user.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(p);
});

router.post('/', (req, res) => {
  const p = projectService.createProject(req.body, req.user.id);
  res.status(201).json(p);
});

router.patch('/:id', (req, res) => {
  const p = projectService.updateProject(req.params.id, req.body, req.user.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(p);
});

router.put('/:id', (req, res) => {
  const p = projectService.updateProject(req.params.id, req.body, req.user.id);
  if (!p) return res.status(404).json({ error: 'Project not found' });
  res.json(p);
});

router.delete('/:id', (req, res) => {
  projectService.deleteProject(req.params.id, req.user.id);
  res.status(204).send();
});

router.get('/:id/members', (req, res) => {
  if (!projectService.isProjectAccessibleBy(req.params.id, req.user.id)) {
    return res.status(404).json({ error: 'Project not found' });
  }
  const list = projectService.getProjectMembers(req.params.id, req.user.id);
  res.json(list);
});

router.post('/:id/members', (req, res) => {
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const list = projectService.addProjectMember(req.params.id, userId, req.user.id);
  if (!list) return res.status(403).json({ error: 'Only project owner can add members' });
  res.json(list);
});

router.delete('/:id/members/:userId', (req, res) => {
  const list = projectService.removeProjectMember(req.params.id, req.params.userId, req.user.id);
  if (!list && !projectService.isProjectAccessibleBy(req.params.id, req.user.id)) {
    return res.status(404).json({ error: 'Project not found' });
  }
  if (!list) return res.status(403).json({ error: 'Only project owner can remove members' });
  res.json(list);
});

export default router;
