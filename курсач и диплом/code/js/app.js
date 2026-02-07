/**
 * Scrum PM — project management system with built-in Scrum metrics.
 * Data stored in localStorage (no database).
 */

const STORAGE_KEYS = {
  projects: 'scrum_pm_projects',
  sprints: 'scrum_pm_sprints',
  tasks: 'scrum_pm_tasks'
};

function storageGet(key) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storageSet(key, value) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
}

function id() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// --- Projects ---
function getProjects() {
  return storageGet('projects');
}

function saveProject(project) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === project.id);
  if (idx >= 0) {
    projects[idx] = project;
  } else {
    projects.push(project);
  }
  storageSet('projects', projects);
  return project;
}

function deleteProject(projectId) {
  const projects = getProjects().filter(p => p.id !== projectId);
  storageSet('projects', projects);
  storageSet('sprints', storageGet('sprints').filter(s => s.projectId !== projectId));
  storageSet('tasks', storageGet('tasks').filter(t => t.projectId !== projectId));
}

// --- Sprints ---
function getSprints(projectId) {
  const all = storageGet('sprints');
  return projectId ? all.filter(s => s.projectId === projectId) : all;
}

function saveSprint(sprint) {
  const sprints = storageGet('sprints');
  const idx = sprints.findIndex(s => s.id === sprint.id);
  if (idx >= 0) sprints[idx] = sprint;
  else sprints.push(sprint);
  storageSet('sprints', sprints);
  return sprint;
}

function deleteSprint(sprintId) {
  const sprints = storageGet('sprints').filter(s => s.id !== sprintId);
  const tasks = storageGet('tasks').map(t => {
    if (t.sprintId === sprintId) t.sprintId = null;
    return t;
  });
  storageSet('sprints', sprints);
  storageSet('tasks', tasks);
}

// --- Tasks ---
function getTasks(projectId, sprintId) {
  const all = storageGet('tasks').filter(t => t.projectId === projectId);
  if (sprintId === undefined) return all;
  if (sprintId === null) return all.filter(t => !t.sprintId);
  return all.filter(t => t.sprintId === sprintId);
}

function saveTask(task) {
  const tasks = storageGet('tasks');
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx >= 0) tasks[idx] = task;
  else tasks.push(task);
  storageSet('tasks', tasks);
  return task;
}

function deleteTask(taskId) {
  storageSet('tasks', storageGet('tasks').filter(t => t.id !== taskId));
}

function setTaskStatus(taskId, status, sprintId) {
  const tasks = storageGet('tasks');
  const t = tasks.find(x => x.id === taskId);
  if (!t) return;
  t.status = status;
  if (sprintId !== undefined) t.sprintId = sprintId || null;
  if (status === 'done') t.completedAt = new Date().toISOString();
  storageSet('tasks', tasks);
}

// --- Routing ---
function showView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
  const el = document.getElementById('view-' + viewId);
  if (el) el.classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + viewId);
  });
}

function onHashChange() {
  const hash = (location.hash || '#dashboard').slice(1);
  showView(hash);
  if (hash === 'dashboard') renderDashboard();
  if (hash === 'projects') renderProjects();
  if (hash === 'sprints') renderSprints();
  if (hash === 'board') renderBoard();
  if (hash === 'metrics') renderMetrics();
}

// --- Dashboard ---
function renderDashboard() {
  const projects = getProjects();
  const sprints = storageGet('sprints');
  const tasks = storageGet('tasks');
  const doneTasks = tasks.filter(t => t.status === 'done');
  const totalPoints = tasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
  const donePoints = doneTasks.reduce((s, t) => s + (t.storyPoints || 0), 0);

  const cardsEl = document.getElementById('dashboard-cards');
  cardsEl.innerHTML = `
    <div class="dashboard-card"><span class="value">${projects.length}</span><span class="label">Проектов</span></div>
    <div class="dashboard-card"><span class="value">${sprints.length}</span><span class="label">Спринтов</span></div>
    <div class="dashboard-card"><span class="value">${tasks.length}</span><span class="label">Задач</span></div>
    <div class="dashboard-card"><span class="value">${donePoints}</span><span class="label">SP готово</span></div>
    <div class="dashboard-card"><span class="value">${totalPoints ? Math.round((donePoints / totalPoints) * 100) : 0}%</span><span class="label">Прогресс</span></div>
  `;

  const grid = document.getElementById('dashboard-projects');
  if (projects.length === 0) {
    grid.innerHTML = '<div class="empty-state"><p>Нет проектов.</p><a href="#projects" class="btn btn-primary">Создать проект</a></div>';
  } else {
    grid.innerHTML = projects.slice(0, 6).map(p => {
      const count = getTasks(p.id).length;
      const done = getTasks(p.id).filter(t => t.status === 'done').length;
      return `
        <div class="card">
          <a href="#board">
            <h3>${escapeHtml(p.name)}</h3>
            <p class="meta">Задач: ${done}/${count}</p>
          </a>
        </div>
      `;
    }).join('');
  }
}

// --- Projects view ---
function renderProjects() {
  const list = document.getElementById('projects-list');
  const projects = getProjects();
  if (projects.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>Создайте первый проект.</p><button type="button" class="btn btn-primary" id="btn-new-project-empty">Новый проект</button></div>';
    list.querySelector('#btn-new-project-empty')?.addEventListener('click', openProjectForm);
  } else {
    list.innerHTML = projects.map(p => {
      const taskCount = getTasks(p.id).length;
      return `
        <div class="card" data-project-id="${p.id}">
          <h3>${escapeHtml(p.name)}</h3>
          <p class="meta">${escapeHtml((p.description || '').slice(0, 80))}${(p.description || '').length > 80 ? '…' : ''}</p>
          <p class="meta">Задач: ${taskCount}</p>
          <div class="form-actions" style="margin-top:0.75rem">
            <button type="button" class="btn btn-secondary btn-small btn-edit-project" data-id="${p.id}">Изменить</button>
            <button type="button" class="btn btn-secondary btn-small btn-delete-project" data-id="${p.id}">Удалить</button>
          </div>
        </div>
      `;
    }).join('');
    list.querySelectorAll('.btn-edit-project').forEach(btn => {
      btn.addEventListener('click', () => openProjectForm(btn.dataset.id));
    });
    list.querySelectorAll('.btn-delete-project').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Удалить проект?')) {
          deleteProject(btn.dataset.id);
          renderProjects();
        }
      });
    });
  }
}

function openProjectForm(projectId) {
  const wrap = document.getElementById('project-form-wrap');
  const title = document.getElementById('project-form-title');
  const form = document.getElementById('project-form');
  form.reset();
  document.getElementById('project-id').value = '';
  if (projectId) {
    const p = getProjects().find(x => x.id === projectId);
    if (p) {
      title.textContent = 'Редактировать проект';
      document.getElementById('project-id').value = p.id;
      document.getElementById('project-name').value = p.name;
      document.getElementById('project-desc').value = p.description || '';
    }
  } else {
    title.textContent = 'Новый проект';
  }
  wrap.classList.remove('hidden');
}

function closeProjectForm() {
  document.getElementById('project-form-wrap').classList.add('hidden');
}

// --- Sprints view ---
function renderSprints() {
  const select = document.getElementById('sprints-project-select');
  const projects = getProjects();
  const currentId = select.value;
  select.innerHTML = '<option value="">Выберите проект</option>' + projects.map(p => `<option value="${p.id}" ${p.id === currentId ? 'selected' : ''}>${escapeHtml(p.name)}</option>`).join('');
  document.getElementById('btn-new-sprint').disabled = !select.value;

  const list = document.getElementById('sprints-list');
  if (!select.value) {
    list.innerHTML = '<div class="empty-state"><p>Выберите проект.</p></div>';
    return;
  }

  const sprints = getSprints(select.value);
  if (sprints.length === 0) {
    list.innerHTML = '<div class="empty-state"><p>Нет спринтов. Создайте первый.</p></div>';
  } else {
    list.innerHTML = sprints.map(s => {
      const tasks = getTasks(select.value, s.id);
      const done = tasks.filter(t => t.status === 'done').length;
      const points = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      const donePoints = tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
      return `
        <div class="sprint-card">
          <div>
            <h3>${escapeHtml(s.name)}</h3>
            <p class="dates">${s.startDate} — ${s.endDate}</p>
            <p class="meta">Задач: ${done}/${tasks.length} · SP: ${donePoints}/${points}</p>
          </div>
          <div class="actions">
            <button type="button" class="btn btn-secondary btn-small btn-delete-sprint" data-id="${s.id}">Удалить</button>
          </div>
        </div>
      `;
    }).join('');
    list.querySelectorAll('.btn-delete-sprint').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('Удалить спринт? Задачи вернутся в бэклог.')) {
          deleteSprint(btn.dataset.id);
          renderSprints();
        }
      });
    });
  }
}

function openSprintForm(projectId, sprintId) {
  const wrap = document.getElementById('sprint-form-wrap');
  const form = document.getElementById('sprint-form');
  form.reset();
  document.getElementById('sprint-id').value = '';
  document.getElementById('sprint-project-id').value = projectId || document.getElementById('sprints-project-select').value;
  if (sprintId) {
    const s = getSprints().find(x => x.id === sprintId);
    if (s) {
      document.getElementById('sprint-form-title').textContent = 'Редактировать спринт';
      document.getElementById('sprint-id').value = s.id;
      document.getElementById('sprint-project-id').value = s.projectId;
      document.getElementById('sprint-name').value = s.name;
      document.getElementById('sprint-goal').value = s.goal || '';
      document.getElementById('sprint-start').value = s.startDate;
      document.getElementById('sprint-end').value = s.endDate;
    }
  } else {
    document.getElementById('sprint-form-title').textContent = 'Новый спринт';
  }
  wrap.classList.remove('hidden');
}

function closeSprintForm() {
  document.getElementById('sprint-form-wrap').classList.add('hidden');
}

// --- Board ---
function renderBoard() {
  const projSelect = document.getElementById('board-project-select');
  const sprintSelect = document.getElementById('board-sprint-select');
  const projects = getProjects();
  projSelect.innerHTML = '<option value="">Выберите проект</option>' + projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');

  const projectId = projSelect.value;
  if (!projectId) {
    ['col-backlog', 'col-todo', 'col-in_progress', 'col-done'].forEach(id => {
      document.getElementById(id).innerHTML = '<button type="button" class="add-task-btn">+ Задача</button>';
    });
    return;
  }

  const sprints = getSprints(projectId);
  sprintSelect.innerHTML = '<option value="">Бэклог</option>' + sprints.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  const sprintId = sprintSelect.value || null;

  const allTasks = getTasks(projectId);
  const backlog = allTasks.filter(t => !t.sprintId);
  const sprintTasks = sprintId ? allTasks.filter(t => t.sprintId === sprintId) : [];
  const byStatus = (arr, status) => arr.filter(t => t.status === status);

  function renderColumn(colId, tasks, showAdd, columnStatus) {
    const col = document.getElementById(colId);
    col.innerHTML = tasks.map(t => `
      <div class="task-card" data-task-id="${t.id}" data-status="${t.status}" draggable="true">
        <div>${escapeHtml(t.title)}</div>
        <div class="points">${t.storyPoints || 0} SP</div>
      </div>
    `).join('');
    if (showAdd) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'add-task-btn';
      addBtn.textContent = '+ Задача';
      addBtn.addEventListener('click', () => openTaskForm(projectId, sprintId, null, columnStatus));
      col.appendChild(addBtn);
    }
    col.querySelectorAll('.task-card').forEach(card => {
      card.addEventListener('dragstart', onTaskDragStart);
      card.addEventListener('click', (e) => {
        if (e.target.closest('.task-card') && !e.target.closest('button')) openTaskForm(projectId, sprintId, card.dataset.taskId);
      });
    });
  }

  renderColumn('col-backlog', backlog, true, 'backlog');
  renderColumn('col-todo', byStatus(sprintTasks, 'todo'), !!sprintId, 'todo');
  renderColumn('col-in_progress', byStatus(sprintTasks, 'in_progress'), !!sprintId, 'in_progress');
  renderColumn('col-done', byStatus(sprintTasks, 'done'), !!sprintId, 'done');
}

function onTaskDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.taskId);
  e.dataTransfer.effectAllowed = 'move';
}

function onTaskDrop(e, newStatus) {
  e.preventDefault();
  const taskId = e.dataTransfer.getData('text/plain');
  if (!taskId) return;
  const sprintSelect = document.getElementById('board-sprint-select');
  const sprintId = sprintSelect.value || null;
  if (newStatus === 'backlog') setTaskStatus(taskId, 'todo', null);
  else if (sprintId) setTaskStatus(taskId, newStatus, sprintId);
  else setTaskStatus(taskId, newStatus);
  if (document.getElementById('board-project-select').value) renderBoard();
}

document.querySelectorAll('.board-column').forEach(col => {
  col.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });
  col.addEventListener('drop', e => {
    onTaskDrop(e, col.dataset.status);
  });
});

function openTaskForm(projectId, sprintId, taskId, defaultStatus) {
  const wrap = document.getElementById('task-form-wrap');
  const projId = projectId || document.getElementById('board-project-select').value;
  document.getElementById('task-project-id').value = projId;
  const sprintSelect = document.getElementById('task-sprint-select');
  const sprints = getSprints(projId);
  sprintSelect.innerHTML = '<option value="">Бэклог</option>' + sprints.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  const form = document.getElementById('task-form');
  form.reset();
  document.getElementById('task-project-id').value = projId;
  sprintSelect.innerHTML = '<option value="">Бэклог</option>' + sprints.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  if (taskId) {
    const t = storageGet('tasks').find(x => x.id === taskId);
    if (t) {
      document.getElementById('task-form-title').textContent = 'Редактировать задачу';
      document.getElementById('task-id').value = t.id;
      document.getElementById('task-title').value = t.title;
      document.getElementById('task-desc').value = t.description || '';
      document.getElementById('task-points').value = t.storyPoints ?? 1;
      sprintSelect.value = t.sprintId || '';
    }
  } else {
    document.getElementById('task-form-title').textContent = 'Новая задача';
    document.getElementById('task-id').value = '';
    document.getElementById('task-points').value = 1;
    sprintSelect.value = sprintId || document.getElementById('board-sprint-select').value || '';
  }
  wrap.classList.remove('hidden');
}

function closeTaskForm() {
  document.getElementById('task-form-wrap').classList.add('hidden');
}

// --- Metrics ---
function renderMetrics() {
  const projSelect = document.getElementById('metrics-project-select');
  const sprintSelect = document.getElementById('metrics-sprint-select');
  const projects = getProjects();
  projSelect.innerHTML = '<option value="">Выберите проект</option>' + projects.map(p => `<option value="${p.id}">${escapeHtml(p.name)}</option>`).join('');

  const projectId = projSelect.value;
  if (!projectId) {
    document.getElementById('chart-velocity').innerHTML = '<p class="empty-state">Выберите проект</p>';
    document.getElementById('chart-burndown').innerHTML = '<p class="empty-state">Выберите проект</p>';
    document.getElementById('sprint-progress-bars').innerHTML = '';
    return;
  }

  const sprints = getSprints(projectId).sort((a, b) => a.startDate.localeCompare(b.startDate));
  sprintSelect.innerHTML = '<option value="">Все спринты</option>' + sprints.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
  const sprintId = sprintSelect.value;

  // Velocity: completed SP per sprint
  const velocityData = sprints.map(s => {
    const tasks = getTasks(projectId, s.id).filter(t => t.status === 'done');
    return { name: s.name, value: tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0) };
  });
  const velEl = document.getElementById('chart-velocity');
  const maxVel = Math.max(1, ...velocityData.map(d => d.value));
  velEl.innerHTML = velocityData.length ? velocityData.map(d => `
    <div class="chart-bar" style="height:${(d.value / maxVel) * 100}%" title="${escapeHtml(d.name)}: ${d.value} SP"></div>
  `).join('') : '<p class="empty-state">Нет данных</p>';

  // Burndown for selected sprint
  const burndownEl = document.getElementById('chart-burndown');
  if (sprintId) {
    const sprint = sprints.find(s => s.id === sprintId);
    if (sprint) {
      const tasks = getTasks(projectId, sprintId);
      const totalPoints = tasks.reduce((s, t) => s + (t.storyPoints || 0), 0);
      const start = new Date(sprint.startDate);
      const end = new Date(sprint.endDate);
      const days = Math.max(1, Math.ceil((end - start) / (24 * 60 * 60 * 1000)));
      const idealStep = totalPoints / days;
      let remaining = totalPoints;
      const actual = [totalPoints];
      const byDay = {};
      tasks.forEach(t => {
        const d = t.completedAt ? new Date(t.completedAt).toDateString() : null;
        if (d) {
          if (!byDay[d]) byDay[d] = 0;
          byDay[d] += t.status === 'done' ? (t.storyPoints || 0) : 0;
        }
      });
      for (let i = 1; i <= days; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const key = d.toDateString();
        if (byDay[key]) remaining -= byDay[key];
        actual.push(remaining);
      }
      const maxR = Math.max(totalPoints, ...actual);
      burndownEl.innerHTML = `
        <div style="display:flex;align-items:flex-end;gap:2px;height:180px">
          ${Array.from({ length: days + 1 }, (_, i) => {
            const ideal = Math.max(0, totalPoints - idealStep * i);
            const act = actual[i] !== undefined ? actual[i] : actual[actual.length - 1];
            return `
              <div style="display:flex;flex-direction:column;align-items:center;flex:1;min-width:12px">
                <div class="chart-bar ideal" style="height:${(ideal / maxR) * 160}px"></div>
                <div class="chart-bar" style="height:${(act / maxR) * 160}px;background:var(--accent)"></div>
              </div>
            `;
          }).join('')}
        </div>
        <p class="metric-desc" style="margin-top:0.5rem">Серый — идеал, синий — факт</p>
      `;
    } else {
      burndownEl.innerHTML = '<p class="empty-state">Нет данных</p>';
    }
  } else {
    burndownEl.innerHTML = '<p class="empty-state">Выберите спринт для burndown</p>';
  }

  // Sprint progress bars
  const progressEl = document.getElementById('sprint-progress-bars');
  progressEl.innerHTML = sprints.map(s => {
    const tasks = getTasks(projectId, s.id);
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const totalSp = tasks.reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const doneSp = tasks.filter(t => t.status === 'done').reduce((sum, t) => sum + (t.storyPoints || 0), 0);
    const pct = total ? Math.round((done / total) * 100) : 0;
    const spPct = totalSp ? Math.round((doneSp / totalSp) * 100) : 0;
    return `
      <div class="progress-bar-wrap">
        <label>${escapeHtml(s.name)} (${s.startDate} — ${s.endDate})</label>
        <div class="progress-bar" style="display:flex;gap:4px">
          <div class="fill" style="width:${pct}%">${pct}% задач</div>
          <div class="fill" style="width:${100-pct}%;background:var(--bg-hover)"></div>
        </div>
        <label style="font-size:0.8rem;color:var(--text-muted)">Story points: ${doneSp}/${totalSp} (${spPct}%)</label>
      </div>
    `;
  }).join('') || '<p class="empty-state">Нет спринтов</p>';
}

function escapeHtml(s) {
  if (s == null) return '';
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

// --- Form submit handlers ---
document.getElementById('project-form').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('project-id').value || id();
  saveProject({
    id,
    name: document.getElementById('project-name').value.trim(),
    description: document.getElementById('project-desc').value.trim()
  });
  closeProjectForm();
  renderProjects();
  onHashChange();
});

document.getElementById('sprint-form').addEventListener('submit', e => {
  e.preventDefault();
  const sid = document.getElementById('sprint-id').value || id();
  saveSprint({
    id: sid,
    projectId: document.getElementById('sprint-project-id').value,
    name: document.getElementById('sprint-name').value.trim(),
    goal: document.getElementById('sprint-goal').value.trim(),
    startDate: document.getElementById('sprint-start').value,
    endDate: document.getElementById('sprint-end').value
  });
  closeSprintForm();
  renderSprints();
});

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  const tid = document.getElementById('task-id').value || id();
  const projectId = document.getElementById('task-project-id').value;
  const sprintIdVal = document.getElementById('task-sprint-select').value || null;
  const existing = storageGet('tasks').find(t => t.id === tid);
  saveTask({
    id: tid,
    projectId,
    sprintId: sprintIdVal || null,
    title: document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-desc').value.trim(),
    storyPoints: parseInt(document.getElementById('task-points').value, 10) || 0,
    status: existing ? existing.status : 'todo',
    completedAt: existing ? existing.completedAt : undefined
  });
  closeTaskForm();
  renderBoard();
});

document.querySelector('.btn-cancel-form').addEventListener('click', closeProjectForm);
document.querySelector('.btn-cancel-sprint-form').addEventListener('click', closeSprintForm);
document.querySelector('.btn-cancel-task-form').addEventListener('click', closeTaskForm);

document.getElementById('btn-new-project').addEventListener('click', () => openProjectForm());
document.getElementById('btn-new-sprint').addEventListener('click', () => openSprintForm());

document.getElementById('sprints-project-select').addEventListener('change', renderSprints);
document.getElementById('board-project-select').addEventListener('change', renderBoard);
document.getElementById('board-sprint-select').addEventListener('change', renderBoard);
document.getElementById('metrics-project-select').addEventListener('change', renderMetrics);
document.getElementById('metrics-sprint-select').addEventListener('change', renderMetrics);

window.addEventListener('hashchange', onHashChange);
onHashChange();
