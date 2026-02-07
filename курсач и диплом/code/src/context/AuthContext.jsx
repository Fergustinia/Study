import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const USERS_KEY = 'scrum_pm_users';
const CURRENT_USER_KEY = 'scrum_pm_current_user_id';

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function readCurrentId() {
  return localStorage.getItem(CURRENT_USER_KEY);
}

function writeCurrentId(id) {
  if (id) localStorage.setItem(CURRENT_USER_KEY, id);
  else localStorage.removeItem(CURRENT_USER_KEY);
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function getInitialUser() {
  const id = readCurrentId();
  if (!id) return null;
  const list = readUsers();
  return list.find((u) => u.id === id) || null;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getInitialUser);
  const [users, setUsers] = useState(readUsers);

  const loadCurrentUser = useCallback(() => {
    setCurrentUser(getInitialUser());
    setUsers(readUsers());
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const register = useCallback(
    (name, email = '') => {
      const list = readUsers();
      const trimmed = (name || '').trim();
      if (!trimmed) return null;
      const existing = list.find((u) => u.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        writeCurrentId(existing.id);
        setCurrentUser(existing);
        return existing;
      }
      const user = { id: genId(), name: trimmed, email: (email || '').trim() };
      list.push(user);
      writeUsers(list);
      writeCurrentId(user.id);
      setCurrentUser(user);
      setUsers(list);
      return user;
    },
    []
  );

  const login = useCallback((userId) => {
    const list = readUsers();
    const user = list.find((u) => u.id === userId) || null;
    if (user) {
      writeCurrentId(user.id);
      setCurrentUser(user);
    }
    return user;
  }, []);

  const logout = useCallback(() => {
    writeCurrentId(null);
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    const id = readCurrentId();
    if (!id) return null;
    const list = readUsers();
    const idx = list.findIndex((u) => u.id === id);
    if (idx < 0) return null;
    const updated = { ...list[idx], ...updates };
    if (updates.name !== undefined) updated.name = (updates.name || '').trim();
    if (updates.email !== undefined) updated.email = (updates.email || '').trim();
    list[idx] = updated;
    writeUsers(list);
    setCurrentUser(updated);
    setUsers(list);
    return updated;
  }, []);

  const value = {
    currentUser,
    users,
    register,
    login,
    logout,
    updateProfile,
    loadCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
