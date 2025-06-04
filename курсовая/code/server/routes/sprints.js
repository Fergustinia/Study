const express = require('express');
const router = express.Router();
const Sprint = require('../models/Sprint');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Получить все спринты проекта
router.get('/projects/:projectId/sprints', auth, async (req, res) => {
  try {
    const sprints = await Sprint.find({ projectId: req.params.projectId })
      .populate('projectId', 'name')
      .sort({ startDate: -1 });
    res.json(sprints);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Получить спринт по ID
router.get('/:id', auth, async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id)
      .populate('projectId', 'name');

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    res.json(sprint);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Создать спринт
router.post('/', auth, async (req, res) => {
  try {
    const { name, startDate, endDate, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const sprint = new Sprint({
      name,
      startDate,
      endDate,
      projectId,
      status: 'planned',
      progress: 0,
    });

    await sprint.save();
    res.status(201).json(sprint);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновить спринт
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, startDate, endDate, status, progress } = req.body;
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(sprint.projectId);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    sprint.name = name || sprint.name;
    sprint.startDate = startDate || sprint.startDate;
    sprint.endDate = endDate || sprint.endDate;
    sprint.status = status || sprint.status;
    sprint.progress = progress !== undefined ? progress : sprint.progress;

    await sprint.save();
    res.json(sprint);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Удалить спринт
router.delete('/:id', auth, async (req, res) => {
  try {
    const sprint = await Sprint.findById(req.params.id);

    if (!sprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }

    const project = await Project.findById(sprint.projectId);
    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await sprint.remove();
    res.json({ message: 'Sprint deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 