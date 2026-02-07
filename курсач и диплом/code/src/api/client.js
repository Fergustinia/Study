/**
 * API client for Scrum PM server.
 * When VITE_API_URL is set, auth and data use the server.
 */

const API_URL = import.meta.env.VITE_API_URL || '';
const TOKEN_KEY = 'scrum_pm_token';

export function isApiEnabled() {
  return Boolean(API_URL);
}

export function getApiUrl() {
  return API_URL.replace(/\/$/, '');
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(path, options = {}) {
  const url = `${getApiUrl()}${path.startsWith('/') ? path : '/' + path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}
