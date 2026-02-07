/**
 * Task management service: CRUD, status changes, assignee, activity and notifications.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';
import { isProjectAccessibleBy, getAccessibleProjectIds } from './projectService.js';
import * as activityService from './activityService.js';
import * as notificationService from './notificationService.js';

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
    dueAt: row.due_at,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

export function listTasks(projectId, sprintId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return [];
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

export function listTasksByUser(userId) {
  const projectIds = getAccessibleProjectIds(userId);
  if (projectIds.length === 0) return [];
  const placeholders = projectIds.map(() => '?').join(',');
  const rows = db.prepare(`SELECT * FROM tasks WHERE project_id IN (${placeholders}) ORDER BY created_at`).all(...projectIds);
  return rows.map(rowToTask);
}

export function getTask(id, userId) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!row || !isProjectAccessibleBy(row.project_id, userId)) return null;
  return rowToTask(row);
}

export function createTask(data, userId) {
  if (!isProjectAccessibleBy(data.projectId, userId)) return null;
  const id = data.id || genId();
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO tasks (id, project_id, sprint_id, title, description, story_points, status, priority, type, assignee_id, due_at, created_at, started_at, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
    data.dueAt || null,
    data.createdAt || now,
    data.startedAt || null,
    data.completedAt || null
  );
  const task = getTask(id, userId);
  if (task) {
    activityService.log(data.projectId, userId, 'task_created', 'task', id, { title: task.title });
    if (data.assigneeId && data.assigneeId !== userId) {
      notificationService.create(data.assigneeId, 'task_assigned', 'You were assigned to a task', task.title);
    }
  }
  return task;
}

export function updateTask(id, data, userId) {
  const t = getTask(id, userId);
  if (!t) return null;
  const sprintId = data.sprintId !== undefined ? data.sprintId : t.sprintId;
  const status = data.status !== undefined ? data.status : t.status;
  let startedAt = t.startedAt;
  let completedAt = t.completedAt;
  if (status === 'in_progress' && !t.startedAt) startedAt = new Date().toISOString();
  if (status === 'done') completedAt = new Date().toISOString();

  db.prepare(
    `UPDATE tasks SET project_id = ?, sprint_id = ?, title = ?, description = ?, story_points = ?, status = ?, priority = ?, type = ?, assignee_id = ?, due_at = ?, started_at = ?, completed_at = ? WHERE id = ?`
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
    data.dueAt !== undefined ? data.dueAt : t.dueAt,
    startedAt,
    completedAt,
    id
  );
  const updated = getTask(id, userId);
  if (updated) {
    const newAssigneeId = data.assigneeId !== undefined ? data.assigneeId : t.assigneeId;
    if (newAssigneeId && newAssigneeId !== t.assigneeId) {
      notificationService.create(newAssigneeId, 'task_assigned', 'You were assigned to a task', updated.title);
      activityService.log(t.projectId, userId, 'assignee_changed', 'task', id, { title: updated.title });
    }
    if (status !== t.status) {
      activityService.log(t.projectId, userId, 'status_changed', 'task', id, { from: t.status, to: status, title: updated.title });
    }
  }
  return updated;
}

export function setTaskStatus(taskId, status, sprintId, userId) {
  const t = getTask(taskId, userId);
  if (!t) return null;
  return updateTask(taskId, { ...t, status, sprintId: sprintId !== undefined ? sprintId : t.sprintId }, userId);
}

export function deleteTask(id, userId) {
  const t = getTask(id, userId);
  if (!t) return;
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
}
