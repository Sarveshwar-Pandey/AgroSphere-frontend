import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AppShell() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-[100svh] bg-cream">
      <header className="h-[72px] flex items-center border-b border-neutral-900/10 bg-cream/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-[1280px] w-full px-5 sm:px-10 lg:px-20 flex items-center justify-between gap-12">
          <Link to="/" className="font-serif text-greenDeep tracking-wide text-[20px]">
            AgroSphere
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-[14px] tracking-wide text-neutral-900/65">
            <NavLink to="/app" end className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Home
            </NavLink>
            <NavLink to="/app/account" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Account
            </NavLink>
            <NavLink to="/app/verification" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Verification
            </NavLink>
            <NavLink to="/app/crop-recommendation" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Crop
            </NavLink>
            <NavLink to="/app/disease-detection" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Disease
            </NavLink>
            <NavLink to="/app/fertilizer-recommendation" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Fertilizer
            </NavLink>
            <NavLink to="/app/forum" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
              Forum
            </NavLink>
            {user?.role === 'admin' ? (
              <NavLink to="/app/admin" className={({ isActive }) => (isActive ? 'text-greenDeep' : 'hover:text-greenDeep transition')}>
                Admin
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-[13px] tracking-[0.08em] text-neutral-900/70">{user?.name || ''}</div>
              <div className="text-[12px] tracking-[0.10em] text-neutral-900/55">{user?.role || ''}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20 py-[80px]">
        <Outlet />
      </main>

      <footer className="py-[100px] bg-beige/35 border-t border-neutral-900/10">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="font-serif text-greenDeep tracking-wide text-[22px]">AgroSphere</div>
            <div className="mt-4 text-neutral-900/65 tracking-wide max-w-[42ch]">Premium tools for grounded agricultural decisions.</div>
          </div>
          <div className="text-neutral-900/65 tracking-wide">
            <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Built by</div>
            <div className="mt-4 text-greenDeep">Sarveshwar Pandey</div>
          </div>
          <div className="text-neutral-900/65 tracking-wide">
            <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Product</div>
            <div className="mt-4">Crop Recommendation</div>
            <div className="mt-2">Disease Detection</div>
            <div className="mt-2">Fertilizer Recommendation</div>
            <div className="mt-2">Forum</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

