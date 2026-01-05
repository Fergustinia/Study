const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Получить все сообщения для проекта
router.get('/projects/:projectId/chat', auth, async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId })
      .populate('senderId', 'firstName lastName')
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Отправить сообщение
router.post('/projects/:projectId/chat', auth, async (req, res) => {
  try {
    const message = new Message({
      projectId: req.params.projectId,
      senderId: req.user.id,
      content: req.body.content,
    });

    const savedMessage = await message.save();
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate('senderId', 'firstName lastName');

    // Отправляем сообщение через WebSocket
    req.app.get('io').to(req.params.projectId).emit('newMessage', populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 