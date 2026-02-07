/**
 * Notification service: create and list in-app notifications for a user.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';

function rowToNotification(row) {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    body: row.body || '',
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export function create(userId, type, title, body = '') {
  const id = genId();
  db.prepare('INSERT INTO notifications (id, user_id, type, title, body) VALUES (?, ?, ?, ?, ?)').run(
    id,
    userId,
    type,
    title || '',
    body
  );
  return rowToNotification(db.prepare('SELECT * FROM notifications WHERE id = ?').get(id));
}

export function listByUser(userId, unreadOnly = false) {
  let sql = 'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 100';
  if (unreadOnly) sql = 'SELECT * FROM notifications WHERE user_id = ? AND read_at IS NULL ORDER BY created_at DESC LIMIT 100';
  const rows = db.prepare(sql).all(userId);
  return rows.map(rowToNotification);
}

export function markRead(id, userId) {
  const row = db.prepare('SELECT id FROM notifications WHERE id = ? AND user_id = ?').get(id, userId);
  if (!row) return false;
  db.prepare('UPDATE notifications SET read_at = datetime(\'now\') WHERE id = ?').run(id);
  return true;
}

export function markAllRead(userId) {
  db.prepare('UPDATE notifications SET read_at = datetime(\'now\') WHERE user_id = ? AND read_at IS NULL').run(userId);
}
