using System.Linq;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace PasswordManagerApp
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            UpdateUI();
            UpdateProfileFields();
        }

        private void Unlock_Click(object sender, RoutedEventArgs e)
        {
            Button button = sender as Button;
            PasswordBox passwordBox = null;

            if (button.Parent is StackPanel stackPanel)
            {
                passwordBox = stackPanel.Children.OfType<PasswordBox>().FirstOrDefault();
            }

            if (passwordBox != null && PasswordManager.Instance.Authenticate(passwordBox.Password))
            {
                UpdateUI();
                MessageBox.Show("Access granted!");
            }
            else
            {
                MessageBox.Show("Incorrect master password.");
            }
        }

        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            PasswordManager.Instance.Logout();
            UpdateUI();
            MessageBox.Show("Logged out successfully.");
        }

        private void UpdateProfile_Click(object sender, RoutedEventArgs e)
        {
            string name = ProfileNameTextBox.Text;
            string email = ProfileEmailTextBox.Text;

            if (!string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(email))
            {
                try
                {
                    PasswordManager.Instance.UpdateProfile(name, email);
                    MessageBox.Show("Profile updated successfully!");
                    UpdateNotificationsList();
                }
                catch (InvalidOperationException)
                {
                    MessageBox.Show("Please authenticate first.");
                }
            }
            else
            {
                MessageBox.Show("Please fill in all fields.");
            }
        }

        private void AddNotification_Click(object sender, RoutedEventArgs e)
        {
            string message = NotificationTextBox.Text;

            if (!string.IsNullOrWhiteSpace(message))
            {
                try
                {
                    PasswordManager.Instance.AddNotification(message);
                    NotificationTextBox.Text = string.Empty;
                    UpdateNotificationsList();
                    MessageBox.Show("Notification added successfully!");
                }
                catch (InvalidOperationException)
                {
                    MessageBox.Show("Please authenticate first.");
                }
            }
            else
            {
                MessageBox.Show("Please enter a notification message.");
            }
        }

        private void ChangePassword_Click(object sender, RoutedEventArgs e)
        {
            string oldPassword = OldPasswordTextBox.Password;
            string newPassword = NewPasswordTextBox.Password;

            if (!string.IsNullOrWhiteSpace(oldPassword) && !string.IsNullOrWhiteSpace(newPassword))
            {
                try
                {
                    if (PasswordManager.Instance.ChangeMasterPassword(oldPassword, newPassword))
                    {
                        OldPasswordTextBox.Password = string.Empty;
                        NewPasswordTextBox.Password = string.Empty;
                        MessageBox.Show("Master password changed successfully!");
                        UpdateNotificationsList();
                        // Выход из системы после смены пароля
                        PasswordManager.Instance.Logout();
                        UpdateUI();
                        MessageBox.Show("Logged out after password change. Please log in with the new password.");
                    }
                    else
                    {
                        MessageBox.Show("Failed to change password. Check the old password.");
                    }
                }
                catch (InvalidOperationException)
                {
                    MessageBox.Show("Please authenticate first.");
                }
            }
            else
            {
                MessageBox.Show("Please fill in both password fields.");
            }
        }

        private void ThemeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (ThemeComboBox.SelectedItem is ComboBoxItem selectedItem)
            {
                string theme = selectedItem.Content.ToString();
                PasswordManager.Instance.Theme = theme;
                ApplyTheme(theme);
                try
                {
                    PasswordManager.Instance.AddNotification($"Theme changed to {theme}");
                    UpdateNotificationsList();
                }
                catch (InvalidOperationException)
                {
                    MessageBox.Show("Please authenticate first.");
                }
            }
        }

        private void MainTabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UpdateUI();
        }

        private void UpdateUI()
        {
            if (PasswordManager.Instance.IsAuthenticated)
            {
                ProfileAuthGrid.Visibility = Visibility.Collapsed;
                ProfileContentGrid.Visibility = Visibility.Visible;
                NotificationsAuthGrid.Visibility = Visibility.Collapsed;
                NotificationsContentGrid.Visibility = Visibility.Visible;
                SettingsAuthGrid.Visibility = Visibility.Collapsed;
                SettingsContentGrid.Visibility = Visibility.Visible;
                SecurityAuthGrid.Visibility = Visibility.Collapsed;
                SecurityContentGrid.Visibility = Visibility.Visible;

                UpdateProfileFields();
                UpdateNotificationsList();
                ThemeComboBox.SelectedItem = ThemeComboBox.Items.Cast<ComboBoxItem>()
                    .FirstOrDefault(item => item.Content.ToString() == PasswordManager.Instance.Theme);
            }
            else
            {
                ProfileAuthGrid.Visibility = Visibility.Visible;
                ProfileContentGrid.Visibility = Visibility.Collapsed;
                NotificationsAuthGrid.Visibility = Visibility.Visible;
                NotificationsContentGrid.Visibility = Visibility.Collapsed;
                SettingsAuthGrid.Visibility = Visibility.Visible;
                SettingsContentGrid.Visibility = Visibility.Collapsed;
                SecurityAuthGrid.Visibility = Visibility.Visible;
                SecurityContentGrid.Visibility = Visibility.Collapsed;
            }
        }

        private void UpdateProfileFields()
        {
            if (PasswordManager.Instance.IsAuthenticated)
            {
                var profile = PasswordManager.Instance.GetProfile();
                ProfileNameTextBox.Text = profile.Name;
                ProfileEmailTextBox.Text = profile.Email;
            }
        }

        private void UpdateNotificationsList()
        {
            if (PasswordManager.Instance.IsAuthenticated)
            {
                NotificationsListView.ItemsSource = PasswordManager.Instance.GetAllNotifications();
            }
        }

        private void ApplyTheme(string theme)
        {
            if (theme == "Dark")
            {
                Application.Current.Resources["BackgroundBrush"] = new SolidColorBrush(Colors.DarkGray);
                Application.Current.Resources["ForegroundBrush"] = new SolidColorBrush(Colors.White);
            }
            else
            {
                Application.Current.Resources["BackgroundBrush"] = new SolidColorBrush(Colors.White);
                Application.Current.Resources["ForegroundBrush"] = new SolidColorBrush(Colors.Black);
            }

            Background = (Brush)Application.Current.Resources["BackgroundBrush"];
            MainTabControl.Foreground = (Brush)Application.Current.Resources["ForegroundBrush"];
        }
    }
}