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
        private readonly List<string> _resumeHistory = new List<string>(); // История резюме
        private bool _isDarkTheme = false; // Флаг темной темы
        private string _currentStyle = "Minimal"; // Текущий стиль резюме (по умолчанию минимальный)

        public MainWindow()
        {
            InitializeComponent();
        }

        // Создание минимального резюме
        private void MinimalResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentStyle = "Minimal";
            GenerateResume();
        }

        // Создание бизнес-резюме
        private void BusinessResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentStyle = "Business";
            GenerateResume();
        }

        // Создание креативного резюме
        private void CreativeResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentStyle = "Creative";
            GenerateResume();
        }

        // Создание академического резюме
        private void AcademicResumeButton_Click(object sender, RoutedEventArgs e)
        {
            _currentStyle = "Academic";
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
                Filter = "Текстовый файл (*.txt)|*.txt",
                DefaultExt = "txt",
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

                // Получаем данные из полей ввода
                string fullName = FullNameInput.Text.Trim();
                string contactInfo = ContactInfoInput.Text.Trim();
                string education = EducationInput.Text.Trim();
                string workExperience = WorkExperienceInput.Text.Trim();
                string skills = SkillsInput.Text.Trim();
                string additionalInfo = AdditionalInfoInput.Text.Trim();

                // Проверка на заполненность обязательных полей
                if (string.IsNullOrEmpty(fullName) || string.IsNullOrEmpty(contactInfo) ||
                    string.IsNullOrEmpty(education) || string.IsNullOrEmpty(workExperience) ||
                    string.IsNullOrEmpty(skills))
                {
                    ResumeOutput.Text = "";
                    return;
                }

                // Форматируем резюме в зависимости от текущего стиля (используем switch-оператор вместо switch-выражения)
                string resumeText;
                switch (_currentStyle)
                {
                    case "Minimal":
                        resumeText = FormatMinimalResume(fullName, contactInfo, education, workExperience, skills, additionalInfo);
                        break;
                    case "Business":
                        resumeText = FormatBusinessResume(fullName, contactInfo, education, workExperience, skills, additionalInfo);
                        break;
                    case "Creative":
                        resumeText = FormatCreativeResume(fullName, contactInfo, education, workExperience, skills, additionalInfo);
                        break;
                    case "Academic":
                        resumeText = FormatAcademicResume(fullName, contactInfo, education, workExperience, skills, additionalInfo);
                        break;
                    default:
                        resumeText = FormatMinimalResume(fullName, contactInfo, education, workExperience, skills, additionalInfo);
                        break;
                }

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

        // Форматирование резюме в минимальном стиле
        private string FormatMinimalResume(string fullName, string contactInfo, string education, string workExperience, string skills, string additionalInfo)
        {
            string result = "";
            result += $"ФИО \n{fullName}\nТелефон\n{contactInfo}\n\n";
            result += $"Образование:\n{education}\n\n";
            result += $"Опыт работы:\n{workExperience}\n\n";
            result += $"Навыки:\n{skills}\n";
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                result += $"\nДополнительная информация:\n{additionalInfo}\n";
            }
            return result;
        }

        // Форматирование резюме в бизнес-стиле
        private string FormatBusinessResume(string fullName, string contactInfo, string education, string workExperience, string skills, string additionalInfo)
        {
            string separator = "----------------------------------------";
            string result = "";
            result += $"ФИО \n{fullName}\nТелефон\n{contactInfo}\n{separator}\n";
            result += $"Полное образование\n{separator}\n{education}\n{separator}\n";
            result += $"Опыт работы по проффесии\n{separator}\n{workExperience}\n{separator}\n";
            result += $"В каких сферах работал\n{separator}\n{skills}\n{separator}\n";
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                result += $"\nДополнительная информация\n{separator}\n{additionalInfo}\n";
            }
            return result;
        }

        // Форматирование резюме в креативном стиле
        private string FormatCreativeResume(string fullName, string contactInfo, string education, string workExperience, string skills, string additionalInfo)
        {
            string result = "";
            result += $"✨ ФИО \n{fullName} ✨\n📞 Телефон\n  {contactInfo}\n\n";
            result += $"🎓 Где я учился 🎓\n{education}\n\n";
            result += $"💼 Где я работал 💼\n{workExperience}\n\n";
            result += $"🛠 Софт скиллс 🛠\n{skills}\n\n";
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                result += $"\n🌟 Ну что то еще 🌟\n{additionalInfo}\n";
            }
            return result;
        }

        // Форматирование резюме в академическом стиле
        private string FormatAcademicResume(string fullName, string contactInfo, string education, string workExperience, string skills, string additionalInfo)
        {
            string divider = "====";
            string result = "";
            result += $"ФИО \n{fullName}\nТелефон\n{contactInfo}\n{divider}\n";
            result += $"Образование в вузе\n{divider}\n{education}\n{divider}\n";
            result += $"Опыт прохождения практики\n{divider}\n{workExperience}\n{divider}\n";
            result += $"Приобритенные навыки\n{divider}\n{skills}\n{divider}\n";
            if (!string.IsNullOrEmpty(additionalInfo))
            {
                result += $"\nДополнительная информация\n{divider}\n{additionalInfo}\n";
            }
            return result;
        }
    }
}