import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as commentService from '../services/commentService.js';

const router = Router();
router.use(authMiddleware);

router.get('/task/:taskId', (req, res) => {
  const list = commentService.listByTask(req.params.taskId, req.user.id);
  res.json(list);
});

router.post('/task/:taskId', (req, res) => {
  const text = req.body?.text;
  const comment = commentService.addComment(req.params.taskId, req.user.id, text);
  if (!comment) return res.status(400).json({ error: 'Task not found or empty text' });
  res.status(201).json(comment);
});

export default router;
