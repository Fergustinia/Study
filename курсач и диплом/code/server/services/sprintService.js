/**
 * Sprint management service: create, update, delete sprints and time boundaries for metrics.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';

function rowToSprint(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.name,
    goal: row.goal || '',
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
  };
}

export function listSprintsByProject(projectId) {
  const rows = db.prepare('SELECT * FROM sprints WHERE project_id = ? ORDER BY start_date').all(projectId);
  return rows.map(rowToSprint);
}

export function getSprint(id) {
  return rowToSprint(db.prepare('SELECT * FROM sprints WHERE id = ?').get(id));
}

export function createSprint(data) {
  const id = data.id || genId();
  db.prepare(
    'INSERT INTO sprints (id, project_id, name, goal, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(
    id,
    data.projectId,
    (data.name || '').trim(),
    (data.goal || '').trim(),
    data.startDate,
    data.endDate
  );
  return getSprint(id);
}

export function updateSprint(id, data) {
  const s = getSprint(id);
  if (!s) return null;
  db.prepare(
    'UPDATE sprints SET name = ?, goal = ?, start_date = ?, end_date = ? WHERE id = ?'
  ).run(
    (data.name ?? s.name).trim(),
    (data.goal ?? s.goal).trim(),
    data.startDate ?? s.startDate,
    data.endDate ?? s.endDate,
    id
  );
  return getSprint(id);
}

export function deleteSprint(id) {
  db.prepare('UPDATE tasks SET sprint_id = NULL WHERE sprint_id = ?').run(id);
  db.prepare('DELETE FROM sprints WHERE id = ?').run(id);
}
