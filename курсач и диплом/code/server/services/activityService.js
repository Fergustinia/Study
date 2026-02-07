/**
 * Activity service: log project events and list activity feed.
 */

import db from '../db.js';
import { genId } from '../utils/id.js';
import { isProjectAccessibleBy } from './projectService.js';

function rowToActivity(row) {
  if (!row) return null;
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    userName: row.user_name || '',
    action: row.action,
    entityType: row.entity_type,
    entityId: row.entity_id,
    details: row.details ? JSON.parse(row.details) : null,
    createdAt: row.created_at,
  };
}

export function log(projectId, userId, action, entityType, entityId, details = null) {
  if (!isProjectAccessibleBy(projectId, userId)) return null;
  const id = genId();
  const detailsStr = details != null ? JSON.stringify(details) : null;
  db.prepare(
    'INSERT INTO activity (id, project_id, user_id, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, projectId, userId, action, entityType, entityId || null, detailsStr);
  return rowToActivity(db.prepare('SELECT * FROM activity WHERE id = ?').get(id));
}

export function listByProject(projectId, userId, limit = 50) {
  if (!isProjectAccessibleBy(projectId, userId)) return [];
  const rows = db.prepare(
    `SELECT a.*, u.name as user_name FROM activity a
     LEFT JOIN users u ON a.user_id = u.id
     WHERE a.project_id = ? ORDER BY a.created_at DESC LIMIT ?`
  ).all(projectId, limit);
  return rows.map(rowToActivity);
}
