/**
 * Project management service: CRUD, members, access (owner or member).
 */

import db from '../db.js';
import { genId } from '../utils/id.js';

function rowToProject(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    ownerId: row.owner_id,
    createdAt: row.created_at,
  };
}

/** Project IDs the user can access (owner or member). */
export function getAccessibleProjectIds(userId) {
  const owned = db.prepare('SELECT id FROM projects WHERE owner_id = ?').all(userId).map((r) => r.id);
  const member = db.prepare('SELECT project_id FROM project_members WHERE user_id = ?').all(userId).map((r) => r.project_id);
  return [...new Set([...owned, ...member])];
}

/** True if user is owner or project member. */
export function isProjectAccessibleBy(projectId, userId) {
  const owned = db.prepare('SELECT id FROM projects WHERE id = ? AND owner_id = ?').get(projectId, userId);
  if (owned) return true;
  const member = db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(projectId, userId);
  return Boolean(member);
}

export function listProjects(userId) {
  const owned = db.prepare('SELECT * FROM projects WHERE owner_id = ?').all(userId);
  const memberIds = db.prepare('SELECT project_id FROM project_members WHERE user_id = ?').all(userId).map((r) => r.project_id);
  const memberProjects = memberIds.length
    ? db.prepare('SELECT * FROM projects WHERE id IN (?' + ',?'.repeat(memberIds.length - 1) + ')').all(...memberIds)
    : [];
  const seen = new Set(owned.map((p) => p.id));
  const combined = [...owned];
  for (const p of memberProjects) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      combined.push(p);
    }
  }
  combined.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
  return combined.map(rowToProject);
}

export function getProject(id, userId) {
  if (!isProjectAccessibleBy(id, userId)) return null;
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
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
  if (!isProjectOwnedBy(id, userId)) return;
  db.prepare('DELETE FROM tasks WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM sprints WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM project_members WHERE project_id = ?').run(id);
  db.prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function isProjectOwnedBy(projectId, userId) {
  const row = db.prepare('SELECT id FROM projects WHERE id = ? AND owner_id = ?').get(projectId, userId);
  return Boolean(row);
}

/** List project members (owner + members) for assignee etc. Only if user has access. */
export function getProjectMembers(projectId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return [];
  const project = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
  if (!project) return [];
  const owner = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(project.owner_id);
  const memberRows = db.prepare(
    'SELECT u.id, u.name, u.email FROM project_members pm JOIN users u ON u.id = pm.user_id WHERE pm.project_id = ?'
  ).all(projectId);
  const list = [];
  if (owner) list.push({ id: owner.id, name: owner.name, email: owner.email || '', role: 'owner' });
  const seen = new Set([owner?.id].filter(Boolean));
  for (const r of memberRows) {
    if (!seen.has(r.id)) {
      seen.add(r.id);
      list.push({ id: r.id, name: r.name, email: r.email || '', role: 'member' });
    }
  }
  return list;
}

/** Add member. Only project owner. */
export function addProjectMember(projectId, memberUserId, requestingUserId) {
  if (!isProjectOwnedBy(projectId, requestingUserId)) return null;
  const owner = db.prepare('SELECT owner_id FROM projects WHERE id = ?').get(projectId);
  if (owner?.owner_id === memberUserId) return getProjectMembers(projectId, requestingUserId);
  try {
    db.prepare('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)').run(projectId, memberUserId);
  } catch (e) {
    if (!e.message?.includes('UNIQUE')) throw e;
  }
  return getProjectMembers(projectId, requestingUserId);
}

/** Remove member. Only project owner. */
export function removeProjectMember(projectId, memberUserId, requestingUserId) {
  if (!isProjectOwnedBy(projectId, requestingUserId)) return null;
  db.prepare('DELETE FROM project_members WHERE project_id = ? AND user_id = ?').run(projectId, memberUserId);
  return getProjectMembers(projectId, requestingUserId);
}
