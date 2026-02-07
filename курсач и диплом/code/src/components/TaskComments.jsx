import { useState, useEffect } from 'react';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';

/**
 * Comments list and add form for a task. Used inside task modal.
 */
export default function TaskComments({ taskId }) {
  const { getComments, addComment } = useStorage();
  const { users, currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newText, setNewText] = useState('');

  useEffect(() => {
    if (!taskId) {
      setComments([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const list = await getComments(taskId);
      if (!cancelled) {
        setComments(Array.isArray(list) ? list : []);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [taskId, getComments]);

  const resolveName = (userId) => {
    if (!userId) return '';
    const c = comments.find((x) => x.userId === userId);
    if (c?.userName) return c.userName;
    const u = users?.find((x) => x.id === userId);
    return u?.name || (userId === currentUser?.id ? currentUser?.name : '') || userId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newText.trim() || !taskId) return;
    const added = await addComment(taskId, newText.trim());
    if (added) {
      setComments((prev) => [...prev, { ...added, userName: added.userName || currentUser?.name || '' }]);
      setNewText('');
    }
  };

  if (!taskId) return null;

  return (
    <div className="task-comments">
      <h4 className="task-comments-title">Комментарии</h4>
      {loading ? (
        <p className="text-muted">Загрузка…</p>
      ) : (
        <ul className="task-comments-list">
          {comments.length === 0 ? (
            <li className="task-comment-empty">Пока нет комментариев</li>
          ) : (
            comments.map((c) => (
              <li key={c.id} className="task-comment">
                <span className="task-comment-author">{resolveName(c.userId) || 'Пользователь'}</span>
                <span className="task-comment-time">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                </span>
                <p className="task-comment-text">{c.text}</p>
              </li>
            ))
          )}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="task-comments-form">
        <textarea
          rows={2}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Добавить комментарий…"
          className="task-comment-input"
        />
        <button type="submit" className="btn btn-primary btn-small" disabled={!newText.trim()}>
          Отправить
        </button>
      </form>
    </div>
  );
}
