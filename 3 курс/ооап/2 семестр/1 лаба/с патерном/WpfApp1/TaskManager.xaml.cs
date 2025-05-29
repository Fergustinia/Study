using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;

namespace TaskManagerApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            ProjectsList.ItemsSource = TaskManager.Instance.Projects;
        }

        private void AddProject_Click(object sender, RoutedEventArgs e)
        {
            string projectName = ProjectNameBox.Text.Trim();

            if (string.IsNullOrWhiteSpace(projectName))
            {
                MessageBox.Show("Введите название проекта!", "Ошибка",
                              MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            try
            {
                TaskManager.Instance.AddProject(projectName);
                ProjectNameBox.Clear();

                // Автоматически выбираем новый проект
                ProjectsList.SelectedItem = TaskManager.Instance.Projects
                    .FirstOrDefault(p => p.Name.Equals(projectName, StringComparison.OrdinalIgnoreCase));
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Ошибка",
                              MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private void RemoveProject_Click(object sender, RoutedEventArgs e)
        {
            if (ProjectsList.SelectedItem is TaskManager.Project selectedProject)
            {
                try
                {
                    TaskManager.Instance.RemoveProject(selectedProject.Name);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Ошибка",
                                  MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            else
            {
                MessageBox.Show("Выберите проект для удаления!", "Ошибка",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void AddTask_Click(object sender, RoutedEventArgs e)
        {
            if (ProjectsList.SelectedItem is TaskManager.Project selectedProject)
            {
                string taskName = TaskNameBox.Text.Trim();

                if (string.IsNullOrWhiteSpace(taskName))
                {
                    MessageBox.Show("Введите название задачи!", "Ошибка",
                                  MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }

                try
                {
                    var priority = (PriorityCombo.SelectedItem as ComboBoxItem)?.Content.ToString();
                    TaskManager.Instance.AddTask(
                        selectedProject.Name,
                        taskName,
                        DueDatePicker.SelectedDate ?? DateTime.Now,
                        priority ?? "Medium"
                    );
                    TaskNameBox.Clear();
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Ошибка",
                                  MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            else
            {
                MessageBox.Show("Выберите проект для добавления задачи!", "Ошибка",
                              MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void RemoveTask_Click(object sender, RoutedEventArgs e)
        {
            if (ProjectsList.SelectedItem is TaskManager.Project selectedProject &&
                TasksList.SelectedItem is TaskManager.Task selectedTask)
            {
                try
                {
                    TaskManager.Instance.RemoveTask(selectedProject.Name, selectedTask.Name);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message, "Ошибка",
                                  MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }
            else
            {
                MessageBox.Show("Выберите задачу для удаления!", "Ошибка",
                                MessageBoxButton.OK, MessageBoxImage.Warning);
            }
        }

        private void ProjectsList_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ProjectsList.SelectedItem is TaskManager.Project selectedProject)
            {
                TasksList.ItemsSource = selectedProject.Tasks;
            }
        }
    }
}