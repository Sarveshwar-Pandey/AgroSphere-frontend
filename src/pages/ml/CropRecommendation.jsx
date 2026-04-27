import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function CropRecommendation() {
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    nitrogen: '0',
    phosphorous: '0',
    pottasium: '0',
    ph: '7',
    rainfall: '0',
    city: '',
  });

  async function run(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const data = await apiFetch('/ml/crop-predict', { method: 'POST', body: form });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed');
    }
  }

  return (
    <div>
      <div className="max-w-[70ch]">
        <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">Crop recommendation</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
          Enter soil inputs and location. Receive a grounded crop suggestion.
        </div>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">{error}</div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Inputs</div>
          <form className="mt-6 space-y-4" onSubmit={run}>
            {['nitrogen', 'phosphorous', 'pottasium', 'ph', 'rainfall', 'city'].map((k) => (
              <label className="block" key={k}>
                <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">{k}</div>
                <input
                  className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
                  value={form[k]}
                  onChange={(e) => setForm((s) => ({ ...s, [k]: e.target.value }))}
                  required
                />
              </label>
            ))}
            <button className="mt-2 px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition" type="submit">
              Predict
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Result</div>
          <div className="mt-6 rounded-2xl bg-cream/70 border border-neutral-900/10 p-6 min-h-[240px]">
            {result?.crop_prediction ? (
              <div className="text-neutral-900/80 tracking-wide">
                Suggested crop: <span className="font-medium">{result.crop_prediction}</span>
              </div>
            ) : (
              <div className="text-neutral-900/60 tracking-wide">Awaiting prediction.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

