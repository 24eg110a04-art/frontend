import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Icon from './Icon.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/transactions', label: 'Transactions', icon: 'list', end: true },
  { to: '/transactions/new', label: 'Add transaction', icon: 'plus' },
  { to: '/budget', label: 'Budget', icon: 'target' },
  { to: '/reports', label: 'Reports', icon: 'chart' },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <header className="topbar">
        <button aria-label="Open menu" onClick={() => setOpen(true)}><Icon name="menu" size={24} /></button>
        <div className="brand"><span className="brand-mark">₹</span>Expense Tracker</div>
        <span style={{ width: 36 }} />
      </header>

      <div className={`scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="brand"><span className="brand-mark">₹</span>Expense Tracker</div>
        <nav className="nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              <Icon name={item.icon} />{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="who"><strong>{user?.name}</strong>{user?.email}</div>
          <button className="btn btn-ghost" onClick={handleLogout}><Icon name="logout" />Log out</button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
