import express from 'express';
import Sprint from '../models/Sprint';

const router = express.Router();

// Get all sprints for a project
router.get('/:projectId', async (req, res) => {
  try {
    const sprints = await Sprint.find({ projectId: req.params.projectId });
    res.json(sprints);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sprints', error });
  }
});

// Create a new sprint
router.post('/', async (req, res) => {
  try {
    const sprint = new Sprint(req.body);
    const savedSprint = await sprint.save();
    res.status(201).json(savedSprint);
  } catch (error) {
    res.status(400).json({ message: 'Error creating sprint', error });
  }
});

// Update a sprint
router.put('/:id', async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json(updatedSprint);
  } catch (error) {
    res.status(400).json({ message: 'Error updating sprint', error });
  }
});

// Delete a sprint
router.delete('/:id', async (req, res) => {
  try {
    const deletedSprint = await Sprint.findByIdAndDelete(req.params.id);
    if (!deletedSprint) {
      return res.status(404).json({ message: 'Sprint not found' });
    }
    res.json({ message: 'Sprint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting sprint', error });
  }
});

export default router; 