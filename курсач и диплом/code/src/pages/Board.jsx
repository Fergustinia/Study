import { useState } from 'react';
import { useStorage } from '../context/StorageContext';
import Modal from '../components/Modal';

const COLUMNS = [
  { id: 'backlog', title: 'Бэклог' },
  { id: 'todo', title: 'К выполнению' },
  { id: 'in_progress', title: 'В работе' },
  { id: 'done', title: 'Готово' },
];

const PRIORITIES = [
  { id: 'high', label: 'Высокий' },
  { id: 'medium', label: 'Средний' },
  { id: 'low', label: 'Низкий' },
];

const TASK_TYPES = [
  { id: 'task', label: 'Задача' },
  { id: 'bug', label: 'Баг' },
  { id: 'improvement', label: 'Улучшение' },
];

export default function Board() {
  const { projects, getSprints, getTasks, saveTask, setTaskStatus, genId, tasks } = useStorage();
  const [projectId, setProjectId] = useState('');
  const [sprintId, setSprintId] = useState('');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskSprintId, setTaskSprintId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPoints, setTaskPoints] = useState(1);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskType, setTaskType] = useState('task');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');

  const sprints = getSprints(projectId);
  const backlogRaw = getTasks(projectId, null);
  const sprintTasksRaw = sprintId ? getTasks(projectId, sprintId) : [];
  const filterTasks = (list) =>
    list.filter((t) => {
      if (filterPriority && (t.priority || 'medium') !== filterPriority) return false;
      if (filterType && (t.type || 'task') !== filterType) return false;
      return true;
    });
  const backlog = filterTasks(backlogRaw);
  const sprintTasks = filterTasks(sprintTasksRaw);
  const byStatus = (arr, status) => arr.filter((t) => t.status === status);

  const openTaskForm = (defaultSprintId = null, defaultStatus = 'todo', task = null) => {
    setTaskProjectId(task?.projectId ?? projectId ?? '');
    setTaskSprintId(task?.sprintId ?? defaultSprintId ?? sprintId ?? '');
    setTaskTitle(task?.title ?? '');
    setTaskDesc(task?.description ?? '');
    setTaskPoints(task?.storyPoints ?? 1);
    setTaskPriority(task?.priority ?? 'medium');
    setTaskType(task?.type ?? 'task');
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const existing = tasks.find((t) => t.id === editingTask?.id);
    const isNew = !editingTask?.id;
    saveTask({
      id: editingTask?.id || genId(),
      projectId: taskProjectId,
      sprintId: taskSprintId || null,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      storyPoints: parseInt(taskPoints, 10) || 0,
      priority: taskPriority,
      type: taskType,
      status: existing?.status ?? 'todo',
      completedAt: existing?.completedAt,
      startedAt: existing?.startedAt,
      createdAt: existing?.createdAt || (isNew ? new Date().toISOString() : undefined),
    });
    setTaskModalOpen(false);
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    if (columnStatus === 'backlog') setTaskStatus(taskId, 'todo', null);
    else if (sprintId) setTaskStatus(taskId, columnStatus, sprintId);
    else setTaskStatus(taskId, columnStatus);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const getColumnTasks = (colId) => {
    if (colId === 'backlog') return backlog;
    return byStatus(sprintTasks, colId);
  };

  const showAddInColumn = (colId) => colId === 'backlog' || sprintId;

  return (
    <section className="view">
      <div className="page-head">
        <h1>Канбан-доска</h1>
        <div className="toolbar board-toolbar">
          <select value={projectId} onChange={(e) => { setProjectId(e.target.value); setSprintId(''); }}>
            <option value="">Выберите проект</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <select value={sprintId} onChange={(e) => setSprintId(e.target.value)}>
            <option value="">Бэклог</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span className="toolbar-sep">Фильтр:</span>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} title="Приоритет">
            <option value="">Все приоритеты</option>
            {PRIORITIES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} title="Тип">
            <option value="">Все типы</option>
            {TASK_TYPES.map((x) => (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="board-container">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className="board-column"
            data-status={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <h3>{col.title}</h3>
            <div className="column-cards">
              {getColumnTasks(col.id).map((t) => (
                <div
                  key={t.id}
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, t.id)}
                  onClick={() => openTaskForm(null, t.status, t)}
                >
                  <div className="task-card-badges">
                    <span className={`badge badge-priority badge-${t.priority || 'medium'}`}>
                      {PRIORITIES.find((p) => p.id === (t.priority || 'medium'))?.label}
                    </span>
                    <span className={`badge badge-type badge-${t.type || 'task'}`}>
                      {TASK_TYPES.find((x) => x.id === (t.type || 'task'))?.label}
                    </span>
                  </div>
                  <div>{t.title}</div>
                  <div className="points">{t.storyPoints || 0} SP</div>
                </div>
              ))}
              {showAddInColumn(col.id) && projectId && (
                <button type="button" className="add-task-btn" onClick={() => openTaskForm(sprintId || null, col.id)}>
                  + Задача
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal open={taskModalOpen} onClose={() => setTaskModalOpen(false)} title={editingTask ? 'Редактировать задачу' : 'Новая задача'}>
        <form onSubmit={handleTaskSubmit}>
          <label>
            Спринт
            <select value={taskSprintId} onChange={(e) => setTaskSprintId(e.target.value)}>
              <option value="">Бэклог</option>
              {getSprints(taskProjectId || projectId).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Название
            <input type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
          </label>
          <label>
            Описание
            <textarea rows={2} value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
          </label>
          <label>
            Тип
            <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
              {TASK_TYPES.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Приоритет
            <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
              {PRIORITIES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Story points
            <input type="number" min={0} value={taskPoints} onChange={(e) => setTaskPoints(e.target.value)} />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setTaskModalOpen(false)}>
              Отмена
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
