import { useEffect, useState } from 'react';
import { apiFetch, getUser, setUser } from '../lib/api';

const STEPS = [
  { key: 'identity', title: 'Identity document', hint: 'Government ID or equivalent.' },
  { key: 'land', title: 'Land document', hint: 'Proof of land ownership/lease.' },
  { key: 'bank', title: 'Bank document', hint: 'Account proof for transactions.' },
];

export default function Verification() {
  const [user, setUserState] = useState(() => getUser());
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState('');

  async function refresh() {
    try {
      const data = await apiFetch('/users/me');
      setUser(data.user);
      setUserState(data.user);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function upload(stepKey, file) {
    setError('');
    setBusyKey(stepKey);
    try {
      const form = new FormData();
      form.append('file', file);
      const data = await apiFetch(`/verification/${stepKey}/upload`, { method: 'POST', body: form, isForm: true });
      if (data?.user) {
        setUser(data.user);
        setUserState(data.user);
      } else {
        await refresh();
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusyKey('');
    }
  }

  const status = user?.verification?.status || 'unverified';
  const steps = user?.verification?.steps || [];
  const stepByKey = Object.fromEntries(steps.map((s) => [s.key, s]));

  return (
    <div>
      <div className="max-w-[70ch]">
        <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">Verification</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
          Upload each document once, then wait for admin review.
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
        <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Current status</div>
        <div className="mt-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">
            {status}
          </div>
          <div className="text-neutral-900/65 tracking-wide">Admins review each step and finalize your account.</div>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((s) => {
          const step = stepByKey[s.key] || { status: 'missing' };
          return (
            <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]" key={s.key}>
              <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">{s.title}</div>
              <div className="mt-3 text-neutral-900/65 tracking-wide leading-[1.75]">{s.hint}</div>
              <div className="mt-6 inline-flex px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">
                {step.status}
              </div>
              {step.note ? (
                <div className="mt-4 rounded-2xl bg-cream/70 border border-neutral-900/10 p-5 text-neutral-900/75 tracking-wide">
                  {step.note}
                </div>
              ) : null}
              <div className="mt-6">
                <label className="inline-flex items-center gap-4">
                  <div className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition">
                    {busyKey === s.key ? 'Uploading' : 'Choose file'}
                  </div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    disabled={busyKey === s.key}
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) upload(s.key, f);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
              {step.fileUrl ? (
                <a
                  className="mt-6 block text-greenDeep tracking-wide hover:underline hover:tracking-wider transition"
                  href={`http://localhost:4000${step.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View uploaded document
                </a>
              ) : null}
            </div>
          );
        })}
      </div>

      {error ? (
        <div className="mt-10 rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">{error}</div>
      ) : null}
    </div>
  );
}

