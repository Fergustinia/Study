import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isApiEnabled } from '../api/client';
import { useStorage } from '../context/StorageContext';
import ActivityFeed from '../components/ActivityFeed';

export default function Dashboard() {
  const { projects, sprints, tasks, getTasks } = useStorage();
  const [activityProjectId, setActivityProjectId] = useState('');
  useEffect(() => {
    if (projects.length && !activityProjectId) setActivityProjectId(projects[0].id);
    if (projects.length && activityProjectId && !projects.find((p) => p.id === activityProjectId)) {
      setActivityProjectId(projects[0].id);
    }
  }, [projects, activityProjectId]);
  const doneTasks = tasks.filter((t) => t.status === 'done');
  const totalPoints = tasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
  const donePoints = doneTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);

  return (
    <section className="view">
      <header className="page-header-block">
        <h1>Дашборд</h1>
        <p className="page-subtitle">Обзор проектов и прогресса</p>
      </header>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="value">{projects.length}</span>
          <span className="label">Проектов</span>
        </div>
        <div className="dashboard-card">
          <span className="value">{sprints.length}</span>
          <span className="label">Спринтов</span>
        </div>
        <div className="dashboard-card">
          <span className="value">{tasks.length}</span>
          <span className="label">Задач</span>
        </div>
        <div className="dashboard-card">
          <span className="value">{donePoints}</span>
          <span className="label">SP готово</span>
        </div>
        <div className="dashboard-card">
          <span className="value">{totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0}%</span>
          <span className="label">Прогресс</span>
        </div>
      </div>
      <div className="recent-section">
        <h2>Проекты</h2>
        <div className="card-grid">
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>Нет проектов.</p>
              <Link to="/projects" className="btn btn-primary">
                Создать проект
              </Link>
            </div>
          ) : (
            projects.slice(0, 6).map((p) => {
              const projectTasks = getTasks(p.id);
              const done = projectTasks.filter((t) => t.status === 'done').length;
              return (
                <Link to={`/board?project=${p.id}`} key={p.id} className="card">
                  <h3>{p.name}</h3>
                  <p className="meta">
                    Задач: {done}/{projectTasks.length}
                  </p>
                </Link>
              );
            })
          )}
        </div>
      </div>
      {isApiEnabled() && projects.length > 0 && (
        <div className="dashboard-activity">
          <select
            value={activityProjectId}
            onChange={(e) => setActivityProjectId(e.target.value)}
            className="activity-project-select"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ActivityFeed projectId={activityProjectId} />
        </div>
      )}
    </section>
  );
}
