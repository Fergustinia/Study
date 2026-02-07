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

export function listProjects() {
  const rows = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
  return rows.map(rowToProject);
}

export function getProject(id) {
  return rowToProject(db.prepare('SELECT * FROM projects WHERE id = ?').get(id));
}

export function createProject(data) {
  const id = data.id || genId();
  db.prepare('INSERT INTO projects (id, name, description) VALUES (?, ?, ?)').run(
    id,
    (data.name || '').trim(),
    (data.description || '').trim()
  );
  return getProject(id);
}

export function updateProject(id, data) {
  db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ?').run(
    (data.name || '').trim(),
    (data.description || '').trim(),
    id
  );
  return getProject(id);
}

export function deleteProject(id) {
  db.prepare('DELETE FROM tasks WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM sprints WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}
