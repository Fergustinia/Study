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

/** Create notifications for sprints ending in 1–2 days (at most one per sprint per day). */
export function ensureSprintReminders(userId) {
  const projects = db.prepare('SELECT id FROM projects WHERE owner_id = ?').all(userId);
  if (projects.length === 0) return [];
  const projectIds = projects.map((p) => p.id);
  const placeholders = projectIds.map(() => '?').join(',');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(now);
  dayAfter.setDate(dayAfter.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const dayAfterStr = dayAfter.toISOString().slice(0, 10);
  const sprints = db.prepare(
    `SELECT id, name, end_date, project_id FROM sprints WHERE project_id IN (${placeholders}) AND (date(end_date) = date(?) OR date(end_date) = date(?))`
  ).all(...projectIds, tomorrowStr, dayAfterStr);
  const created = [];
  for (const s of sprints) {
    const existing = db.prepare(
      `SELECT id FROM notifications WHERE user_id = ? AND type = 'sprint_ending' AND body = ? AND datetime(created_at) > datetime('now', '-1 day')`
    ).get(userId, s.id);
    if (existing) continue;
    const daysLeft = Math.ceil((new Date(s.end_date) - now) / (24 * 60 * 60 * 1000));
    const title = daysLeft === 1 ? `Спринт «${s.name}» завтра заканчивается` : `До конца спринта «${s.name}» 2 дня`;
    const n = create(userId, 'sprint_ending', title, s.id);
    if (n) created.push(n);
  }
  return created;
}
