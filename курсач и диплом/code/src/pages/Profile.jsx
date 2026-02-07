import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      await updateProfile({ name: trimmed, email: email.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!currentUser) return null;

  return (
    <section className="view profile-page">
      <h1>Профиль</h1>
      <div className="profile-card">
        <div className="profile-avatar">
          {(currentUser.name || '?').charAt(0).toUpperCase()}
        </div>
        <form onSubmit={handleSubmit} className="profile-form">
          <label>
            Имя
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </label>
          {saved && <p className="profile-saved">Сохранено</p>}
          {error && <p className="login-error">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Сохранить
            </button>
          </div>
        </form>
        <div className="profile-actions">
          <button type="button" className="btn btn-secondary" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </section>
  );
}
