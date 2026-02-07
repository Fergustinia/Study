import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            Scrum PM
          </NavLink>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')} end>
              Дашборд
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Проекты
            </NavLink>
            <NavLink to="/sprints" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Спринты
            </NavLink>
            <NavLink to="/board" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Канбан
            </NavLink>
            <NavLink to="/metrics" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Метрики
            </NavLink>
          </nav>
          <div className="header-user">
            <NavLink to="/profile" className="header-user-name">
              {currentUser?.name}
            </NavLink>
            <button type="button" className="btn btn-secondary btn-small" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
    </>
  );
}
