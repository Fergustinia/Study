/**
 * Project management service.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';

function rowToProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    createdAt: row.created_at,
  };
}

export function listProjects(userId) {
  const rows = db.prepare('SELECT * FROM projects WHERE owner_id = ? ORDER BY created_at DESC').all(userId);
  return rows.map(rowToProject);
}

export function getProject(id, userId) {
  const row = db.prepare('SELECT * FROM projects WHERE id = ? AND owner_id = ?').get(id, userId);
  return rowToProject(row);
}

export function createProject(data, userId) {
  const id = data.id || genId();
  db.prepare('INSERT INTO projects (id, name, description, owner_id) VALUES (?, ?, ?, ?)').run(
    id,
    (data.name || '').trim(),
    (data.description || '').trim(),
    userId
  );
  return getProject(id, userId);
}

export function updateProject(id, data, userId) {
  const p = getProject(id, userId);
  if (!p) return null;
  db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ?').run(
    (data.name || '').trim(),
    (data.description || '').trim(),
    id
  );
  return getProject(id, userId);
}

export function deleteProject(id, userId) {
  const p = getProject(id, userId);
  if (!p) return;
  db.prepare('DELETE FROM tasks WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM sprints WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function isProjectOwnedBy(projectId, userId) {
  const row = db.prepare('SELECT id FROM projects WHERE id = ? AND owner_id = ?').get(projectId, userId);
  return Boolean(row);
}
