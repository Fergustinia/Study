import { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import Modal from '../components/Modal';

export default function Sprints() {
  const { projects, getSprints, getTasks, saveSprint, deleteSprint, genId } = useStorage();
  const [projectId, setProjectId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState(null);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [retro, setRetro] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const sprints = getSprints(projectId).sort((a, b) => a.startDate.localeCompare(b.startDate));

  const openCreate = () => {
    if (!projectId) return;
    setEditingSprint(null);
    setName('');
    setGoal('');
    setRetro('');
    setStartDate('');
    setEndDate('');
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditingSprint(s);
    setName(s.name);
    setGoal(s.goal || '');
    setRetro(s.retro || '');
    setStartDate(s.startDate);
    setEndDate(s.endDate);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pid = editingSprint ? editingSprint.projectId : projectId;
    try {
      await saveSprint({
        id: editingSprint?.id || genId(),
        projectId: pid,
        name: name.trim(),
        goal: goal.trim(),
        retro: retro.trim(),
        startDate: startDate,
        endDate: endDate,
      });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить спринт? Задачи вернутся в бэклог.')) {
      try {
        await deleteSprint(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <section className="view">
      <div className="page-head">
        <h1>Спринты</h1>
        <div className="toolbar">
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">Выберите проект</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-primary" onClick={openCreate} disabled={!projectId}>
            Новый спринт
          </button>
        </div>
      </div>
      <div className="sprint-cards">
        {!projectId ? (
          <div className="empty-state">
            <p>Выберите проект.</p>
          </div>
        ) : sprints.length === 0 ? (
          <div className="empty-state">
            <p>Нет спринтов. Создайте первый.</p>
          </div>
        ) : (
          sprints.map((s) => {
            const taskList = getTasks(projectId, s.id);
            const done = taskList.filter((t) => t.status === 'done').length;
            const points = taskList.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
            const donePoints = taskList.filter((t) => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
            return (
              <div key={s.id} className="sprint-card">
                <div>
                  <h3>{s.name}</h3>
                  <p className="dates">
                    {s.startDate} — {s.endDate}
                  </p>
                  {s.goal && <p className="sprint-goal">{s.goal}</p>}
                  {s.retro && <p className="sprint-retro">{s.retro}</p>}
                  <p className="meta">
                    Задач: {done}/{taskList.length} · SP: {donePoints}/{points}
                  </p>
                </div>
                <div className="actions">
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => handleDelete(s.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingSprint ? 'Редактировать спринт' : 'Новый спринт'}>
        <form onSubmit={handleSubmit}>
          <label>
            Название
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Цель спринта
            <input type="text" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Что планируем достичь" />
          </label>
          <label>
            Ретроспектива / заметки
            <textarea rows={2} value={retro} onChange={(e) => setRetro(e.target.value)} placeholder="Итоги спринта, что улучшить" />
          </label>
          <label>
            Начало
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </label>
          <label>
            Конец
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Отмена
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
