import { createContext, useContext, useCallback, useState, useEffect } from 'react';

const STORAGE_KEYS = {
  projects: 'scrum_pm_projects',
  sprints: 'scrum_pm_sprints',
  tasks: 'scrum_pm_tasks',
};

function read(key) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const [version, setVersion] = useState(0);
  const data = {
    _version: version,
    projects: read('projects'),
    sprints: read('sprints'),
    tasks: read('tasks'),
  };

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const saveProject = useCallback(
    (project) => {
      const projects = read('projects');
      const idx = projects.findIndex((p) => p.id === project.id);
      if (idx >= 0) projects[idx] = project;
      else projects.push(project);
      write('projects', projects);
      refresh();
    },
    [refresh]
  );

  const deleteProject = useCallback(
    (projectId) => {
      write('projects', read('projects').filter((p) => p.id !== projectId));
      write('sprints', read('sprints').filter((s) => s.projectId !== projectId));
      write('tasks', read('tasks').filter((t) => t.projectId !== projectId));
      refresh();
    },
    [refresh]
  );

  const saveSprint = useCallback(
    (sprint) => {
      const sprints = read('sprints');
      const idx = sprints.findIndex((s) => s.id === sprint.id);
      if (idx >= 0) sprints[idx] = sprint;
      else sprints.push(sprint);
      write('sprints', sprints);
      refresh();
    },
    [refresh]
  );

  const deleteSprint = useCallback(
    (sprintId) => {
      write('sprints', read('sprints').filter((s) => s.id !== sprintId));
      write(
        'tasks',
        read('tasks').map((t) => (t.sprintId === sprintId ? { ...t, sprintId: null } : t))
      );
      refresh();
    },
    [refresh]
  );

  const saveTask = useCallback(
    (task) => {
      const tasks = read('tasks');
      const idx = tasks.findIndex((t) => t.id === task.id);
      if (idx >= 0) tasks[idx] = task;
      else tasks.push(task);
      write('tasks', tasks);
      refresh();
    },
    [refresh]
  );

  const setTaskStatus = useCallback(
    (taskId, status, sprintId) => {
      const tasks = read('tasks');
      const t = tasks.find((x) => x.id === taskId);
      if (!t) return;
      t.status = status;
      if (sprintId !== undefined) t.sprintId = sprintId ?? null;
      if (status === 'in_progress' && !t.startedAt) t.startedAt = new Date().toISOString();
      if (status === 'done') t.completedAt = new Date().toISOString();
      write('tasks', tasks);
      refresh();
    },
    [refresh]
  );

  const getProjects = useCallback(() => read('projects'), []);
  const getSprints = useCallback((projectId) => {
    const all = read('sprints');
    return projectId ? all.filter((s) => s.projectId === projectId) : all;
  }, []);
  const getTasks = useCallback((projectId, sprintId) => {
    const all = read('tasks').filter((t) => t.projectId === projectId);
    if (sprintId === undefined) return all;
    if (sprintId === null) return all.filter((t) => !t.sprintId);
    return all.filter((t) => t.sprintId === sprintId);
  }, []);

  const value = {
    ...data,
    genId,
    saveProject,
    deleteProject,
    saveSprint,
    deleteSprint,
    saveTask,
    setTaskStatus,
    getProjects,
    getSprints,
    getTasks,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
}
