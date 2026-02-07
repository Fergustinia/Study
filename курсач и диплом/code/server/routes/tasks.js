import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as taskService from '../services/taskService.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const projectId = req.query.projectId;
  if (projectId) {
    const sprintId = req.query.sprintId;
    const resolved = sprintId === undefined ? undefined : sprintId === '' || sprintId === 'null' ? null : sprintId;
    const list = taskService.listTasks(projectId, resolved, req.user.id);
    return res.json(list);
  }
  const list = taskService.listTasksByUser(req.user.id);
  res.json(list);
});

router.get('/:id', (req, res) => {
  const t = taskService.getTask(req.params.id, req.user.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  res.json(t);
});

router.post('/', (req, res) => {
  const t = taskService.createTask(req.body, req.user.id);
  if (!t) return res.status(403).json({ error: 'Project not found or access denied' });
  res.status(201).json(t);
});

router.patch('/:id', (req, res) => {
  const t = taskService.updateTask(req.params.id, req.body, req.user.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  res.json(t);
});

router.put('/:id', (req, res) => {
  const t = taskService.updateTask(req.params.id, req.body, req.user.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  res.json(t);
});

router.post('/:id/status', (req, res) => {
  const { status, sprintId } = req.body || {};
  const t = taskService.setTaskStatus(req.params.id, status, sprintId, req.user.id);
  if (!t) return res.status(404).json({ error: 'Task not found' });
  res.json(t);
});

router.delete('/:id', (req, res) => {
  taskService.deleteTask(req.params.id, req.user.id);
  res.status(204).send();
});

export default router;
