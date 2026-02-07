import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as notificationService from '../services/notificationService.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const unreadOnly = req.query.unreadOnly === 'true';
  const list = notificationService.listByUser(req.user.id, unreadOnly);
  res.json(list);
});

router.patch('/:id/read', (req, res) => {
  const ok = notificationService.markRead(req.params.id, req.user.id);
  if (!ok) return res.status(404).json({ error: 'Notification not found' });
  res.json({ ok: true });
});

router.post('/read-all', (req, res) => {
  notificationService.markAllRead(req.user.id);
  res.json({ ok: true });
});

router.post('/check-sprint-reminders', (req, res) => {
  const created = notificationService.ensureSprintReminders(req.user.id);
  res.json({ created: created.length });
});

export default router;
