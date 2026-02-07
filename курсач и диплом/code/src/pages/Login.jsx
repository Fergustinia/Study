import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { currentUser, users, register, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) navigate('/', { replace: true });
  }, [currentUser, navigate]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Введите имя');
      return;
    }
    const user = register(trimmed, email);
    if (user) navigate('/', { replace: true });
  };

  const handleLoginAs = (userId) => {
    login(userId);
    navigate('/', { replace: true });
  };

  return (
    <section className="view login-page">
      <div className="login-card">
        <h1>Вход в Scrum PM</h1>
        <p className="login-desc">Введите имя для входа или выберите существующий аккаунт</p>

        <form onSubmit={handleSubmit} className="login-form">
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
      </div>
    </section>
  );
}
