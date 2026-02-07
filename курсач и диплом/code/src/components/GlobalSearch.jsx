import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';

export default function GlobalSearch() {
  const { projects, tasks } = useStorage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const q = (query || '').trim().toLowerCase();
  const projectMatches = q
    ? projects.filter((p) => p.name?.toLowerCase().includes(q)).slice(0, 5)
    : [];
  const taskMatches = q
    ? tasks
        .filter((t) => t.title?.toLowerCase().includes(q))
        .slice(0, 8)
        .map((t) => ({ ...t, project: projects.find((p) => p.id === t.projectId) }))
        .filter((t) => t.project)
    : [];
  const showDropdown = open && focused && q.length >= 1;

  useEffect(() => {
    const onOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onOutside);
    return () => document.removeEventListener('click', onOutside);
  }, []);

  const goBoard = (projectId, taskId) => {
    setQuery('');
    setOpen(false);
    setFocused(false);
    navigate(taskId ? `/board?project=${projectId}&task=${taskId}` : `/board?project=${projectId}`);
  };

  return (
    <div className="global-search" ref={ref}>
      <input
        type="search"
        className="global-search-input"
        placeholder="Поиск проектов и задач…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { setOpen(true); setFocused(true); }}
        onBlur={() => setFocused(false)}
      />
      {showDropdown && (
        <div className="global-search-dropdown">
          {projectMatches.length === 0 && taskMatches.length === 0 ? (
            <div className="global-search-empty">Ничего не найдено</div>
          ) : (
            <>
              {projectMatches.length > 0 && (
                <div className="global-search-section">
                  <div className="global-search-section-title">Проекты</div>
                  {projectMatches.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="global-search-item"
                      onClick={() => goBoard(p.id)}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
              {taskMatches.length > 0 && (
                <div className="global-search-section">
                  <div className="global-search-section-title">Задачи</div>
                  {taskMatches.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className="global-search-item"
                      onClick={() => goBoard(t.projectId, t.id)}
                    >
                      <span className="global-search-task-title">{t.title}</span>
                      <span className="global-search-task-project">{t.project?.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
