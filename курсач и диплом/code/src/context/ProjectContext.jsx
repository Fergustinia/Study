import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useStorage } from './StorageContext';
import { useAuth } from './AuthContext';

const STORAGE_KEY_PREFIX = 'scrum_pm_ctx';

function storageKey(userId) {
  return `${STORAGE_KEY_PREFIX}_${userId || 'anon'}`;
}

function readSaved(userId) {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return { projectId: '', sprintId: '' };
    const data = JSON.parse(raw);
    return { projectId: data.projectId || '', sprintId: data.sprintId || '' };
  } catch {
    return { projectId: '', sprintId: '' };
  }
}

function writeSaved(userId, projectId, sprintId) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify({ projectId: projectId || '', sprintId: sprintId || '' }));
  } catch {}
}

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const { currentUser } = useAuth();
  const { projects, getSprints } = useStorage();
  const userId = currentUser?.id || '';
  const projectsKey = projects.map((p) => p.id).join(',');

  const [projectId, setProjectIdState] = useState('');
  const [sprintId, setSprintIdState] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    const saved = readSaved(userId);
    const validProject = projects.some((p) => p.id === saved.projectId);
    const pId = validProject ? saved.projectId : (projects[0]?.id || '');
    const sprints = pId ? getSprints(pId) : [];
    const validSprint = sprints.some((s) => s.id === saved.sprintId);
    const sId = validSprint ? saved.sprintId : '';
    setProjectIdState(pId);
    setSprintIdState(sId);
    writeSaved(userId, pId, sId);
    initialized.current = true;
  }, [userId, projectsKey]);


  const setProjectId = useCallback(
    (next) => {
      const id = typeof next === 'function' ? next(projectId) : next;
      setProjectIdState(id || '');
      setSprintIdState('');
      writeSaved(userId, id || '', '');
    },
    [userId, projectId]
  );

  const setSprintId = useCallback(
    (next) => {
      const id = typeof next === 'function' ? next(sprintId) : next;
      setSprintIdState(id || '');
      writeSaved(userId, projectId, id || '');
    },
    [userId, projectId, sprintId]
  );

  useEffect(() => {
    writeSaved(userId, projectId, sprintId);
  }, [userId, projectId, sprintId]);

  const value = {
    projectId,
    sprintId,
    setProjectId,
    setSprintId,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectContext must be used within ProjectProvider');
  return ctx;
}
