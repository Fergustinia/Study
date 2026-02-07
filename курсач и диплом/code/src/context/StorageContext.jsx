import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { isApiEnabled, apiRequest, getToken } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const STORAGE_KEYS = {
  projects: 'scrum_pm_projects',
  sprints: 'scrum_pm_sprints',
  tasks: 'scrum_pm_tasks',
  comments: 'scrum_pm_comments',
  projectMembers: 'scrum_pm_project_members',
};

// In local mode, data is stored per user so different accounts don't share projects/sprints/tasks
function storageKey(key, userId) {
  const base = STORAGE_KEYS[key];
  return userId ? `${base}_${userId}` : base;
}

function read(key, userId) {
  try {
    const raw = localStorage.getItem(storageKey(key, userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value, userId) {
  localStorage.setItem(storageKey(key, userId), JSON.stringify(value));
}

function readProjectMembers(userId) {
  try {
    const raw = localStorage.getItem(storageKey('projectMembers', userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeProjectMembers(obj, userId) {
  localStorage.setItem(storageKey('projectMembers', userId), JSON.stringify(obj));
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

const StorageContext = createContext(null);

export function StorageProvider({ children }) {
  const { currentUser } = useAuth();
  const [version, setVersion] = useState(0);
  const [apiData, setApiData] = useState({ projects: [], sprints: [], tasks: [] });
  const [apiLoading, setApiLoading] = useState(false);

  const loadFromApi = useCallback(async () => {
    if (!isApiEnabled() || !getToken()) return;
    setApiLoading(true);
    try {
      const [projects, sprints, tasks] = await Promise.all([
        apiRequest('/api/projects'),
        apiRequest('/api/sprints'),
        apiRequest('/api/tasks'),
      ]);
      setApiData({ projects: projects || [], sprints: sprints || [], tasks: tasks || [] });
    } catch {
      setApiData({ projects: [], sprints: [], tasks: [] });
    } finally {
      setApiLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isApiEnabled() && getToken()) loadFromApi();
    else if (isApiEnabled()) setApiData({ projects: [], sprints: [], tasks: [] });
  }, [isApiEnabled(), loadFromApi, version, currentUser?.id]);

  const localUserId = !isApiEnabled() ? (currentUser?.id || '_guest') : '';
  const data = {
    _version: version,
    projects: isApiEnabled() ? apiData.projects : read('projects', localUserId),
    sprints: isApiEnabled() ? apiData.sprints : read('sprints', localUserId),
    tasks: isApiEnabled() ? apiData.tasks : read('tasks', localUserId),
    apiLoading: isApiEnabled() ? apiLoading : false,
  };

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  const saveProject = useCallback(
    async (project) => {
      if (isApiEnabled()) {
        if (project.id) {
          await apiRequest(`/api/projects/${project.id}`, { method: 'PATCH', body: JSON.stringify(project) });
        } else {
          await apiRequest('/api/projects', { method: 'POST', body: JSON.stringify(project) });
        }
        await loadFromApi();
        return;
      }
      const projects = read('projects', localUserId);
      const idx = projects.findIndex((p) => p.id === project.id);
      if (idx >= 0) projects[idx] = project;
      else projects.push(project);
      write('projects', projects, localUserId);
      refresh();
    },
    [refresh, loadFromApi, localUserId]
  );

  const deleteProject = useCallback(
    async (projectId) => {
      if (isApiEnabled()) {
        await apiRequest(`/api/projects/${projectId}`, { method: 'DELETE' });
        await loadFromApi();
        return;
      }
      write('projects', read('projects', localUserId).filter((p) => p.id !== projectId), localUserId);
      write('sprints', read('sprints', localUserId).filter((s) => s.projectId !== projectId), localUserId);
      write('tasks', read('tasks', localUserId).filter((t) => t.projectId !== projectId), localUserId);
      const pm = readProjectMembers(localUserId);
      delete pm[projectId];
      writeProjectMembers(pm, localUserId);
      refresh();
    },
    [refresh, loadFromApi, localUserId]
  );

  const saveSprint = useCallback(
    async (sprint) => {
      if (isApiEnabled()) {
        if (sprint.id) {
          await apiRequest(`/api/sprints/${sprint.id}`, { method: 'PATCH', body: JSON.stringify(sprint) });
        } else {
          await apiRequest('/api/sprints', { method: 'POST', body: JSON.stringify(sprint) });
        }
        await loadFromApi();
        return;
      }
      const sprints = read('sprints', localUserId);
      const idx = sprints.findIndex((s) => s.id === sprint.id);
      if (idx >= 0) sprints[idx] = sprint;
      else sprints.push(sprint);
      write('sprints', sprints, localUserId);
      refresh();
    },
    [refresh, loadFromApi, localUserId]
  );

  const deleteSprint = useCallback(
    async (sprintId) => {
      if (isApiEnabled()) {
        await apiRequest(`/api/sprints/${sprintId}`, { method: 'DELETE' });
        await loadFromApi();
        return;
      }
      write('sprints', read('sprints', localUserId).filter((s) => s.id !== sprintId), localUserId);
      write(
        'tasks',
        read('tasks', localUserId).map((t) => (t.sprintId === sprintId ? { ...t, sprintId: null } : t)),
        localUserId
      );
      refresh();
    },
    [refresh, loadFromApi, localUserId]
  );

  const saveTask = useCallback(
    async (task) => {
      if (isApiEnabled()) {
        if (task.id) {
          await apiRequest(`/api/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify(task) });
        } else {
          await apiRequest('/api/tasks', { method: 'POST', body: JSON.stringify(task) });
        }
        await loadFromApi();
        return;
      }
      const tasks = read('tasks', localUserId);
      const full = { ...task, assigneeId: task.assigneeId ?? null, dueAt: task.dueAt ?? null };
      const idx = tasks.findIndex((t) => t.id === full.id);
      if (idx >= 0) tasks[idx] = full;
      else tasks.push(full);
      write('tasks', tasks, localUserId);
      refresh();
    },
    [refresh, loadFromApi, localUserId]
  );

  const setTaskStatus = useCallback(
    async (taskId, status, sprintId) => {
      if (isApiEnabled()) {
        await apiRequest(`/api/tasks/${taskId}/status`, {
          method: 'POST',
          body: JSON.stringify({ status, sprintId }),
        });
        await loadFromApi();
        return;
      }
      const tasks = read('tasks', localUserId);
      const t = tasks.find((x) => x.id === taskId);
      if (!t) return;
      t.status = status;
      if (sprintId !== undefined) t.sprintId = sprintId ?? null;
      if (status === 'in_progress' && !t.startedAt) t.startedAt = new Date().toISOString();
      if (status === 'done') t.completedAt = new Date().toISOString();
      write('tasks', tasks, localUserId);
      refresh();
    },
    [refresh, loadFromApi, localUserId]
  );

  const getProjects = useCallback(
    () => (isApiEnabled() ? apiData.projects : read('projects', localUserId)),
    [isApiEnabled(), apiData.projects, localUserId]
  );
  const getSprints = useCallback(
    (projectId) => {
      const all = isApiEnabled() ? apiData.sprints : read('sprints', localUserId);
      return projectId ? all.filter((s) => s.projectId === projectId) : all;
    },
    [isApiEnabled(), apiData.sprints, localUserId]
  );
  const getTasks = useCallback(
    (projectId, sprintId) => {
      const all = (isApiEnabled() ? apiData.tasks : read('tasks', localUserId)).filter((t) => t.projectId === projectId);
      if (sprintId === undefined) return all;
      if (sprintId === null) return all.filter((t) => !t.sprintId);
      return all.filter((t) => t.sprintId === sprintId);
    },
    [isApiEnabled(), apiData.tasks, localUserId]
  );

  const getComments = useCallback(
    async (taskId) => {
      if (isApiEnabled()) {
        try {
          return await apiRequest(`/api/comments/task/${taskId}`);
        } catch {
          return [];
        }
      }
      const comments = read('comments', localUserId);
      return comments.filter((c) => c.taskId === taskId).sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    },
    [localUserId]
  );

  const addComment = useCallback(
    async (taskId, text) => {
      const trimmed = (text || '').trim();
      if (!trimmed) return null;
      if (isApiEnabled()) {
        try {
          const comment = await apiRequest(`/api/comments/task/${taskId}`, {
            method: 'POST',
            body: JSON.stringify({ text: trimmed }),
          });
          return comment;
        } catch (err) {
          console.error(err);
          return null;
        }
      }
      const comments = read('comments', localUserId);
      const comment = {
        id: genId(),
        taskId,
        userId: currentUser?.id || '',
        text: trimmed,
        createdAt: new Date().toISOString(),
      };
      comments.push(comment);
      write('comments', comments, localUserId);
      refresh();
      return comment;
    },
    [refresh, localUserId, currentUser?.id]
  );

  const getProjectMembers = useCallback(
    async (projectId) => {
      if (isApiEnabled()) {
        try {
          return await apiRequest(`/api/projects/${projectId}/members`);
        } catch {
          return [];
        }
      }
      const pm = readProjectMembers(localUserId);
      const memberIds = pm[projectId] || [];
      const owner = currentUser ? [{ id: currentUser.id, name: currentUser.name, email: currentUser.email || '', role: 'owner' }] : [];
      const members = memberIds.map((id) => ({ id, name: '', email: '', role: 'member' }));
      return [...owner, ...members];
    },
    [localUserId, currentUser]
  );

  const addProjectMember = useCallback(
    async (projectId, userId) => {
      if (isApiEnabled()) {
        await apiRequest(`/api/projects/${projectId}/members`, { method: 'POST', body: JSON.stringify({ userId }) });
        return;
      }
      const pm = readProjectMembers(localUserId);
      if (!pm[projectId]) pm[projectId] = [];
      if (!pm[projectId].includes(userId)) pm[projectId].push(userId);
      writeProjectMembers(pm, localUserId);
      refresh();
    },
    [refresh, localUserId]
  );

  const removeProjectMember = useCallback(
    async (projectId, userId) => {
      if (isApiEnabled()) {
        await apiRequest(`/api/projects/${projectId}/members/${userId}`, { method: 'DELETE' });
        return;
      }
      const pm = readProjectMembers(localUserId);
      if (pm[projectId]) pm[projectId] = pm[projectId].filter((id) => id !== userId);
      writeProjectMembers(pm, localUserId);
      refresh();
    },
    [refresh, localUserId]
  );

  const isProjectOwner = useCallback(
    (projectId) => {
      if (isApiEnabled()) {
        const p = (apiData.projects || []).find((x) => x.id === projectId);
        return p && p.ownerId === currentUser?.id;
      }
      return true;
    },
    [isApiEnabled(), apiData.projects, currentUser?.id]
  );

  const value = {
    ...data,
    genId,
    saveProject,
    deleteProject,
    getProjectMembers,
    addProjectMember,
    removeProjectMember,
    isProjectOwner,
    saveSprint,
    deleteSprint,
    saveTask,
    setTaskStatus,
    getProjects,
    getSprints,
    getTasks,
    getComments,
    addComment,
    loadFromApi,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorage must be used within StorageProvider');
  return ctx;
}
