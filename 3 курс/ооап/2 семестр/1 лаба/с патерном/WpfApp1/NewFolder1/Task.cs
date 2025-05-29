using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace TaskManagerApp
{
    public sealed class TaskManager
    {
        private static readonly Lazy<TaskManagerApp.TaskManager> _instance = new Lazy<TaskManagerApp.TaskManager>(() => new TaskManagerApp.TaskManager());
        public static TaskManagerApp.TaskManager Instance => _instance.Value;

        private readonly ObservableCollection<Project> _projects = new ObservableCollection<Project>();
        public ObservableCollection<Project> Projects => _projects;

        private TaskManager()
        {
            // Тестовые данные
            AddProject("Личные задачи");
            AddProject("Работа");
            AddTask("Личные задачи", "Купить молоко", DateTime.Now.AddDays(1), "Medium");
        }

        public void AddProject(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Название проекта не может быть пустым");

            if (_projects.Any(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
                throw new InvalidOperationException($"Проект '{name}' уже существует");

            _projects.Add(new Project(name));
        }

        public void RemoveProject(string name)
        {
            var project = _projects.FirstOrDefault(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
            if (project != null)
            {
                _projects.Remove(project);
            }
        }

        public void AddTask(string projectName, string taskName, DateTime dueDate, string priority)
        {
            var project = _projects.FirstOrDefault(p => p.Name.Equals(projectName, StringComparison.OrdinalIgnoreCase));
            project?.Tasks.Add(new Task(taskName, dueDate, priority));
        }

        public void RemoveTask(string projectName, string taskName)
        {
            var project = _projects.FirstOrDefault(p => p.Name.Equals(projectName, StringComparison.OrdinalIgnoreCase));
            var task = project?.Tasks.FirstOrDefault(t => t.Name.Equals(taskName, StringComparison.OrdinalIgnoreCase));
            if (task != null)
            {
                project.Tasks.Remove(task);
            }
        }

        public class Project
        {
            public string Name { get; }
            public ObservableCollection<Task> Tasks { get; } = new ObservableCollection<Task>();
            public Project(string name) => Name = name;
        }

        public class Task
        {
            public string Name { get; set; }
            public DateTime DueDate { get; set; }
            public string Priority { get; set; }
            public string Status { get; set; } = "Not Started";

            public Task(string name, DateTime dueDate, string priority)
            {
                Name = name;
                DueDate = dueDate;
                Priority = priority;
            }

            public Task(string name, DateTime dueDate, string priority, string status) : this(name, dueDate, priority)
            {
                Status = status;
            }
        }
    }
}