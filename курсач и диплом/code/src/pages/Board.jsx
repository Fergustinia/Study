import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStorage } from '../context/StorageContext';
import { useAuth } from '../context/AuthContext';
import { useProjectContext } from '../context/ProjectContext';
import Modal from '../components/Modal';
import TaskComments from '../components/TaskComments';

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
  const [searchParams] = useSearchParams();
  const { projects, getSprints, getTasks, saveTask, setTaskStatus, genId, tasks, getProjectMembers } = useStorage();
  const { users } = useAuth();
  const { projectId, sprintId, setProjectId, setSprintId } = useProjectContext();
  const [boardMembers, setBoardMembers] = useState([]);
  const [formMembers, setFormMembers] = useState([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskSprintId, setTaskSprintId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPoints, setTaskPoints] = useState(1);
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskType, setTaskType] = useState('task');
  const [taskAssigneeId, setTaskAssigneeId] = useState('');
  const [taskDueAt, setTaskDueAt] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAssigneeId, setFilterAssigneeId] = useState('');

  const openedTaskFromUrl = useRef(false);

  useEffect(() => {
    const p = searchParams.get('project');
    if (p && p !== projectId && projects.some((x) => x.id === p)) setProjectId(p);
  }, [searchParams.get('project')]);

  useEffect(() => {
    const taskId = searchParams.get('task');
    if (!taskId || openedTaskFromUrl.current) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.projectId === projectId) {
      openedTaskFromUrl.current = true;
      openTaskForm(task.sprintId, task.status, task);
    }
  }, [searchParams, projectId, tasks]);

  useEffect(() => {
    if (!projectId) {
      setBoardMembers([]);
      return;
    }
    let cancelled = false;
    getProjectMembers(projectId).then((list) => {
      if (!cancelled) setBoardMembers(Array.isArray(list) ? list : []);
    });
    return () => { cancelled = true; };
  }, [projectId, getProjectMembers]);

  useEffect(() => {
    if (!taskModalOpen || !taskProjectId || taskProjectId === projectId) {
      setFormMembers([]);
      return;
    }
    let cancelled = false;
    getProjectMembers(taskProjectId).then((list) => {
      if (!cancelled) setFormMembers(Array.isArray(list) ? list : []);
    });
    return () => { cancelled = true; };
  }, [taskModalOpen, taskProjectId, projectId, getProjectMembers]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.key === 'n' || e.key === 'N') && !taskModalOpen && !e.target.matches('input, textarea, select') && projectId) {
        e.preventDefault();
        openTaskForm(sprintId || null, 'todo');
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [taskModalOpen, projectId, sprintId]);

  const sprints = getSprints(projectId);
  const currentSprint = sprintId ? sprints.find((s) => s.id === sprintId) : null;
  const backlogRaw = getTasks(projectId, null);
  const sprintTasksRaw = sprintId ? getTasks(projectId, sprintId) : [];
  const filterTasks = (list) =>
    list.filter((t) => {
      if (filterPriority && (t.priority || 'medium') !== filterPriority) return false;
      if (filterType && (t.type || 'task') !== filterType) return false;
      if (filterAssigneeId && (t.assigneeId || '') !== filterAssigneeId) return false;
      return true;
    });
  const assigneeOptionsForForm = (taskProjectId === projectId ? boardMembers : formMembers).length
    ? (taskProjectId === projectId ? boardMembers : formMembers)
    : (users || []);
  const getAssigneeName = (id) => (id ? (boardMembers.find((u) => u.id === id)?.name || users?.find((u) => u.id === id)?.name || id) : null);
  const isOverdue = (task) => task.dueAt && task.status !== 'done' && new Date(task.dueAt) < new Date();
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
    setTaskAssigneeId(task?.assigneeId ?? '');
    setTaskDueAt(task?.dueAt ? task.dueAt.slice(0, 10) : '');
    setEditingTask(task);
    setTaskModalOpen(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const existing = tasks.find((t) => t.id === editingTask?.id);
    const isNew = !editingTask?.id;
    try {
      await saveTask({
        id: editingTask?.id || genId(),
        projectId: taskProjectId,
        sprintId: taskSprintId || null,
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        storyPoints: parseInt(taskPoints, 10) || 0,
        priority: taskPriority,
        type: taskType,
        assigneeId: taskAssigneeId || null,
        dueAt: taskDueAt || null,
        status: existing?.status ?? 'todo',
        completedAt: existing?.completedAt,
        startedAt: existing?.startedAt,
        createdAt: existing?.createdAt || (isNew ? new Date().toISOString() : undefined),
      });
      setTaskModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e, columnStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    try {
      if (columnStatus === 'backlog') await setTaskStatus(taskId, 'todo', null);
      else if (sprintId) await setTaskStatus(taskId, columnStatus, sprintId);
      else await setTaskStatus(taskId, columnStatus);
    } catch (err) {
      console.error(err);
    }
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
        <div>
          <h1>Канбан-доска</h1>
          <p className="page-subtitle">Задачи по статусам</p>
        </div>
        <div className="toolbar board-toolbar">
          {projectId && (
            <span className="board-context-hint">
              Проект и спринт — в панели выше
            </span>
          )}
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
          <select value={filterAssigneeId} onChange={(e) => setFilterAssigneeId(e.target.value)} title="Исполнитель">
            <option value="">Все исполнители</option>
            {(projectId ? boardMembers : users || []).map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {currentSprint?.goal && (
        <div className="board-sprint-goal">
          <strong>Цель спринта:</strong> {currentSprint.goal}
        </div>
      )}
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
                  className={`task-card ${isOverdue(t) ? 'task-card-overdue' : ''}`}
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
                  <div className="task-card-footer">
                    <span className="points">{t.storyPoints || 0} SP</span>
                    {t.dueAt && (
                      <span className={`task-due ${isOverdue(t) ? 'overdue' : ''}`} title="Срок">
                        {new Date(t.dueAt).toLocaleDateString()}
                      </span>
                    )}
                    {getAssigneeName(t.assigneeId) && (
                      <span className="task-assignee" title="Исполнитель">{getAssigneeName(t.assigneeId)}</span>
                    )}
                  </div>
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
          <label>
            Срок (дата)
            <input type="date" value={taskDueAt} onChange={(e) => setTaskDueAt(e.target.value)} />
          </label>
          <label>
            Исполнитель
            <select value={taskAssigneeId} onChange={(e) => setTaskAssigneeId(e.target.value)}>
              <option value="">— не назначен —</option>
              {assigneeOptionsForForm.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
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
        {editingTask?.id && <TaskComments taskId={editingTask.id} />}
      </Modal>
    </section>
  );
}
