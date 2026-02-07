/**
 * Task management service: CRUD, status changes, assignee, change history consideration.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';

function rowToTask(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    sprintId: row.sprint_id,
    title: row.title,
    description: row.description || '',
    storyPoints: row.story_points ?? 0,
    status: row.status || 'todo',
    priority: row.priority || 'medium',
    type: row.type || 'task',
    assigneeId: row.assignee_id,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

export function listTasks(projectId, sprintId) {
  let sql = 'SELECT * FROM tasks WHERE project_id = ?';
  const params = [projectId];
  if (sprintId === null) {
    sql += ' AND sprint_id IS NULL';
  } else if (sprintId) {
    sql += ' AND sprint_id = ?';
    params.push(sprintId);
  }
  sql += ' ORDER BY created_at';
  const rows = db.prepare(sql).all(...params);
  return rows.map(rowToTask);
}

export function getTask(id) {
  return rowToTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
}

export function createTask(data) {
  const id = data.id || genId();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO tasks (id, project_id, sprint_id, title, description, story_points, status, priority, type, assignee_id, created_at, started_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    data.projectId,
    data.sprintId || null,
    (data.title || '').trim(),
    (data.description || '').trim(),
    data.storyPoints ?? 0,
    data.status || 'todo',
    data.priority || 'medium',
    data.type || 'task',
    data.assigneeId || null,
    data.createdAt || now,
    data.startedAt || null,
    data.completedAt || null
  );
  return getTask(id);
}

export function updateTask(id, data) {
  const t = getTask(id);
  if (!t) return null;
  const sprintId = data.sprintId !== undefined ? data.sprintId : t.sprintId;
  const status = data.status !== undefined ? data.status : t.status;
  let startedAt = t.startedAt;
  let completedAt = t.completedAt;
  if (status === 'in_progress' && !t.startedAt) startedAt = new Date().toISOString();
  if (status === 'done') completedAt = new Date().toISOString();

  db.prepare(
    `UPDATE tasks SET project_id = ?, sprint_id = ?, title = ?, description = ?, story_points = ?, status = ?, priority = ?, type = ?, assignee_id = ?, started_at = ?, completed_at = ? WHERE id = ?`
  ).run(
    data.projectId ?? t.projectId,
    sprintId,
    (data.title ?? t.title).trim(),
    (data.description ?? t.description).trim(),
    data.storyPoints ?? t.storyPoints,
    status,
    data.priority ?? t.priority,
    data.type ?? t.type,
    data.assigneeId !== undefined ? data.assigneeId : t.assigneeId,
    startedAt,
    completedAt,
    id
  );
  return getTask(id);
}

export function setTaskStatus(taskId, status, sprintId) {
  const t = getTask(taskId);
  if (!t) return null;
  return updateTask(taskId, { ...t, status, sprintId: sprintId !== undefined ? sprintId : t.sprintId });
}

export function deleteTask(id) {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}
