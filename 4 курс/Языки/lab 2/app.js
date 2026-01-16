class PasswordManager {
  constructor() {
    this.dbName = 'PasswordManagerDB';
    this.storeName = 'passwords';
    this.db = null;
    this.init();
  }

  async init() {
    await this.initIndexedDB();
    this.registerServiceWorker();
    this.setupEventListeners();
    this.loadPasswords();
    this.setupInstallPrompt();
  }

  initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const objectStore = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          objectStore.createIndex('url', 'url', { unique: false });
          objectStore.createIndex('login', 'login', { unique: false });
        }
      };
    });
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  }

  setupEventListeners() {
    const form = document.getElementById('passwordForm');
    const generateBtn = document.getElementById('generatePassword');
    const generatePasswordBtn = document.getElementById('generateBtn');
    const showPasswordCheckbox = document.getElementById('showPassword');
    const searchInput = document.getElementById('searchInput');

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    generateBtn.addEventListener('click', () => this.showPasswordOptions());
    generatePasswordBtn.addEventListener('click', () => this.generatePassword());
    showPasswordCheckbox.addEventListener('change', (e) => this.togglePasswordVisibility(e));
    searchInput.addEventListener('input', (e) => this.filterPasswords(e.target.value));

    const lengthSlider = document.getElementById('passwordLength');
    const lengthValue = document.getElementById('lengthValue');
    lengthSlider.addEventListener('input', (e) => {
      lengthValue.textContent = e.target.value;
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const url = document.getElementById('url').value;
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    if (!url || !login || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const passwordData = {
      url: url,
      login: login,
      password: password,
      createdAt: new Date().toISOString()
    };

    try {
      await this.savePassword(passwordData);
      this.loadPasswords();
      document.getElementById('passwordForm').reset();
      document.getElementById('passwordOptions').style.display = 'none';
      document.getElementById('lengthValue').textContent = '16';
      document.getElementById('passwordLength').value = 16;
    } catch (error) {
      alert('Ошибка при сохранении пароля');
    }
  }

  async savePassword(passwordData) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(passwordData);

      request.onsuccess = () => {
        const passwords = this.getPasswordsFromLocalStorage();
        passwords.push({ ...passwordData, id: request.result });
        localStorage.setItem('passwords', JSON.stringify(passwords));
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async loadPasswords() {
    try {
      const passwords = await this.getPasswordsFromIndexedDB();
      this.displayPasswords(passwords);
    } catch (error) {
      const passwords = this.getPasswordsFromLocalStorage();
      this.displayPasswords(passwords);
    }
  }

  getPasswordsFromIndexedDB() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Получение паролей из localStorage
  getPasswordsFromLocalStorage() {
    const stored = localStorage.getItem('passwords');
    return stored ? JSON.parse(stored) : [];
  }

  // Отображение паролей
  displayPasswords(passwords) {
    const listContainer = document.getElementById('passwordsList');
    
    if (passwords.length === 0) {
      listContainer.innerHTML = '<p class="empty-message">Нет сохраненных паролей</p>';
      return;
    }

    listContainer.innerHTML = passwords.map((item, index) => {
      const displayId = item.id || index;
      return `
        <div class="password-item" data-id="${displayId}">
          <div class="password-item-header">
            <h3>${this.getDomainFromUrl(item.url)}</h3>
            <div class="password-item-actions">
              <button class="btn-copy" data-type="password" data-value="${this.escapeHtml(item.password)}" title="Копировать пароль">
                📋 Пароль
              </button>
              <button class="btn-copy" data-type="login" data-value="${this.escapeHtml(item.login)}" title="Копировать логин">
                👤 Логин
              </button>
              <button class="btn-delete" data-id="${displayId}" title="Удалить">
                🗑️
              </button>
            </div>
          </div>
          <div class="password-item-body">
            <p><strong>URL:</strong> <a href="${item.url}" target="_blank" rel="noopener">${item.url}</a></p>
            <p><strong>Логин:</strong> <span class="login-value">${this.escapeHtml(item.login)}</span></p>
            <p><strong>Пароль:</strong> <span class="password-value" data-password="${this.escapeHtml(item.password)}">••••••••</span></p>
            <p class="password-item-date">Создано: ${new Date(item.createdAt).toLocaleString('ru-RU')}</p>
          </div>
        </div>
      `;
    }).join('');

    // Добавляем обработчики для кнопок
    listContainer.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', (e) => this.copyToClipboard(e));
    });

    listContainer.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', (e) => this.deletePassword(e));
    });

    listContainer.querySelectorAll('.password-value').forEach(span => {
      span.addEventListener('click', (e) => this.togglePasswordDisplay(e));
    });
  }

  // Получение домена из URL
  getDomainFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return url;
    }
  }

  // Экранирование HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Копирование в буфер обмена
  async copyToClipboard(event) {
    const value = event.target.getAttribute('data-value');
    const type = event.target.getAttribute('data-type');
    
    try {
      await navigator.clipboard.writeText(value);
      const originalText = event.target.textContent;
      event.target.textContent = '✓ Скопировано!';
      event.target.style.color = '#4CAF50';
      
      setTimeout(() => {
        event.target.textContent = originalText;
        event.target.style.color = '';
      }, 2000);
    } catch (error) {
      // Fallback для старых браузеров
      const textArea = document.createElement('textarea');
      textArea.value = value;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      alert(`${type === 'password' ? 'Пароль' : 'Логин'} скопирован в буфер обмена`);
    }
  }

  // Удаление пароля
  async deletePassword(event) {
    const id = parseInt(event.target.getAttribute('data-id'));
    
    if (!confirm('Вы уверены, что хотите удалить этот пароль?')) {
      return;
    }

    try {
      // Удаление из IndexedDB
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      await new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // Удаление из localStorage
      const passwords = this.getPasswordsFromLocalStorage();
      const filtered = passwords.filter(p => p.id !== id);
      localStorage.setItem('passwords', JSON.stringify(filtered));

      this.loadPasswords();
    } catch (error) {
      console.error('Ошибка удаления пароля:', error);
      alert('Ошибка при удалении пароля');
    }
  }

  // Переключение отображения пароля
  togglePasswordDisplay(event) {
    const span = event.target;
    const password = span.getAttribute('data-password');
    
    if (span.textContent === '••••••••') {
      span.textContent = password;
    } else {
      span.textContent = '••••••••';
    }
  }

  // Фильтрация паролей
  filterPasswords(searchTerm) {
    const items = document.querySelectorAll('.password-item');
    const term = searchTerm.toLowerCase();

    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(term) ? 'block' : 'none';
    });
  }

  // Показать опции генератора паролей
  showPasswordOptions() {
    const options = document.getElementById('passwordOptions');
    options.style.display = options.style.display === 'none' ? 'block' : 'none';
  }

  // Генерация пароля
  generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const useUppercase = document.getElementById('useUppercase').checked;
    const useLowercase = document.getElementById('useLowercase').checked;
    const useNumbers = document.getElementById('useNumbers').checked;
    const useSymbols = document.getElementById('useSymbols').checked;

    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
      alert('Выберите хотя бы один тип символов');
      return;
    }

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    if (useUppercase) charset += uppercase;
    if (useLowercase) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('password').value = password;
    document.getElementById('passwordOptions').style.display = 'none';
  }

  // Переключение видимости пароля в форме
  togglePasswordVisibility(event) {
    const passwordInput = document.getElementById('password');
    passwordInput.type = event.target.checked ? 'text' : 'password';
  }

  // Настройка подсказки установки приложения
  setupInstallPrompt() {
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.display = 'block';
    });

    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installBtn.style.display = 'none';
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA установлено');
      installBtn.style.display = 'none';
      deferredPrompt = null;
    });
  }
}

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  new PasswordManager();
});

