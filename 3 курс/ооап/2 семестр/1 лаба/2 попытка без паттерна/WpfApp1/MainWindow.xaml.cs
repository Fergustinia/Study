using System.Linq;
using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace PasswordManagerApp
{
    public partial class MainWindow : Window
    {
        private PasswordManager _profileManager;
        private PasswordManager _notificationsManager;
        private PasswordManager _settingsManager;
        private PasswordManager _securityManager;
        private static string SharedMasterPassword = "master123"; // Для синхронизации мастер-пароля

        public MainWindow()
        {
            InitializeComponent();
            _profileManager = new PasswordManager();
            _notificationsManager = new PasswordManager();
            _settingsManager = new PasswordManager();
            _securityManager = new PasswordManager();
            UpdateUI();
            UpdateProfileFields();
        }

        private void Unlock_Click(object sender, RoutedEventArgs e)
        {
            Button button = sender as Button;
            PasswordBox passwordBox = null;
            PasswordManager manager = null;

            if (button.Parent is StackPanel stackPanel)
            {
                passwordBox = stackPanel.Children.OfType<PasswordBox>().FirstOrDefault();
            }

            if (passwordBox == null) return;

            if (passwordBox.Name == "MasterPasswordBoxProfile")
                manager = _profileManager;
            else if (passwordBox.Name == "MasterPasswordBoxNotifications")
                manager = _notificationsManager;
            else if (passwordBox.Name == "MasterPasswordBoxSettings")
                manager = _settingsManager;
            else if (passwordBox.Name == "MasterPasswordBoxSecurity")
                manager = _securityManager;

            if (manager != null && manager.Authenticate(passwordBox.Password))
            {
                UpdateUI();
                MessageBox.Show("Access granted for this tab!");
            }
            else
            {
                MessageBox.Show("Incorrect master password.");
            }
        }

        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            Button button = sender as Button;
            PasswordManager manager = null;

            if (button.Parent is StackPanel stackPanel)
            {
                if (stackPanel.Parent is Grid grid)
                {
                    if (grid.Name == "ProfileContentGrid")
                        manager = _profileManager;
                    else if (grid.Name == "NotificationsContentGrid")
                        manager = _notificationsManager;
                    else if (grid.Name == "SettingsContentGrid")
                        manager = _settingsManager;
                    else if (grid.Name == "SecurityContentGrid")
                        manager = _securityManager;
                }
            }

            if (manager != null)
            {
                manager.Logout();
                UpdateUI();
                MessageBox.Show("Logged out from this tab.");
            }
        }

        private void UpdateProfile_Click(object sender, RoutedEventArgs e)
        {
            string name = ProfileNameTextBox.Text;
            string email = ProfileEmailTextBox.Text;

            if (!string.IsNullOrWhiteSpace(name) && !string.IsNullOrWhiteSpace(email))
            {
                try
                {
                    _profileManager.UpdateProfile(name, email);
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
                    _notificationsManager.AddNotification(message);
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
                    if (_securityManager.ChangeMasterPassword(oldPassword, newPassword))
                    {
                        SharedMasterPassword = newPassword; // Синхронизация пароля
                        OldPasswordTextBox.Password = string.Empty;
                        NewPasswordTextBox.Password = string.Empty;
                        MessageBox.Show("Master password changed successfully!");
                        UpdateNotificationsList();
                        _securityManager.Logout();
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
                _settingsManager.Theme = theme;
                ApplyTheme(theme);
                try
                {
                    _settingsManager.AddNotification($"Theme changed to {theme}");
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
            ProfileAuthGrid.Visibility = _profileManager.IsAuthenticated ? Visibility.Collapsed : Visibility.Visible;
            ProfileContentGrid.Visibility = _profileManager.IsAuthenticated ? Visibility.Visible : Visibility.Collapsed;
            NotificationsAuthGrid.Visibility = _notificationsManager.IsAuthenticated ? Visibility.Collapsed : Visibility.Visible;
            NotificationsContentGrid.Visibility = _notificationsManager.IsAuthenticated ? Visibility.Visible : Visibility.Collapsed;
            SettingsAuthGrid.Visibility = _settingsManager.IsAuthenticated ? Visibility.Collapsed : Visibility.Visible;
            SettingsContentGrid.Visibility = _settingsManager.IsAuthenticated ? Visibility.Visible : Visibility.Collapsed;
            SecurityAuthGrid.Visibility = _securityManager.IsAuthenticated ? Visibility.Collapsed : Visibility.Visible;
            SecurityContentGrid.Visibility = _securityManager.IsAuthenticated ? Visibility.Visible : Visibility.Collapsed;

            UpdateProfileFields();
            UpdateNotificationsList();
            if (_settingsManager.IsAuthenticated)
            {
                ThemeComboBox.SelectedItem = ThemeComboBox.Items.Cast<ComboBoxItem>()
                    .FirstOrDefault(item => item.Content.ToString() == _settingsManager.Theme);
            }
        }

        private void UpdateProfileFields()
        {
            if (_profileManager.IsAuthenticated)
            {
                ProfileNameTextBox.Text = _profileManager.GetProfileName();
                ProfileEmailTextBox.Text = _profileManager.GetProfileEmail();
            }
        }

        private void UpdateNotificationsList()
        {
            if (_notificationsManager.IsAuthenticated)
            {
                NotificationsListView.ItemsSource = _notificationsManager.GetAllNotifications();
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