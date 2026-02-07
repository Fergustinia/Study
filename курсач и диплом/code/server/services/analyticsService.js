/**
 * Analytics layer: velocity, burndown, cycle time, lead time.
 * All metrics are computed on the server for consistency.
 */

import db from '../db.js';
import { isProjectAccessibleBy } from './projectService.js';

export function getVelocityBySprint(projectId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return [];
  const sprints = db.prepare('SELECT * FROM sprints WHERE project_id = ? ORDER BY start_date').all(projectId);
  return sprints.map((s) => {
    const tasks = db.prepare('SELECT * FROM tasks WHERE sprint_id = ? AND status = ?').all(s.id, 'done');
    const value = tasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
    return { sprintId: s.id, name: s.name, value };
  });
}

export function getBurndown(sprintId, userId) {
  const sprint = db.prepare('SELECT * FROM sprints WHERE id = ?').get(sprintId);
  if (!sprint || !isProjectAccessibleBy(sprint.project_id, userId)) return null;
  const tasks = db.prepare('SELECT * FROM tasks WHERE sprint_id = ?').all(sprintId);
  const totalPoints = tasks.reduce((s, t) => s + (t.story_points || 0), 0);
  const start = new Date(sprint.start_date);
  const end = new Date(sprint.end_date);
  const days = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)));
  const idealStep = totalPoints / days;
  const byDay = {};
  tasks.forEach((t) => {
    if (t.completed_at && t.status === 'done') {
      const d = new Date(t.completed_at).toDateString();
      byDay[d] = (byDay[d] || 0) + (t.story_points || 0);
    }
  });
  let remaining = totalPoints;
  const actual = [totalPoints];
  for (let i = 1; i <= days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toDateString();
    if (byDay[key]) remaining -= byDay[key];
    actual.push(Math.max(0, remaining));
  }
  const ideal = Array.from({ length: days + 1 }, (_, i) => Math.max(0, totalPoints - idealStep * i));
  return { sprintId, name: sprint.name, totalPoints, days, ideal, actual };
}

export function getCycleTime(projectId, sprintId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return { avgDays: null, count: 0 };
  let tasks;
  if (sprintId) {
    tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? AND sprint_id = ? AND status = ? AND started_at IS NOT NULL AND completed_at IS NOT NULL').all(projectId, sprintId, 'done');
  } else {
    tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? AND status = ? AND started_at IS NOT NULL AND completed_at IS NOT NULL').all(projectId, 'done');
  }
  const times = tasks.map((t) => (new Date(t.completed_at) - new Date(t.started_at)) / (24 * 60 * 60 * 1000));
  const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : null;
  return { avgDays: avg !== null ? Math.round(avg * 10) / 10 : null, count: times.length };
}

export function getLeadTime(projectId, sprintId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return { avgDays: null, count: 0 };
  let tasks;
  if (sprintId) {
    tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? AND sprint_id = ? AND status = ? AND created_at IS NOT NULL AND completed_at IS NOT NULL').all(projectId, sprintId, 'done');
  } else {
    tasks = db.prepare('SELECT * FROM tasks WHERE project_id = ? AND status = ? AND created_at IS NOT NULL AND completed_at IS NOT NULL').all(projectId, 'done');
  }
  const times = tasks.map((t) => (new Date(t.completed_at) - new Date(t.created_at)) / (24 * 60 * 60 * 1000));
  const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : null;
  return { avgDays: avg !== null ? Math.round(avg * 10) / 10 : null, count: times.length };
}

export function getSprintProgress(projectId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return [];
  const sprints = db.prepare('SELECT * FROM sprints WHERE project_id = ? ORDER BY start_date').all(projectId);
  return sprints.map((s) => {
    const all = db.prepare('SELECT * FROM tasks WHERE sprint_id = ?').all(s.id);
    const done = all.filter((t) => t.status === 'done');
    const totalTasks = all.length;
    const doneTasks = done.length;
    const totalSp = all.reduce((sum, t) => sum + (t.story_points || 0), 0);
    const doneSp = done.reduce((sum, t) => sum + (t.story_points || 0), 0);
    return {
      sprintId: s.id,
      name: s.name,
      startDate: s.start_date,
      endDate: s.end_date,
      totalTasks,
      doneTasks,
      totalSp,
      doneSp,
      taskPct: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
      spPct: totalSp ? Math.round((doneSp / totalSp) * 100) : 0,
    };
  });
}

export function getDoneByType(projectId, userId) {
  if (!isProjectAccessibleBy(projectId, userId)) return { task: 0, bug: 0, improvement: 0 };
  const tasks = db.prepare('SELECT type FROM tasks WHERE project_id = ? AND status = ?').all(projectId, 'done');
  const out = { task: 0, bug: 0, improvement: 0 };
  tasks.forEach((t) => {
    const type = t.type || 'task';
    if (out[type] !== undefined) out[type]++;
  });
  return out;
}
