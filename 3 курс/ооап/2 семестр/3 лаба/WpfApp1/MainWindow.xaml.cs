using System;
using System.Collections.Generic;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Microsoft.Win32;

namespace ResumeBuilderApp
{
    public partial class MainWindow : Window
    {
        private ResumeBuilder _currentBuilder = new MinimalResumeBuilder(); // Текущий стиль по умолчанию
        private readonly List<string> _resumeHistory = new List<string>(); // История резюме
        private bool _isDarkTheme = false; // Флаг темной темы

        public MainWindow()
        {
            InitializeComponent();
        }

        // Создание минимального резюме
        private void MinimalResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentBuilder = new MinimalResumeBuilder();
            GenerateResume();
        }

        // Создание бизнес-резюме
        private void BusinessResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentBuilder = new BusinessResumeBuilder();
            GenerateResume();
        }

        // Создание креативного резюме
        private void CreativeResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentBuilder = new CreativeResumeBuilder();
            GenerateResume();
        }

        // Создание академического резюме
        private void AcademicResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentBuilder = new AcademicResumeBuilder();
            GenerateResume();
        }

        // Очистка всех полей
        private void ClearButton_Click(object sender, RoutedEventArgs e)
        {
            FullNameInput.Text = "";
            ContactInfoInput.Text = "";
            EducationInput.Text = "";
            WorkExperienceInput.Text = "";
            SkillsInput.Text = "";
            AdditionalInfoInput.Text = "";
            ResumeOutput.Text = "";
            ErrorMessage.Visibility = Visibility.Collapsed;
        }

        // Сохранение резюме в TXT
        private void SaveButton_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrEmpty(ResumeOutput.Text))
            {
                ErrorMessage.Text = "Ошибка: Сначала создайте резюме!";
                ErrorMessage.Visibility = Visibility.Visible;
                return;
            }

            var saveDialog = new SaveFileDialog
            {
                Filter = "Текстовый файл (*.docx)|*.docx",
                DefaultExt = "docx",
                FileName = "Resume"
            };

            if (saveDialog.ShowDialog() == true)
            {
                try
                {
                    File.WriteAllText(saveDialog.FileName, ResumeOutput.Text);
                    MessageBox.Show("Резюме успешно сохранено!", "Успех", MessageBoxButton.OK, MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    ErrorMessage.Text = $"Ошибка при сохранении: {ex.Message}";
                    ErrorMessage.Visibility = Visibility.Visible;
                }
            }
        }

        // Обновление резюме при изменении текста
        private void Input_TextChanged(object sender, TextChangedEventArgs e)
        {
            GenerateResume();
        }

        // Выбор резюме из истории
        private void HistoryListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (HistoryListBox.SelectedItem != null)
            {
                ResumeOutput.Text = HistoryListBox.SelectedItem.ToString();
            }
        }

        // Очистка истории
        private void ClearHistoryButton_Click(object sender, RoutedEventArgs e)
        {
            _resumeHistory.Clear();
            HistoryListBox.Items.Clear();
            MessageBox.Show("История очищена!", "Успех", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        // Включение темной темы
        private void DarkThemeCheckBox_Checked(object sender, RoutedEventArgs e)
        {
            _isDarkTheme = true;
            ApplyTheme();
        }

        // Выключение темной темы
        private void DarkThemeCheckBox_Unchecked(object sender, RoutedEventArgs e)
        {
            _isDarkTheme = false;
            ApplyTheme();
        }

        // Применение темы
        private void ApplyTheme()
        {
            var buttonStyle = _isDarkTheme ? Resources["DarkThemeButton"] : Resources["LightThemeButton"];
            var textBlockStyle = _isDarkTheme ? Resources["DarkThemeTextBlock"] : Resources["LightThemeTextBlock"];
            var textBoxStyle = _isDarkTheme ? Resources["DarkThemeTextBox"] : Resources["LightThemeTextBox"];
            var borderStyle = _isDarkTheme ? Resources["DarkThemeBorder"] : Resources["LightThemeBorder"];
            var listBoxStyle = _isDarkTheme ? Resources["DarkThemeListBox"] : Resources["LightThemeListBox"];

            MainGrid.Background = _isDarkTheme ? new SolidColorBrush(Color.FromRgb(33, 33, 33)) : new SolidColorBrush(Colors.White);

            MinimalResumeButton.Style = buttonStyle as Style;
            BusinessResumeButton.Style = buttonStyle as Style;
            CreativeResumeButton.Style = buttonStyle as Style;
            AcademicResumeButton.Style = buttonStyle as Style;
            ClearButton.Style = buttonStyle as Style;
            SaveButton.Style = buttonStyle as Style;
            ClearHistoryButton.Style = buttonStyle as Style;

            FullNameInput.Style = textBoxStyle as Style;
            ContactInfoInput.Style = textBoxStyle as Style;
            EducationInput.Style = textBoxStyle as Style;
            WorkExperienceInput.Style = textBoxStyle as Style;
            SkillsInput.Style = textBoxStyle as Style;
            AdditionalInfoInput.Style = textBoxStyle as Style;

            foreach (UIElement element in ((StackPanel)MainGrid.Children[0]).Children)
            {
                if (element is TextBlock textBlock)
                    textBlock.Style = textBlockStyle as Style;
            }
            ResumeOutput.Style = _isDarkTheme ? Resources["DarkThemeTextBlock"] as Style : Resources["AnimatedTextBlock"] as Style;
            ErrorMessage.Style = textBlockStyle as Style;

            OutputBorder.Style = borderStyle as Style;
            HistoryListBox.Style = listBoxStyle as Style;
        }

        // Генерация резюме
        private void GenerateResume()
        {
            try
            {
                ErrorMessage.Visibility = Visibility.Collapsed;

                var resumeData = new ResumeData
                {
                    FullName = FullNameInput.Text.Trim(),
                    ContactInfo = ContactInfoInput.Text.Trim(),
                    Education = EducationInput.Text.Trim(),
                    WorkExperience = WorkExperienceInput.Text.Trim(),
                    Skills = SkillsInput.Text.Trim(),
                    AdditionalInfo = AdditionalInfoInput.Text.Trim()
                };

                // Пропускаем генерацию, если данные неполные
                if (!resumeData.IsValid)
                {
                    ResumeOutput.Text = "";
                    return;
                }

                string resumeText = _currentBuilder.BuildResume(resumeData);
                ResumeOutput.Text = resumeText;

                // Добавляем в историю, если резюме новое
                if (!_resumeHistory.Contains(resumeText))
                {
                    _resumeHistory.Add(resumeText);
                    HistoryListBox.Items.Add(resumeText);
                }
            }
            catch (Exception ex)
            {
                ErrorMessage.Text = $"Ошибка: {ex.Message}";
                ErrorMessage.Visibility = Visibility.Visible;
                ResumeOutput.Text = "";
            }
        }
    }
}   