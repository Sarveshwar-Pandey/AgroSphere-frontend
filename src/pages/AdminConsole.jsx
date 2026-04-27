import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

const STEPS = [
  { key: 'identity', title: 'Identity' },
  { key: 'land', title: 'Land' },
  { key: 'bank', title: 'Bank' },
];

export default function AdminConsole() {
  const [farmers, setFarmers] = useState([]);
  const [status, setStatus] = useState('in_review');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  async function load() {
    setError('');
    try {
      const data = await apiFetch(`/admin/farmers?status=${encodeURIComponent(status)}`);
      setFarmers(data?.farmers || []);
    } catch (err) {
      setError(err.message || 'Failed to load farmers');
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function reviewStep(farmerId, stepKey, action) {
    setError('');
    setBusy(`${farmerId}:${stepKey}:${action}`);
    try {
      await apiFetch(`/admin/farmers/${farmerId}/review-step`, {
        method: 'POST',
        body: { stepKey, action },
      });
      await load();
    } catch (err) {
      setError(err.message || 'Review failed');
    } finally {
      setBusy('');
    }
  }

  return (
    <div>
      <div className="max-w-[70ch]">
        <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">Admin console</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
          Review farmer documents step-by-step. Approve or reject per step.
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[260px]">
            <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">Filter by status</div>
            <select
              className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="unverified">unverified</option>
              <option value="in_review">in_review</option>
              <option value="verified">verified</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
          <button
            className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition"
            type="button"
            onClick={load}
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-10 rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">{error}</div>
      ) : null}

      <div className="mt-10 space-y-6">
        {farmers.map((f) => {
          const steps = f.verification?.steps || [];
          const byKey = Object.fromEntries(steps.map((s) => [s.key, s]));
          return (
            <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]" key={f._id}>
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div>
                  <div className="font-serif text-greenDeep text-[28px] tracking-wide leading-[1.15]">{f.name}</div>
                  <div className="mt-2 text-neutral-900/65 tracking-wide">{f.email}</div>
                </div>
                <div className="inline-flex px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">
                  {f.verification?.status || 'unverified'}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                {STEPS.map((s) => {
                  const step = byKey[s.key] || { status: 'missing' };
                  const viewUrl = step.fileUrl ? `http://localhost:4000${step.fileUrl}` : '';
                  return (
                    <div className="rounded-2xl bg-cream/70 border border-neutral-900/10 p-6" key={s.key}>
                      <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">{s.title}</div>
                      <div className="mt-4 inline-flex px-3 py-2 rounded-full border border-neutral-900/10 bg-cream/80 text-[12px] tracking-wide text-neutral-900/70">
                        {step.status}
                      </div>
                      {viewUrl ? (
                        <a className="mt-4 block text-greenDeep tracking-wide hover:underline hover:tracking-wider transition" href={viewUrl} target="_blank" rel="noreferrer">
                          View document
                        </a>
                      ) : (
                        <div className="mt-4 text-neutral-900/60 tracking-wide">No document uploaded.</div>
                      )}
                      <div className="mt-6 flex flex-wrap gap-4">
                        <button
                          className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition disabled:opacity-60 disabled:hover:translate-y-0"
                          type="button"
                          disabled={busy === `${f._id}:${s.key}:approved`}
                          onClick={() => reviewStep(f._id, s.key, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition disabled:opacity-60"
                          type="button"
                          disabled={busy === `${f._id}:${s.key}:rejected`}
                          onClick={() => reviewStep(f._id, s.key, 'rejected')}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

