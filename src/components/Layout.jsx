import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="appShell">
      <header className="nav">
        <div className="container navInner">
          <div className="navBrand">
            <Link className="brand" to="/">
              AgriSphere
            </Link>
          </div>
          <nav className="navLinks">
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
              Dashboard
            </NavLink>
            <NavLink to="/forum" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
              Forum
            </NavLink>
            <NavLink to="/ml" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
              ML Tools
            </NavLink>
            {user?.role === 'admin' ? (
              <NavLink to="/admin" className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}>
                Admin
              </NavLink>
            ) : null}
          </nav>
          <div className="navActions">
            <div className="navMeta">
              <div className="navName">{user?.name || 'Account'}</div>
              <div className="navSub">{user?.role || ''}</div>
            </div>
            <button className="btn secondary" onClick={logout} type="button">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footerInner">
          <div className="footerCol">
            <div className="footerTitle">AgriSphere</div>
            <div className="footerText">Calm, deliberate tools for real farming decisions.</div>
          </div>
          <div className="footerCol">
            <div className="footerTitle">Platform</div>
            <Link className="textLink" to="/dashboard">
              Dashboard
            </Link>
            <Link className="textLink" to="/forum">
              Forum
            </Link>
            <Link className="textLink" to="/ml">
              ML Tools
            </Link>
          </div>
          <div className="footerCol">
            <div className="footerTitle">Account</div>
            <Link className="textLink" to="/verification">
              Verification
            </Link>
            {user?.role === 'admin' ? (
              <Link className="textLink" to="/admin">
                Admin Console
              </Link>
            ) : null}
          </div>
        </div>
      </footer>
    </div>
  );
}

