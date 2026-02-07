/**
 * Comment service: list and create comments for a task.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';
import { getTask } from './taskService.js';
import { getUserById } from './authService.js';

function rowToComment(row) {
  if (!row) return null;
  const user = getUserById(row.user_id);
  return {
    id: row.id,
    taskId: row.task_id,
    userId: row.user_id,
    userName: user?.name || '',
    text: row.text || '',
    createdAt: row.created_at,
  };
}

export function listByTask(taskId, userId) {
  const task = getTask(taskId, userId);
  if (!task) return [];
  const rows = db.prepare('SELECT * FROM comments WHERE task_id = ? ORDER BY created_at').all(taskId);
  return rows.map(rowToComment);
}

export function addComment(taskId, userId, text) {
  const task = getTask(taskId, userId);
  if (!task) return null;
  const id = genId();
  const trimmed = (text || '').trim();
  if (!trimmed) return null;
  db.prepare('INSERT INTO comments (id, task_id, user_id, text) VALUES (?, ?, ?, ?)').run(id, taskId, userId, trimmed);
  return getComment(id, userId);
}

function getComment(id, userId) {
  const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
  if (!row) return null;
  const task = getTask(row.task_id, userId);
  if (!task) return null;
  return rowToComment(row);
}
