const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Получить все задачи проекта
router.get('/projects/:projectId/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate('assigneeId', 'firstName lastName')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить задачу по ID
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assigneeId', 'firstName lastName');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Создать задачу
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, projectId, assigneeId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const task = new Task({
      title,
      description,
      status,
      priority,
      projectId,
      assigneeId,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновить задачу
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, assigneeId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assigneeId = assigneeId || task.assigneeId;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Удалить задачу
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);
    if (!project.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 