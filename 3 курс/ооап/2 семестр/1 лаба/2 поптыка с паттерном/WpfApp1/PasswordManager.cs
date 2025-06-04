using System;
using System.Collections.Generic;

namespace PasswordManagerApp
{
    public class PasswordManager
    {
        private static readonly PasswordManager _instance = new PasswordManager();
        private List<NotificationEntry> _notifications;
        private Profile _profile;
        private bool _isAuthenticated;
        private string _masterPassword = "master123"; // В реальном приложении используйте безопасное хранение

        private PasswordManager()
        {
            _notifications = new List<NotificationEntry>();
            _profile = new Profile { Name = "User", Email = "user@example.com" };
            _isAuthenticated = false;
        }

        public static PasswordManager Instance
        {
            get { return _instance; }
        }

        public bool IsAuthenticated
        {
            get { return _isAuthenticated; }
        }

        public bool Authenticate(string password)
        {
            if (password == _masterPassword)
            {
                _isAuthenticated = true;
                return true;
            }
            return false;
        }

        public void Logout()
        {
            _isAuthenticated = false;
            AddNotification("User logged out");
        }

        public bool ChangeMasterPassword(string oldPassword, string newPassword)
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");

            if (oldPassword == _masterPassword && !string.IsNullOrWhiteSpace(newPassword))
            {
                _masterPassword = newPassword;
                AddNotification("Master password changed");
                return true;
            }
            return false;
        }

        // Методы для профиля
        public Profile GetProfile()
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            return _profile;
        }

        public void UpdateProfile(string name, string email)
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            _profile.Name = name;
            _profile.Email = email;
            AddNotification($"Profile updated: {name}, {email}");
        }

        // Методы для уведомлений
        public void AddNotification(string message)
        {
            _notifications.Add(new NotificationEntry
            {
                Message = message,
                Timestamp = DateTime.Now
            });
        }

        public List<NotificationEntry> GetAllNotifications()
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            return new List<NotificationEntry>(_notifications);
        }

        // Настройки (например, тема)
        public string Theme { get; set; } = "Light";
    }

    public class Profile
    {
        public string Name { get; set; }
        public string Email { get; set; }
    }

    public class NotificationEntry
    {
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}