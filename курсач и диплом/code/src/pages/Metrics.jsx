import { useStorage } from '../context/StorageContext';
import { useProjectContext } from '../context/ProjectContext';

export default function Metrics() {
  const { projects, getSprints, getTasks, tasks } = useStorage();
  const { projectId, sprintId } = useProjectContext();

  const sprints = getSprints(projectId).sort((a, b) => a.startDate.localeCompare(b.startDate));

  const velocityData = sprints.map((s) => {
    const taskList = getTasks(projectId, s.id).filter((t) => t.status === 'done');
    return { name: s.name, value: taskList.reduce((sum, t) => sum + (t.storyPoints || 0), 0) };
  });
  const maxVel = Math.max(1, ...velocityData.map((d) => d.value));

  // Cycle time: average days from startedAt to completedAt for done tasks
  const projectTasksForCycle = projectId
    ? (sprintId ? getTasks(projectId, sprintId) : tasks.filter((t) => t.projectId === projectId))
    : [];
  const doneWithDates = projectTasksForCycle.filter(
    (t) => t.status === 'done' && t.startedAt && t.completedAt
  );
  const cycleTimes = doneWithDates.map((t) => {
    const start = new Date(t.startedAt).getTime();
    const end = new Date(t.completedAt).getTime();
    return (end - start) / (24 * 60 * 60 * 1000);
  });
  const avgCycleDays = cycleTimes.length ? (cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length).toFixed(1) : null;

  // Lead time: average days from createdAt to completedAt for done tasks
  const doneWithLead = projectTasksForCycle.filter(
    (t) => t.status === 'done' && t.createdAt && t.completedAt
  );
  const leadTimes = doneWithLead.map((t) => {
    const start = new Date(t.createdAt).getTime();
    const end = new Date(t.completedAt).getTime();
    return (end - start) / (24 * 60 * 60 * 1000);
  });
  const avgLeadDays = leadTimes.length ? (leadTimes.reduce((a, b) => a + b, 0) / leadTimes.length).toFixed(1) : null;

  // By type (task/bug/improvement) for selected project
  const allProjectTasks = projectId ? tasks.filter((t) => t.projectId === projectId) : [];
  const doneByType = { task: 0, bug: 0, improvement: 0 };
  allProjectTasks.filter((t) => t.status === 'done').forEach((t) => {
    const type = t.type || 'task';
    if (doneByType[type] !== undefined) doneByType[type]++;
  });

  let burndownContent = null;
  if (projectId && sprintId) {
    const sprint = sprints.find((s) => s.id === sprintId);
    if (sprint) {
      const taskList = getTasks(projectId, sprintId);
      const totalPoints = taskList.reduce((s, t) => s + (t.storyPoints || 0), 0);
      const start = new Date(sprint.startDate);
      const end = new Date(sprint.endDate);
      const days = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)));
      const idealStep = totalPoints / days;
      const byDay = {};
      taskList.forEach((t) => {
        const d = t.completedAt ? new Date(t.completedAt).toDateString() : null;
        if (d) {
          if (!byDay[d]) byDay[d] = 0;
          byDay[d] += t.status === 'done' ? (t.storyPoints || 0) : 0;
        }
      });
      let remaining = totalPoints;
      const actual = [totalPoints];
      for (let i = 1; i <= days; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toDateString();
        if (byDay[key]) remaining -= byDay[key];
        actual.push(remaining);
      }
      const maxR = Math.max(totalPoints, ...actual);
      burndownContent = (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 180 }}>
          {Array.from({ length: days + 1 }, (_, i) => {
            const ideal = Math.max(0, totalPoints - idealStep * i);
            const act = actual[i] !== undefined ? actual[i] : actual[actual.length - 1];
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 12 }}>
                <div className="chart-bar ideal" style={{ height: (ideal / maxR) * 160 }} />
                <div className="chart-bar" style={{ height: (act / maxR) * 160, background: 'var(--accent)' }} />
              </div>
            );
          })}
        </div>
      );
    }
  }

  const exportCsv = () => {
    const project = projects.find((p) => p.id === projectId);
    const rows = [
      ['Scrum PM — отчёт по метрикам'],
      ['Проект', project?.name || projectId || '—'],
      ['Спринт', sprintId ? sprints.find((s) => s.id === sprintId)?.name || sprintId : 'Все спринты'],
      [],
      ['Метрика', 'Значение'],
      ['Cycle time (дн.)', avgCycleDays != null ? avgCycleDays : '—'],
      ['Lead time (дн.)', avgLeadDays != null ? avgLeadDays : '—'],
      ['Завершено: задача', doneByType.task],
      ['Завершено: баг', doneByType.bug],
      ['Завершено: улучшение', doneByType.improvement],
      [],
      ['Velocity по спринтам'],
      ...velocityData.map((d) => [d.name, d.value]),
      [],
      ['Прогресс спринтов', 'Задач %', 'SP %'],
      ...sprints.map((s) => {
        const taskList = getTasks(projectId, s.id);
        const total = taskList.length;
        const done = taskList.filter((t) => t.status === 'done').length;
        const totalSp = taskList.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        const doneSp = taskList.filter((t) => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
        const pct = total ? Math.round((done / total) * 100) : 0;
        const spPct = totalSp ? Math.round((doneSp / totalSp) * 100) : 0;
        return [s.name, `${pct}%`, `${spPct}%`];
      }),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `scrum-metrics-${project?.name || projectId || 'report'}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="view">
      <header className="page-header-block">
        <h1>Scrum-метрики</h1>
        <p className="page-subtitle">Velocity, Burndown, Cycle time и др.</p>
      </header>
      <div className="toolbar">
        {!projectId && projects.length > 0 && (
          <span className="page-hint">Выберите проект в панели выше</span>
        )}
        <button type="button" className="btn btn-secondary" onClick={exportCsv} disabled={!projectId}>
          Скачать отчёт (CSV)
        </button>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Скорость (Velocity)</h3>
          <p className="metric-desc">Story points, завершённые за спринт</p>
          <div className="chart-placeholder" id="chart-velocity">
            {!projectId ? (
              <p className="empty-state">Выберите проект</p>
            ) : velocityData.length ? (
              velocityData.map((d, i) => (
                <div
                  key={i}
                  className="chart-bar"
                  style={{ height: `${(d.value / maxVel) * 100}%` }}
                  title={`${d.name}: ${d.value} SP`}
                />
              ))
            ) : (
              <p className="empty-state">Нет данных</p>
            )}
          </div>
        </div>
        <div className="metric-card">
          <h3>Burndown</h3>
          <p className="metric-desc">Идеальный и фактический остаток работы</p>
          <div className="chart-placeholder" id="chart-burndown">
            {!projectId ? (
              <p className="empty-state">Выберите проект</p>
            ) : !sprintId ? (
              <p className="empty-state">Выберите спринт для burndown</p>
            ) : burndownContent ? (
              <>
                {burndownContent}
                <p className="metric-desc" style={{ marginTop: '0.5rem' }}>
                  Серый — идеал, синий — факт
                </p>
              </>
            ) : (
              <p className="empty-state">Нет данных</p>
            )}
          </div>
        </div>
        <div className="metric-card">
          <h3>Cycle time</h3>
          <p className="metric-desc">Среднее время от «В работе» до «Готово» (дней)</p>
          <div className="metric-value">
            {!projectId ? (
              <span className="empty-state">Выберите проект</span>
            ) : avgCycleDays != null ? (
              <span className="metric-number">{avgCycleDays} дн.</span>
            ) : (
              <span className="empty-state">Нет данных (задачи со статусом «В работе» → «Готово»)</span>
            )}
          </div>
        </div>
        <div className="metric-card">
          <h3>Lead time</h3>
          <p className="metric-desc">Среднее время от создания до «Готово» (дней)</p>
          <div className="metric-value">
            {!projectId ? (
              <span className="empty-state">Выберите проект</span>
            ) : avgLeadDays != null ? (
              <span className="metric-number">{avgLeadDays} дн.</span>
            ) : (
              <span className="empty-state">Нет данных</span>
            )}
          </div>
        </div>
        <div className="metric-card">
          <h3>По типу задачи</h3>
          <p className="metric-desc">Завершённые задачи по типу</p>
          <div className="metric-by-type">
            {!projectId ? (
              <p className="empty-state">Выберите проект</p>
            ) : (
              <>
                <div className="type-row"><span className="badge-type badge-task">Задача</span> {doneByType.task}</div>
                <div className="type-row"><span className="badge-type badge-bug">Баг</span> {doneByType.bug}</div>
                <div className="type-row"><span className="badge-type badge-improvement">Улучшение</span> {doneByType.improvement}</div>
              </>
            )}
          </div>
        </div>
        <div className="metric-card full-width">
          <h3>Прогресс спринтов</h3>
          <div id="sprint-progress-bars">
            {!projectId ? (
              <p className="empty-state">Выберите проект</p>
            ) : sprints.length === 0 ? (
              <p className="empty-state">Нет спринтов</p>
            ) : (
              sprints.map((s) => {
                const taskList = getTasks(projectId, s.id);
                const total = taskList.length;
                const done = taskList.filter((t) => t.status === 'done').length;
                const totalSp = taskList.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
                const doneSp = taskList.filter((t) => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
                const pct = total ? Math.round((done / total) * 100) : 0;
                const spPct = totalSp ? Math.round((doneSp / totalSp) * 100) : 0;
                return (
                  <div key={s.id} className="progress-bar-wrap">
                    <label>
                      {s.name} ({s.startDate} — {s.endDate})
                    </label>
                    <div className="progress-bar" style={{ display: 'flex', gap: 4 }}>
                      <div className="fill" style={{ width: `${pct}%` }}>
                        {pct}% задач
                      </div>
                      <div className="fill" style={{ width: `${100 - pct}%`, background: 'var(--bg-hover)' }} />
                    </div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Story points: {doneSp}/{totalSp} ({spPct}%)
                    </label>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
