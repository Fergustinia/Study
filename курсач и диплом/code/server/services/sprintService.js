/**
 * Sprint management service: create, update, delete sprints and time boundaries for metrics.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';
import { isProjectOwnedBy } from './projectService.js';

function rowToSprint(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    goal: row.goal || '',
    retro: row.retro || '',
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
  };
}

export function listSprintsByProject(projectId, userId) {
  if (!isProjectOwnedBy(projectId, userId)) return [];
  const rows = db.prepare('SELECT * FROM sprints WHERE project_id = ? ORDER BY start_date').all(projectId);
  return rows.map(rowToSprint);
}

export function listSprintsByUser(userId) {
  const projectIds = db.prepare('SELECT id FROM projects WHERE owner_id = ?').all(userId).map((r) => r.id);
  if (projectIds.length === 0) return [];
  const placeholders = projectIds.map(() => '?').join(',');
  const rows = db.prepare(`SELECT * FROM sprints WHERE project_id IN (${placeholders}) ORDER BY start_date`).all(...projectIds);
  return rows.map(rowToSprint);
}

export function getSprint(id, userId) {
  const row = db.prepare('SELECT * FROM sprints WHERE id = ?').get(id);
  if (!row || !isProjectOwnedBy(row.project_id, userId)) return null;
  return rowToSprint(row);
}

export function createSprint(data, userId) {
  if (!isProjectOwnedBy(data.projectId, userId)) return null;
  const id = data.id || genId();
  db.prepare(
    'INSERT INTO sprints (id, project_id, name, goal, retro, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    id,
    data.projectId,
    (data.name || '').trim(),
    (data.goal || '').trim(),
    (data.retro || '').trim(),
    data.startDate,
    data.endDate
  );
  return getSprint(id, userId);
}

export function updateSprint(id, data, userId) {
  const s = getSprint(id, userId);
  if (!s) return null;
  db.prepare(
    'UPDATE sprints SET name = ?, goal = ?, retro = ?, start_date = ?, end_date = ? WHERE id = ?'
  ).run(
    (data.name ?? s.name).trim(),
    (data.goal ?? s.goal).trim(),
    (data.retro ?? s.retro ?? '').trim(),
    data.startDate ?? s.startDate,
    data.endDate ?? s.endDate,
    id
  );
  return getSprint(id, userId);
}

export function deleteSprint(id, userId) {
  const s = getSprint(id, userId);
  if (!s) return;
  db.prepare('UPDATE tasks SET sprint_id = NULL WHERE sprint_id = ?').run(id);
  db.prepare('DELETE FROM sprints WHERE id = ?').run(id);
}
