import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { currentUser, users, register, login, loading, isApiMode } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameOrEmail, setNameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) navigate('/', { replace: true });
  }, [currentUser, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Введите имя');
      return;
    }
    if (isApiMode && !password) {
      setError('Введите пароль');
      return;
    }
    try {
      await register(trimmed, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Ошибка регистрации');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const value = (isApiMode ? nameOrEmail : name).trim();
    if (!value) {
      setError(isApiMode ? 'Введите имя или email' : 'Введите имя');
      return;
    }
    if (isApiMode && !password) {
      setError('Введите пароль');
      return;
    }
    try {
      if (isApiMode) {
        const user = await login(value, password);
        if (user) navigate('/', { replace: true });
        else setError('Неверное имя или пароль');
      } else {
        const user = register(value, email);
        if (user) navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Ошибка входа');
    }
  };

  const handleLoginAs = (userId) => {
    if (!isApiMode) login(userId);
    navigate('/', { replace: true });
  };

  if (loading) {
    return (
      <section className="view login-page">
        <div className="login-card">
          <p className="login-desc">Загрузка...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="view login-page">
      <div className="login-card">
        <h1>Вход в Scrum PM</h1>
        {isApiMode ? (
          <>
            <p className="login-desc">Войдите или зарегистрируйтесь (аккаунт на сервере)</p>
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="login-form">
                <label>
                  Имя или email
                  <input
                    type="text"
                    value={nameOrEmail}
                    onChange={(e) => setNameOrEmail(e.target.value)}
                    placeholder="Имя или email"
                    autoComplete="username"
                  />
                </label>
                <label>
                  Пароль
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    autoComplete="current-password"
                  />
                </label>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="btn btn-primary btn-block">
                  Войти
                </button>
                <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: '0.5rem' }} onClick={() => { setMode('register'); setError(''); }}>
                  Нет аккаунта? Регистрация
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="login-form">
                <label>
                  Имя
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как к вам обращаться"
                    autoComplete="username"
                  />
                </label>
                <label>
                  Email <span className="optional">(необязательно)</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    autoComplete="email"
                  />
                </label>
                <label>
                  Пароль
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Не менее 6 символов"
                    autoComplete="new-password"
                  />
                </label>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="btn btn-primary btn-block">
                  Зарегистрироваться
                </button>
                <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: '0.5rem' }} onClick={() => { setMode('login'); setError(''); }}>
                  Уже есть аккаунт? Войти
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            <p className="login-desc">Введите имя для входа или выберите существующий аккаунт</p>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(e); }} className="login-form">
              <label>
                Имя
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  autoComplete="username"
                />
              </label>
              <label>
                Email <span className="optional">(необязательно)</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  autoComplete="email"
                />
              </label>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="btn btn-primary btn-block">
                Войти
              </button>
            </form>
            {users.length > 0 && (
              <>
                <div className="login-divider">или войти как</div>
                <ul className="login-users">
                  {users.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-block btn-user"
                        onClick={() => handleLoginAs(u.id)}
                      >
                        {u.name}
                        {u.email && <span className="user-email">{u.email}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
