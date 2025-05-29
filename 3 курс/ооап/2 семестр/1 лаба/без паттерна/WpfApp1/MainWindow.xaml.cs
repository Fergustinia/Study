using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace SimpleTaskManager
{
    public partial class MainWindow : Window
    {
        public ObservableCollection<Project> Projects { get; } = new ObservableCollection<Project>();

        public MainWindow()
        {
            InitializeComponent();
            LoadSampleData();
        }

        private void LoadSampleData()
        {
            // Тестовые данные
            var personalProject = new Project("Личные задачи");
            personalProject.Tasks.Add(new Task("Купить молоко", DateTime.Now.AddDays(1), "Medium"));
            Projects.Add(personalProject);

            var workProject = new Project("Работа");
            workProject.Tasks.Add(new Task("Завершить отчёт", DateTime.Now.AddDays(3), "High"));
            Projects.Add(workProject);

            ProjectsList.ItemsSource = Projects;
        }

        private void AddProject_Click(object sender, RoutedEventArgs e)
        {
            string name = ProjectNameBox.Text.Trim();

            if (string.IsNullOrWhiteSpace(name))
            {
                ShowError("Название проекта не может быть пустым!");
                return;
            }

            if (Projects.Any(p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase)))
            {
                ShowError("Проект с таким именем уже существует!");
                return;
            }

            Projects.Add(new Project(name));
            ProjectNameBox.Clear();
            ShowSuccess($"Проект '{name}' добавлен!");
        }

        private void RemoveProject_Click(object sender, RoutedEventArgs e)
        {
            if (ProjectsList.SelectedItem is Project selectedProject)
            {
                Projects.Remove(selectedProject);
                ShowSuccess($"Проект '{selectedProject.Name}' удалён!");
            }
            else
            {
                ShowError("Выберите проект для удаления!");
            }
        }

        private void AddTask_Click(object sender, RoutedEventArgs e)
        {
            if (ProjectsList.SelectedItem is Project selectedProject)
            {
                string taskName = TaskNameBox.Text.Trim();

                if (string.IsNullOrWhiteSpace(taskName))
                {
                    ShowError("Введите название задачи!");
                    return;
                }

                var priority = (PriorityCombo.SelectedItem as ComboBoxItem)?.Content.ToString();
                var dueDate = DueDatePicker.SelectedDate ?? DateTime.Now;

                selectedProject.Tasks.Add(new Task(taskName, dueDate, priority ?? "Medium"));
                TaskNameBox.Clear();
                ShowSuccess($"Задача '{taskName}' добавлена!");
            }
            else
            {
                ShowError("Выберите проект для добавления задачи!");
            }
        }

        private void RemoveTask_Click(object sender, RoutedEventArgs e)
        {
            if (ProjectsList.SelectedItem is Project project &&
                TasksList.SelectedItem is Task selectedTask)
            {
                project.Tasks.Remove(selectedTask);
                ShowSuccess($"Задача '{selectedTask.Name}' удалена!");
            }
            else
            {
                ShowError("Выберите задачу для удаления!");
            }
        }

        private void UpdateTaskStatus_Click(object sender, RoutedEventArgs e)
        {
            if (TasksList.SelectedItem is Task selectedTask)
            {
                var newStatus = (StatusCombo.SelectedItem as ComboBoxItem)?.Content.ToString();
                selectedTask.Status = newStatus ?? "Not Started";
                ShowSuccess("Статус обновлён!");
            }
            else
            {
                ShowError("Выберите задачу для изменения статуса!");
            }
        }

        private void ProjectsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ProjectsList.SelectedItem is Project selectedProject)
            {
                TasksList.ItemsSource = selectedProject.Tasks;
            }
        }

        private void ShowError(string message)
        {
            MessageBox.Show(message, "Ошибка", MessageBoxButton.OK, MessageBoxImage.Error);
        }

        private void ShowSuccess(string message)
        {
            MessageBox.Show(message, "Успех", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }

    public class Project
    {
        public string Name { get; }
        public ObservableCollection<Task> Tasks { get; } = new ObservableCollection<Task>();

        public Project(string name)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
        }
    }

    public class Task
    {
        public string Name { get; set; }
        public DateTime DueDate { get; set; }
        public string Priority { get; set; }
        public string Status { get; set; }

        public Task(string name, DateTime dueDate, string priority)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            DueDate = dueDate;
            Priority = priority ?? throw new ArgumentNullException(nameof(priority));
            Status = "Not Started";
        }
    }
}