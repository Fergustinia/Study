const Project = require('./Project');
const Sprint = require('./Sprint');
const Task = require('./Task');
const User = require('./User');

// Связи между моделями
Project.hasMany(Sprint, { onDelete: 'CASCADE' });
Sprint.belongsTo(Project);

Project.hasMany(Task, { onDelete: 'CASCADE' });
Task.belongsTo(Project);

Sprint.hasMany(Task, { onDelete: 'SET NULL' });
Task.belongsTo(Sprint);

User.hasMany(Task, { foreignKey: 'assigneeId' });
Task.belongsTo(User, { foreignKey: 'assigneeId' });

// Связь многие-ко-многим для проектов и пользователей
Project.belongsToMany(User, { through: 'ProjectUsers' });
User.belongsToMany(Project, { through: 'ProjectUsers' });

module.exports = {
  Project,
  Sprint,
  Task,
  User
}; 