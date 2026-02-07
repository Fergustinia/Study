/**
 * Authentication service: user registration and login.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

export function register(name, email, password) {
  const trimmedName = (name || '').trim();
  const trimmedEmail = (email || '').trim();
  if (!trimmedName || !password) return null;

  const existing = db.prepare('SELECT id FROM users WHERE LOWER(name) = LOWER(?) OR (email != "" AND LOWER(email) = LOWER(?))').get(trimmedName, trimmedEmail);
  if (existing) return null;

  const id = genId();
  const passwordHash = hashPassword(password);
  db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(id, trimmedName, trimmedEmail, passwordHash);
  return { id, name: trimmedName, email: trimmedEmail };
}

export function loginByNameOrEmail(nameOrEmail, password) {
  const u = db.prepare('SELECT id, name, email, password_hash FROM users WHERE LOWER(name) = LOWER(?) OR LOWER(email) = LOWER(?)').get((nameOrEmail || '').trim(), (nameOrEmail || '').trim());
  if (!u || !verifyPassword(password, u.password_hash)) return null;
  return { id: u.id, name: u.name, email: u.email };
}

export function getUserById(id) {
  return db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(id) || null;
}

/** List all users (id, name, email) for assignee selection. */
export function listUsers() {
  const rows = db.prepare('SELECT id, name, email FROM users ORDER BY name').all();
  return rows;
}

export function updateProfile(userId, updates) {
  const name = updates.name !== undefined ? (updates.name || '').trim() : null;
  const email = updates.email !== undefined ? (updates.email || '').trim() : null;
  if (name === null && email === null) return getUserById(userId);
  const user = getUserById(userId);
  if (!user) return null;
  if (name !== null) {
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, userId);
  }
  if (email !== null) {
    db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, userId);
  }
  return getUserById(userId);
}
