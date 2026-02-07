import { useState, useEffect, useRef } from 'react';
import { isApiEnabled, apiRequest } from '../api/client';

export default function Notifications() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    if (!isApiEnabled()) return;
    try {
      const data = await apiRequest('/api/notifications');
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const checkReminders = async () => {
      try {
        await apiRequest('/api/notifications/check-sprint-reminders', { method: 'POST' });
        load();
      } catch {}
    };
    checkReminders();
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('click', onOutside);
    return () => document.removeEventListener('click', onOutside);
  }, [open]);

  const markRead = async (id) => {
    try {
      await apiRequest(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setList((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await apiRequest('/api/notifications/read-all', { method: 'POST' });
      setList((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    } catch {}
  };

  if (!isApiEnabled()) return null;

  const unreadCount = list.filter((n) => !n.readAt).length;

  return (
    <div className="header-notifications" ref={ref}>
      <button
        type="button"
        className="header-notifications-btn"
        onClick={() => setOpen((o) => !o)}
        title="Уведомления"
        aria-label="Уведомления"
      >
        <span className="header-notifications-icon">🔔</span>
        {unreadCount > 0 && <span className="header-notifications-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>
      {open && (
        <div className="header-notifications-dropdown">
          <div className="header-notifications-header">
            <span>Уведомления</span>
            {unreadCount > 0 && (
              <button type="button" className="btn btn-secondary btn-small" onClick={markAllRead}>
                Прочитать все
              </button>
            )}
          </div>
          <ul className="header-notifications-list">
            {list.length === 0 ? (
              <li className="header-notification-empty">Нет уведомлений</li>
            ) : (
              list.slice(0, 20).map((n) => (
                <li
                  key={n.id}
                  className={`header-notification-item ${n.readAt ? '' : 'unread'}`}
                  onClick={() => !n.readAt && markRead(n.id)}
                >
                  <strong>{n.title}</strong>
                  {n.body && <span className="header-notification-body">{n.body}</span>}
                  <span className="header-notification-time">
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
