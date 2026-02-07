import { useState, useRef } from 'react';
import { useStorage } from '../context/StorageContext';
import Modal from '../components/Modal';
import ProjectMembers from '../components/ProjectMembers';

export default function Projects() {
  const { projects, getSprints, getTasks, saveProject, saveSprint, saveTask, deleteProject, genId, loadFromApi } = useStorage();
  const importInputRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [membersProject, setMembersProject] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const openCreate = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description || '');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveProject({
        id: editingId || genId(),
        name: name.trim(),
        description: description.trim(),
      });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить проект?')) {
      try {
        await deleteProject(id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const exportProject = (p) => {
    const sprints = getSprints(p.id);
    const tasks = getTasks(p.id);
    const data = { project: p, sprints, tasks, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `scrum-project-${(p.name || p.id).replace(/[^\wа-яё-]/gi, '-')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const p = data.project;
      const sprints = Array.isArray(data.sprints) ? data.sprints : [];
      const tasks = Array.isArray(data.tasks) ? data.tasks : [];
      if (!p?.name) throw new Error('Invalid file: project name required');
      const newProjectId = genId();
      await saveProject({
        id: newProjectId,
        name: p.name,
        description: p.description || '',
      });
      const sprintIdMap = {};
      for (const s of sprints) {
        const newId = genId();
        sprintIdMap[s.id] = newId;
        await saveSprint({
          id: newId,
          projectId: newProjectId,
          name: s.name || 'Sprint',
          goal: s.goal || '',
          retro: s.retro || '',
          startDate: s.startDate || new Date().toISOString().slice(0, 10),
          endDate: s.endDate || new Date().toISOString().slice(0, 10),
        });
      }
      for (const t of tasks) {
        await saveTask({
          id: genId(),
          projectId: newProjectId,
          sprintId: t.sprintId ? sprintIdMap[t.sprintId] ?? null : null,
          title: t.title || 'Task',
          description: t.description || '',
          storyPoints: t.storyPoints ?? 0,
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          type: t.type || 'task',
          assigneeId: t.assigneeId || null,
          dueAt: t.dueAt || null,
        });
      }
      if (loadFromApi) loadFromApi();
    } catch (err) {
      console.error(err);
      window.alert('Ошибка импорта: ' + (err.message || 'неверный файл'));
    }
  };

  return (
    <section className="view">
      <div className="page-head">
        <div>
          <h1>Проекты</h1>
          <p className="page-subtitle">Создание и управление проектами</p>
        </div>
        <div className="toolbar">
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button type="button" className="btn btn-secondary" onClick={() => importInputRef.current?.click()}>
            Импорт (JSON)
          </button>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            Новый проект
          </button>
        </div>
      </div>
      <div className="card-grid" id="projects-list">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>Создайте первый проект.</p>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              Новый проект
            </button>
          </div>
        ) : (
          projects.map((p) => {
            const taskCount = getTasks(p.id).length;
            return (
              <div key={p.id} className="card">
                <h3>{p.name}</h3>
                <p className="meta">
                  {(p.description || '').slice(0, 80)}
                  {(p.description || '').length > 80 ? '…' : ''}
                </p>
                <p className="meta">Задач: {taskCount}</p>
                <div className="form-actions" style={{ marginTop: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => { setMembersProject(p); setMembersModalOpen(true); }}>
                    Участники
                  </button>
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => exportProject(p)}>
                    Экспорт
                  </button>
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => openEdit(p)}>
                    Изменить
                  </button>
                  <button type="button" className="btn btn-secondary btn-small" onClick={() => handleDelete(p.id)}>
                    Удалить
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      <ProjectMembers
        open={membersModalOpen}
        onClose={() => { setMembersModalOpen(false); setMembersProject(null); }}
        project={membersProject}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Редактировать проект' : 'Новый проект'}>
        <form onSubmit={handleSubmit}>
          <label>
            Название
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Описание
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
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
