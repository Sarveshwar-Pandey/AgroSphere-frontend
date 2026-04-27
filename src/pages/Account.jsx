import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function Account() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiFetch('/users/me');
        if (mounted && data?.user) setUser(data.user);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      mounted = false;
    };
  }, [setUser]);

  const status = user?.verification?.status || 'unverified';

  return (
    <div>
      <div className="max-w-[70ch]">
        <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">Account</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">Your profile, role, and verification state.</div>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">{error}</div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Profile</div>
          <div className="mt-6 space-y-3 text-neutral-900/80 tracking-wide">
            <div>
              <span className="text-neutral-900/60">Name</span>
              <div className="mt-1">{user?.name || ''}</div>
            </div>
            <div>
              <span className="text-neutral-900/60">Email</span>
              <div className="mt-1">{user?.email || ''}</div>
            </div>
            <div>
              <span className="text-neutral-900/60">Role</span>
              <div className="mt-1">{user?.role || 'farmer'}</div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Verification</div>
          <div className="mt-6">
            <div className="inline-flex px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">
              {status}
            </div>
            <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
              Farmers submit documents. Admin reviews each step and marks your account verified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

