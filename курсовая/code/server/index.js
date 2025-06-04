const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Загрузка переменных окружения
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// WebSocket подключения
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinProject', (projectId) => {
    socket.join(projectId);
    console.log(`Client joined project: ${projectId}`);
  });

  socket.on('leaveProject', (projectId) => {
    socket.leave(projectId);
    console.log(`Client left project: ${projectId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Сохраняем io в app для использования в маршрутах
app.set('io', io);

// Маршруты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/sprints', require('./routes/sprints'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api', require('./routes/comments'));
app.use('/api', require('./routes/chat'));
app.use('/api', require('./routes/notifications'));
app.use('/api/github', require('./routes/github'));

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 