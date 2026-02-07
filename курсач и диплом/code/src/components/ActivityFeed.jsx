import { useState, useEffect } from 'react';
import { isApiEnabled, apiRequest } from '../api/client';

const ACTION_LABELS = {
  task_created: 'создал задачу',
  status_changed: 'изменил статус задачи',
  assignee_changed: 'назначил исполнителя',
};

function formatAction(activity) {
  const label = ACTION_LABELS[activity.action] || activity.action;
  const title = activity.details?.title || activity.entityId || '';
  return title ? `${label} «${title}»` : label;
}

export default function ActivityFeed({ projectId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isApiEnabled() || !projectId) {
      setList([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    apiRequest(`/api/activity?projectId=${encodeURIComponent(projectId)}`)
      .then((data) => {
        if (!cancelled) setList(Array.isArray(data) ? data : []);
      })
      .catch(() => { if (!cancelled) setList([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [projectId]);

  if (!isApiEnabled()) return null;

  return (
    <div className="activity-feed">
      <h3>Активность в проекте</h3>
      {loading ? (
        <p className="text-muted">Загрузка…</p>
      ) : list.length === 0 ? (
        <p className="activity-feed-empty">Пока нет событий</p>
      ) : (
        <ul className="activity-feed-list">
          {list.map((a) => (
            <li key={a.id} className="activity-feed-item">
              <span className="activity-feed-user">{a.userName || 'Пользователь'}</span>
              {' '}
              {formatAction(a)}
              <span className="activity-feed-time">
                {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
