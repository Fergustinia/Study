using System;
using System.Collections.Generic;

namespace PasswordManagerApp
{
    public class PasswordManager
    {
        private List<string> _notifications;
        private string _profileName;
        private string _profileEmail;
        private bool _isAuthenticated;
        private string _masterPassword;

        public PasswordManager()
        {
            _notifications = new List<string>();
            _profileName = "User";
            _profileEmail = "user@example.com";
            _isAuthenticated = false;
            _masterPassword = "master123"; // В реальном приложении используйте безопасное хранение
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

        public string GetProfileName()
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            return _profileName;
        }

        public string GetProfileEmail()
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            return _profileEmail;
        }

        public void UpdateProfile(string name, string email)
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            _profileName = name;
            _profileEmail = email;
            AddNotification($"Profile updated: {name}, {email}");
        }

        public void AddNotification(string message)
        {
            _notifications.Add(message);
        }

        public List<string> GetAllNotifications()
        {
            if (!_isAuthenticated)
                throw new InvalidOperationException("Not authenticated.");
            return new List<string>(_notifications);
        }

        public string Theme { get; set; } = "Light";
    }
}