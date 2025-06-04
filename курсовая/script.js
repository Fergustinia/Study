// Сохранение задач в localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || {
    'todo-tasks': [],
    'in-progress-tasks': [],
    'done-tasks': []
};

// Текущая тема и роль пользователя
let currentTheme = localStorage.getItem('theme') || 'light';
let currentUserRole = localStorage.getItem('userRole') || 'developer';

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
    updateTheme();
    updateStatistics();
    initializeCharts();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Обработчик Enter в поле ввода
    document.getElementById('taskTitle').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Обработчики для колонок
    document.querySelectorAll('.task-list').forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('drop', handleDrop);
    });

    // Обработчики фильтров
    document.getElementById('searchTask').addEventListener('input', filterTasks);
    document.getElementById('filterPriority').addEventListener('change', filterTasks);
    document.getElementById('filterType').addEventListener('change', filterTasks);
    document.getElementById('filterAssignee').addEventListener('change', filterTasks);

    // Обработчик темы
    document.getElementById('theme-toggle').addEventListener('change', toggleTheme);

    // Обработчик роли пользователя
    document.getElementById('userRole').addEventListener('change', (e) => {
        currentUserRole = e.target.value;
        localStorage.setItem('userRole', currentUserRole);
        refreshTasks();
    });

    // Обработчик модального окна
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });
}

// Функция для добавления задачи
function addTask() {
    const taskInput = document.getElementById('taskTitle');
    const taskDate = document.getElementById('taskDate');
    const taskPriority = document.getElementById('taskPriority');
    const taskType = document.getElementById('taskType');
    const taskPoints = document.getElementById('taskPoints');
    const taskAssignee = document.getElementById('taskAssignee');
    const taskTitle = taskInput.value.trim();

    if (taskTitle) {
        const task = {
            id: Date.now(),
            title: taskTitle,
            date: taskDate.value,
            priority: taskPriority.value,
            type: taskType.value,
            points: parseInt(taskPoints.value),
            assignee: taskAssignee.value,
            description: '',
            comments: [],
            createdAt: new Date().toISOString(),
            createdBy: currentUserRole
        };

        createTaskElement(task, 'todo-tasks');
        tasks['todo-tasks'].push(task);
        saveTasks();
        
        // Очистка полей
        taskInput.value = '';
        taskDate.value = '';
        taskPriority.value = 'low';
        taskType.value = 'feature';
        taskPoints.value = '1';
        taskAssignee.value = '';
        
        updateStatistics();
        updateCharts();
    }
}

// Функция для создания элемента задачи
function createTaskElement(task, columnId) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.draggable = true;
    taskElement.dataset.id = task.id;
    
    // Создаем содержимое задачи
    taskElement.innerHTML = `
        <div class="task-content">
            <div class="task-header">
                <div class="task-info">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span class="task-type type-${task.type}">${getTypeText(task.type)}</span>
                        <span class="task-priority priority-${task.priority}">${getPriorityText(task.priority)}</span>
                        <span class="task-points">${task.points} SP</span>
                        ${task.date ? `<span class="task-date">${formatDate(task.date)}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    ${canEditTask(task) ? `
                        <button onclick="editTask(${task.id})" title="Редактировать">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteTask(${task.id})" title="Удалить">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
            ${task.assignee ? `
                <div class="task-assignee">
                    <div class="assignee-avatar">${getInitials(task.assignee)}</div>
                    <span>${getAssigneeName(task.assignee)}</span>
                </div>
            ` : ''}
        </div>
    `;

    // Обработчики событий для перетаскивания
    taskElement.addEventListener('dragstart', dragStart);
    taskElement.addEventListener('dragend', dragEnd);

    document.getElementById(columnId).appendChild(taskElement);
    updateColumnCount(columnId);
}

// Функция редактирования задачи
function editTask(taskId) {
    const task = findTask(taskId);
    if (task && canEditTask(task)) {
        const modal = document.getElementById('editModal');
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDate').value = task.date || '';
        document.getElementById('editTaskPriority').value = task.priority;
        document.getElementById('editTaskType').value = task.type;
        document.getElementById('editTaskPoints').value = task.points;
        document.getElementById('editTaskAssignee').value = task.assignee || '';
        document.getElementById('editTaskDescription').value = task.description || '';
        
        // Загрузка комментариев
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = task.comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <span>${comment.author}</span>
                    <span>${formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">${comment.text}</div>
            </div>
        `).join('');
        
        modal.dataset.taskId = taskId;
        modal.style.display = 'block';
    }
}

// Функция добавления комментария
function addComment() {
    const taskId = parseInt(document.getElementById('editModal').dataset.taskId);
    const task = findTask(taskId);
    const commentText = document.getElementById('newComment').value.trim();
    
    if (task && commentText) {
        const comment = {
            text: commentText,
            author: currentUserRole,
            date: new Date().toISOString()
        };
        
        task.comments.push(comment);
        saveTasks();
        
        // Обновляем список комментариев
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML += `
            <div class="comment">
                <div class="comment-header">
                    <span>${comment.author}</span>
                    <span>${formatDate(comment.date)}</span>
                </div>
                <div class="comment-content">${comment.text}</div>
            </div>
        `;
        
        document.getElementById('newComment').value = '';
    }
}

// Функция сохранения редактирования
function saveTaskEdit() {
    const taskId = parseInt(document.getElementById('editModal').dataset.taskId);
    const task = findTask(taskId);
    
    if (task && canEditTask(task)) {
        task.title = document.getElementById('editTaskTitle').value;
        task.date = document.getElementById('editTaskDate').value;
        task.priority = document.getElementById('editTaskPriority').value;
        task.type = document.getElementById('editTaskType').value;
        task.points = parseInt(document.getElementById('editTaskPoints').value);
        task.assignee = document.getElementById('editTaskAssignee').value;
        task.description = document.getElementById('editTaskDescription').value;
        
        saveTasks();
        refreshTasks();
        closeModal();
        updateCharts();
    }
}

// Функция удаления задачи
function deleteTask(taskId) {
    const task = findTask(taskId);
    if (task && canEditTask(task) && confirm('Вы уверены, что хотите удалить эту задачу?')) {
        const columnId = findTaskColumn(taskId);
        tasks[columnId] = tasks[columnId].filter(t => t.id !== taskId);
        saveTasks();
        refreshTasks();
        updateStatistics();
        updateCharts();
    }
}

// Функции для перетаскивания
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.id);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (dragging) {
        const afterElement = getDragAfterElement(event.currentTarget, event.clientY);
        if (afterElement) {
            event.currentTarget.insertBefore(dragging, afterElement);
        } else {
            event.currentTarget.appendChild(dragging);
        }
    }
}

function handleDrop(event) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData('text/plain');
    const task = findTask(parseInt(taskId));
    const newColumnId = event.currentTarget.id;
    
    if (task) {
        const oldColumnId = findTaskColumn(parseInt(taskId));
        tasks[oldColumnId] = tasks[oldColumnId].filter(t => t.id !== parseInt(taskId));
        tasks[newColumnId].push(task);
        saveTasks();
        updateStatistics();
        updateCharts();
    }
}

// Вспомогательные функции
function findTask(taskId) {
    for (const columnId in tasks) {
        const task = tasks[columnId].find(t => t.id === taskId);
        if (task) return task;
    }
    return null;
}

function findTaskColumn(taskId) {
    for (const columnId in tasks) {
        if (tasks[columnId].some(t => t.id === taskId)) {
            return columnId;
        }
    }
    return null;
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

function getPriorityText(priority) {
    const priorities = {
        low: 'Низкий',
        medium: 'Средний',
        high: 'Высокий'
    };
    return priorities[priority] || priority;
}

function getTypeText(type) {
    const types = {
        feature: 'Фича',
        bug: 'Баг',
        techdebt: 'Техдолг'
    };
    return types[type] || type;
}

function getAssigneeName(assigneeId) {
    const assignees = {
        user1: 'Иван Иванов',
        user2: 'Петр Петров',
        user3: 'Анна Сидорова'
    };
    return assignees[assigneeId] || assigneeId;
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function canEditTask(task) {
    return currentUserRole === 'po' || currentUserRole === 'sm' || 
           (currentUserRole === 'developer' && task.assignee === currentUserRole);
}

// Функции фильтрации
function filterTasks() {
    const searchText = document.getElementById('searchTask').value.toLowerCase();
    const priorityFilter = document.getElementById('filterPriority').value;
    const typeFilter = document.getElementById('filterType').value;
    const assigneeFilter = document.getElementById('filterAssignee').value;
    
    document.querySelectorAll('.task').forEach(task => {
        const taskTitle = task.querySelector('.task-title').textContent.toLowerCase();
        const taskPriority = task.querySelector('.task-priority').classList[1].split('-')[1];
        const taskType = task.querySelector('.task-type').classList[1].split('-')[1];
        const taskAssignee = task.dataset.assignee;
        
        const matchesSearch = taskTitle.includes(searchText);
        const matchesPriority = priorityFilter === 'all' || taskPriority === priorityFilter;
        const matchesType = typeFilter === 'all' || taskType === typeFilter;
        const matchesAssignee = assigneeFilter === 'all' || taskAssignee === assigneeFilter;
        
        task.style.display = matchesSearch && matchesPriority && matchesType && matchesAssignee ? 'block' : 'none';
    });
}

function clearFilters() {
    document.getElementById('searchTask').value = '';
    document.getElementById('filterPriority').value = 'all';
    document.getElementById('filterType').value = 'all';
    document.getElementById('filterAssignee').value = 'all';
    document.querySelectorAll('.task').forEach(task => {
        task.style.display = 'block';
    });
}

// Функции темы
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    updateTheme();
}

function updateTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('theme-toggle').checked = currentTheme === 'dark';
}

// Функции модального окна
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Функции статистики и графиков
function updateStatistics() {
    const totalTasks = Object.values(tasks).reduce((sum, column) => sum + column.length, 0);
    const inProgressTasks = tasks['in-progress-tasks'].length;
    const completedTasks = tasks['done-tasks'].length;
    const totalPoints = Object.values(tasks).reduce((sum, column) => 
        sum + column.reduce((points, task) => points + task.points, 0), 0);
    
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('inProgressTasks').textContent = inProgressTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('totalPoints').textContent = totalPoints;
}

function initializeCharts() {
    // Burndown Chart
    const burndownCtx = document.getElementById('burndownChart').getContext('2d');
    window.burndownChart = new Chart(burndownCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Осталось SP',
                data: [],
                borderColor: '#3498db',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Burndown Chart'
                }
            }
        }
    });

    // Velocity Chart
    const velocityCtx = document.getElementById('velocityChart').getContext('2d');
    window.velocityChart = new Chart(velocityCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Скорость (SP/спринт)',
                data: [],
                backgroundColor: '#2ecc71'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Velocity Chart'
                }
            }
        }
    });

    updateCharts();
}

function updateCharts() {
    // Обновление Burndown Chart
    const remainingPoints = calculateRemainingPoints();
    window.burndownChart.data.labels = remainingPoints.map(p => p.date);
    window.burndownChart.data.datasets[0].data = remainingPoints.map(p => p.points);
    window.burndownChart.update();

    // Обновление Velocity Chart
    const velocity = calculateVelocity();
    window.velocityChart.data.labels = velocity.map(v => v.sprint);
    window.velocityChart.data.datasets[0].data = velocity.map(v => v.points);
    window.velocityChart.update();
}

function calculateRemainingPoints() {
    // Здесь должна быть логика расчета оставшихся SP по дням
    // Для примера возвращаем фиктивные данные
    return [
        { date: '2024-01-01', points: 100 },
        { date: '2024-01-02', points: 80 },
        { date: '2024-01-03', points: 60 }
    ];
}

function calculateVelocity() {
    // Здесь должна быть логика расчета скорости команды по спринтам
    // Для примера возвращаем фиктивные данные
    return [
        { sprint: 'Спринт 1', points: 30 },
        { sprint: 'Спринт 2', points: 35 },
        { sprint: 'Спринт 3', points: 40 }
    ];
}

// Функции экспорта
function exportToCSV() {
    const headers = ['ID', 'Название', 'Тип', 'Приоритет', 'SP', 'Исполнитель', 'Статус', 'Дата'];
    const rows = [];
    
    Object.entries(tasks).forEach(([columnId, columnTasks]) => {
        columnTasks.forEach(task => {
            rows.push([
                task.id,
                task.title,
                getTypeText(task.type),
                getPriorityText(task.priority),
                task.points,
                getAssigneeName(task.assignee),
                getColumnName(columnId),
                task.date
            ]);
        });
    });
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'tasks.csv');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Заголовок
    doc.setFontSize(20);
    doc.text('Отчет по задачам', 20, 20);
    
    // Статистика
    doc.setFontSize(12);
    doc.text(`Всего задач: ${document.getElementById('totalTasks').textContent}`, 20, 40);
    doc.text(`В процессе: ${document.getElementById('inProgressTasks').textContent}`, 20, 50);
    doc.text(`Выполнено: ${document.getElementById('completedTasks').textContent}`, 20, 60);
    doc.text(`Story Points: ${document.getElementById('totalPoints').textContent}`, 20, 70);
    
    // Список задач
    let y = 90;
    Object.entries(tasks).forEach(([columnId, columnTasks]) => {
        doc.setFontSize(14);
        doc.text(getColumnName(columnId), 20, y);
        y += 10;
        
        columnTasks.forEach(task => {
            doc.setFontSize(12);
            doc.text(`${task.title} (${task.points} SP)`, 30, y);
            y += 10;
        });
        y += 10;
    });
    
    doc.save('tasks.pdf');
}

function getColumnName(columnId) {
    const columns = {
        'todo-tasks': 'Нужно сделать',
        'in-progress-tasks': 'В процессе',
        'done-tasks': 'Выполнено'
    };
    return columns[columnId] || columnId;
}

// Функции сохранения и загрузки
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    Object.keys(tasks).forEach(columnId => {
        tasks[columnId].forEach(task => {
            createTaskElement(task, columnId);
        });
    });
}

function refreshTasks() {
    // Очищаем все колонки
    document.querySelectorAll('.task-list').forEach(list => list.innerHTML = '');
    // Перезагружаем задачи
    loadTasks();
}

function updateColumnCount(columnId) {
    const count = tasks[columnId].length;
    document.querySelector(`#${columnId}`).previousElementSibling.querySelector('.task-count').textContent = count;
}
