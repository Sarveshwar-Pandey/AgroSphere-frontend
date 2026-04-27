import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Headbar() {
  const { user, logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
        <div className="h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link to="/" className="font-serif text-greenDeep tracking-wide text-[20px]">
              AgroSphere
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-[14px] tracking-wide text-neutral-900/65">
              <a href="#features" className="hover:text-greenDeep transition">
                Features
              </a>
              <a href="#testimonials" className="hover:text-greenDeep transition">
                Testimonials
              </a>
              <a href="#about" className="hover:text-greenDeep transition">
                About
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/signin"
                  className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/app"
                  className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition"
                >
                  Enter app
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="h-px bg-neutral-900/10" />
    </header>
  );
}

