import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../lib/auth';
import { useAuth } from '../contexts/AuthContext';

export default function SignIn() {
  const nav = useNavigate();
  const loc = useLocation();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Always return to landing after login (user can "Enter app" from there)
  const redirectTo = '/';

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await login({ email, password });
      if (data?.user) setUser(data.user);
      nav(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-[100svh] bg-cream flex items-center justify-center px-5">
      <div className="w-full max-w-[520px] rounded-2xl bg-beige/40 border border-neutral-900/10 p-8 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
        <div className="font-serif text-greenDeep text-[34px] leading-[1.05] tracking-wide">Welcome back</div>
        <div className="mt-3 text-neutral-900/65 tracking-wide">Sign in to continue across the platform.</div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">Email</div>
            <input
              className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>
          <label className="block">
            <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">Password</div>
            <input
              className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>

          {error ? (
            <div className="rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">
              {error}
            </div>
          ) : null}

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition disabled:opacity-60 disabled:hover:translate-y-0"
              type="submit"
              disabled={busy}
            >
              {busy ? 'Signing in' : 'Sign in'}
            </button>
            <Link className="px-0 py-3 text-greenDeep text-[14px] tracking-wide hover:underline hover:tracking-wider transition" to="/signup">
              Create an account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

