/**
 * Auth routes: register, login, profile. Returns JWT on success.
 */

import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config.js';
import { authMiddleware } from '../middleware/auth.js';
import * as authService from '../services/authService.js';

const router = Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  const user = authService.register(name, email, password);
  if (!user) {
    return res.status(400).json({ error: 'Name already used or invalid input' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

router.post('/login', (req, res) => {
  const { nameOrEmail, password } = req.body || {};
  const user = authService.loginByNameOrEmail(nameOrEmail, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid name/email or password' });
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = authService.getUserById(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.patch('/profile', authMiddleware, (req, res) => {
  const user = authService.updateProfile(req.user.id, req.body || {});
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

router.get('/users', authMiddleware, (req, res) => {
  const list = authService.listUsers();
  res.json(list.map((u) => ({ id: u.id, name: u.name, email: u.email || '' })));
});

export default router;
