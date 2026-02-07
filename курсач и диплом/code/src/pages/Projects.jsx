import { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import Modal from '../components/Modal';

export default function Projects() {
  const { projects, getTasks, saveProject, deleteProject, genId } = useStorage();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  return (
    <section className="view">
      <div className="page-head">
        <h1>Проекты</h1>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          Новый проект
        </button>
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
