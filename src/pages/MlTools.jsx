import { useState } from 'react';
import { apiFetch } from '../lib/api';

export default function MlTools() {
  const [error, setError] = useState('');
  const [cropResult, setCropResult] = useState(null);
  const [fertResult, setFertResult] = useState(null);
  const [diseaseResult, setDiseaseResult] = useState(null);

  const [cropForm, setCropForm] = useState({
    nitrogen: '0',
    phosphorous: '0',
    pottasium: '0',
    ph: '7',
    rainfall: '0',
    city: '',
  });

  const [fertForm, setFertForm] = useState({
    cropname: '',
    nitrogen: '0',
    phosphorous: '0',
    pottasium: '0',
  });

  const [file, setFile] = useState(null);

  async function runCrop(e) {
    e.preventDefault();
    setError('');
    setCropResult(null);
    try {
      const data = await apiFetch('/ml/crop-predict', { method: 'POST', body: cropForm });
      setCropResult(data);
    } catch (err) {
      setError(err.message || 'Crop prediction failed');
    }
  }

  async function runFert(e) {
    e.preventDefault();
    setError('');
    setFertResult(null);
    try {
      const data = await apiFetch('/ml/fertilizer-predict', { method: 'POST', body: fertForm });
      setFertResult(data);
    } catch (err) {
      setError(err.message || 'Fertilizer prediction failed');
    }
  }

  async function runDisease(e) {
    e.preventDefault();
    setError('');
    setDiseaseResult(null);
    try {
      if (!file) throw new Error('Choose an image first');
      const form = new FormData();
      form.append('file', file);
      const data = await apiFetch('/ml/disease-predict', { method: 'POST', body: form, isForm: true });
      setDiseaseResult(data);
    } catch (err) {
      setError(err.message || 'Disease prediction failed');
    }
  }

  return (
    <div>
      <div className="max-w-[70ch]">
        <div className="font-serif text-greenDeep text-[52px] leading-[1.06] tracking-wide">ML tools</div>
        <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
          Requests flow from frontend to Node, then to Flask—one secure surface.
        </div>
      </div>

      {error ? (
        <div className="mt-8 rounded-2xl bg-gold/15 border border-gold/40 px-6 py-4 text-neutral-900/80 tracking-wide">{error}</div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Crop</div>
          <div className="mt-3 font-serif text-greenDeep text-[28px] leading-[1.12] tracking-wide">Recommendation</div>
          <form className="mt-6 space-y-4" onSubmit={runCrop}>
            {['nitrogen', 'phosphorous', 'pottasium', 'ph', 'rainfall', 'city'].map((k) => (
              <label className="block" key={k}>
                <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">{k}</div>
                <input
                  className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
                  value={cropForm[k]}
                  onChange={(e) => setCropForm((s) => ({ ...s, [k]: e.target.value }))}
                  required
                />
              </label>
            ))}
            <button className="mt-2 px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition" type="submit">
              Predict
            </button>
          </form>
          {cropResult ? <div className="mt-6 rounded-2xl bg-cream/70 border border-neutral-900/10 p-5">Prediction: {cropResult.crop_prediction}</div> : null}
        </div>

        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Fertilizer</div>
          <div className="mt-3 font-serif text-greenDeep text-[28px] leading-[1.12] tracking-wide">Recommendation</div>
          <form className="mt-6 space-y-4" onSubmit={runFert}>
            {['cropname', 'nitrogen', 'phosphorous', 'pottasium'].map((k) => (
              <label className="block" key={k}>
                <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">{k}</div>
                <input
                  className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
                  value={fertForm[k]}
                  onChange={(e) => setFertForm((s) => ({ ...s, [k]: e.target.value }))}
                  required
                />
              </label>
            ))}
            <button className="mt-2 px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition" type="submit">
              Predict
            </button>
          </form>
          {fertResult ? <div className="mt-6 rounded-2xl bg-cream/70 border border-neutral-900/10 p-5">{fertResult.fertilizer_recommendation}</div> : null}
        </div>

        <div className="rounded-2xl bg-beige/40 border border-neutral-900/10 p-7 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
          <div className="text-[13px] uppercase tracking-[0.12em] text-neutral-900/55">Disease</div>
          <div className="mt-3 font-serif text-greenDeep text-[28px] leading-[1.12] tracking-wide">Detection</div>
          <form className="mt-6 space-y-4" onSubmit={runDisease}>
            <label className="block">
              <div className="text-[13px] tracking-[0.08em] text-neutral-900/55 mb-2">Leaf image</div>
              <input
                className="w-full rounded-xl border border-neutral-900/10 bg-cream/80 px-4 py-3 outline-none focus:border-greenDeep/30 transition"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <button className="mt-2 px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition" type="submit">
              Predict
            </button>
          </form>
          {diseaseResult ? (
            <div className="mt-6 rounded-2xl bg-cream/70 border border-neutral-900/10 p-5">
              <div>Disease: {diseaseResult.disease}</div>
              <div className="mt-2 text-neutral-900/65 tracking-wide leading-[1.7]">{diseaseResult.info}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

