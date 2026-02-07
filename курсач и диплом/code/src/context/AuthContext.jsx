import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { isApiEnabled, apiRequest, setToken, getToken, removeToken } from '../api/client.js';

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

function getInitialUserLocal() {
  const id = readCurrentId();
  if (!id) return null;
  const list = readUsers();
  return list.find((u) => u.id === id) || null;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(readUsers);
  const [loading, setLoading] = useState(isApiEnabled());

  const loadCurrentUser = useCallback(async () => {
    if (isApiEnabled()) {
      if (!getToken()) {
        setCurrentUser(null);
        setUsers([]);
        setLoading(false);
        return;
      }
      try {
        const { user } = await apiRequest('/api/auth/me');
        setCurrentUser(user);
        try {
          const userList = await apiRequest('/api/auth/users');
          setUsers(Array.isArray(userList) ? userList : []);
        } catch {
          setUsers([]);
        }
      } catch {
        removeToken();
        setCurrentUser(null);
        setUsers([]);
      }
      setLoading(false);
    } else {
      setCurrentUser(getInitialUserLocal());
      setUsers(readUsers());
    }
  }, []);

  useEffect(() => {
    if (isApiEnabled()) {
      loadCurrentUser();
    } else {
      setCurrentUser(getInitialUserLocal());
      setUsers(readUsers());
      setLoading(false);
    }
  }, [loadCurrentUser]);

  const register = useCallback(
    async (name, email = '', password = '') => {
      if (isApiEnabled()) {
        const { user, token } = await apiRequest('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name: (name || '').trim(), email: (email || '').trim(), password }),
        });
        setToken(token);
        setCurrentUser(user);
        return user;
      }
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

  const login = useCallback(
    async (userIdOrNameOrEmail, password) => {
      if (isApiEnabled()) {
        const { user, token } = await apiRequest('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ nameOrEmail: (userIdOrNameOrEmail || '').trim(), password: password || '' }),
        });
        setToken(token);
        setCurrentUser(user);
        return user;
      }
      const list = readUsers();
      const user = list.find((u) => u.id === userIdOrNameOrEmail) || null;
      if (user) {
        writeCurrentId(user.id);
        setCurrentUser(user);
      }
      return user;
    },
    []
  );

  const logout = useCallback(() => {
    if (isApiEnabled()) removeToken();
    else writeCurrentId(null);
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (isApiEnabled()) {
        const { user } = await apiRequest('/api/auth/profile', {
          method: 'PATCH',
          body: JSON.stringify(updates),
        });
        setCurrentUser(user);
        return user;
      }
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
    },
    []
  );

  const value = {
    currentUser,
    users,
    loading,
    isApiMode: isApiEnabled(),
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
