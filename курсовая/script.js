// Функция для добавления задачи
function addTask() {
    const taskTitle = document.getElementById('taskTitle').value;

    if (taskTitle) {
        createTaskElement(taskTitle, 'todo-tasks');
        document.getElementById('taskTitle').value = '';
    }
}

// Функция для создания элемента задачи
function createTaskElement(title, columnId) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.textContent = title;

    // Обработчики событий для перетаскивания задачи
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);

    document.getElementById(columnId).appendChild(task);
}

// Функции для перетаскивания
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.textContent);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

// Обработчики событий для колонок
document.querySelectorAll('.task-list').forEach(column => {
    column.addEventListener('dragover', event => {
        event.preventDefault();
        const dragging = document.querySelector('.dragging');
        column.appendChild(dragging);
    });
});
