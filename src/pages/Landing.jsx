import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headbar from '../components/Headbar';

import hero from '../assets/hero.png';

function useScrollIndex(max) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const section = Math.max(1, window.innerHeight * 0.55);
      const next = Math.min(max, Math.max(0, Math.floor(y / section)));
      setIdx(next);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [max]);
  return idx;
}

const GLASS = [
  {
    title: 'Crop Recommendation',
    body: 'Recommends best suitable crop according to the soil type and other factors',
  },
  {
    title: 'Fertilizer Recommendation',
    body: 'Recommends different fertilizer according to the nutrients level in the soil',
  },
  {
    title: 'Forum',
    body: 'Farmers share progress, questions, and learnings with images and context.',
  },
  {
    title: 'Plant disease detection',
    body: 'Tells us about the type of disease and its possible solution in no time.',
  }
];

export default function Landing() {
  const [showHeadline, setShowHeadline] = useState(false);
  const idx = useScrollIndex(GLASS.length - 1);
  const nav = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setShowHeadline(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-cream text-neutral-900 font-sans">
      <Headbar />

      {/* Hero */}
      <section className="relative min-h-[100svh] pt-[72px]">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-cream/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/30 via-transparent to-cream/70" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
          <div className="pt-[140px] pb-[120px]">
            <div className="max-w-[54ch]">
              <div
                className={[
                  'font-serif text-greenDeep tracking-wide leading-[1.04]',
                  'text-[44px] sm:text-[56px] lg:text-[68px]',
                  'transition-all duration-700 ease-in-out',
                  showHeadline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                ].join(' ')}
              >
                Agriculture isn&apos;t a guesswork
              </div>
              <div
                className={[
                  'mt-4 text-neutral-900/65 tracking-wide text-[15px] sm:text-[16px] max-w-[52ch]',
                  'transition-all duration-700 ease-in-out delay-200',
                  showHeadline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                ].join(' ')}
              >
                Simple easy to use platform to recommend crops, detect diseases, guide fertilizer, and build a community of farmers to share and discuss things.
              </div>

              <div
                className={[
                  'mt-6 flex flex-wrap gap-4 transition-all duration-700 ease-in-out delay-300',
                  showHeadline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
                ].join(' ')}
              >
                <button
                  type="button"
                  onClick={() => nav('/app')}
                  className="px-6 py-3 rounded-xl bg-greenDeep text-cream text-[14px] tracking-wide hover:translate-y-[-2px] hover:shadow-lg transition"
                >
                  Enter the platform
                </button>
                <a
                  href="#features"
                  className="px-6 py-3 rounded-xl border border-olive/60 text-greenDeep text-[14px] tracking-wide hover:bg-olive/10 transition"
                >
                  Explore features
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll glass cards (tilted, sequential) */}
        <div className="relative mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
          <div className="pb-[2px]">
            <div className="h-[140svh] relative">
              <div className="sticky top-[120px]">
                <div className="flex items-start gap-6">
                  {GLASS.map((c, i) => {
                    const visible = i <= idx;
                    const tilt = i === 0 ? '-rotate-2' : i === 1 ? 'rotate-2' : '-rotate-1';
                    const offset = i * 28;
                    return (
                      <div
                        key={c.title}
                        className={[
                          'w-full md:w-[4000px] lg:w-[380px]',
                          'glass rounded-2xl p-7',
                          'transition-all duration-700 ease-in-out',
                          tilt,
                          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                        ].join(' ')}
                        style={{ transformOrigin: 'left top', marginTop: `${offset}px` }}
                      >
                        <div className="text-[13px] tracking-[0.12em] uppercase text-neutral-900/70">AgroSphere</div>
                        <div className="mt-3 font-serif text-taupe-950 text-[40px] leading-[1.12] tracking-wide">{c.title}</div>
                        <div className="mt-[10px] text-shadow-orange-50 text-[15px] tracking-wide leading-[1.55]">{c.body}</div>
                      </div>
                    );
                  })}
                  <div className="hidden md:block flex-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-[120px]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
          <div className="max-w-[60ch]">
            <div className="font-serif text-greenDeep text-[44px] sm:text-[52px] leading-[1.06] tracking-wide">Features</div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Crop recommendation', body: 'Crop recommendation on the basis of soil report and location', href: '/app/crop-recommendation' },
              { title: 'Crop disease detection', body: 'Upload a leaf of plant and get to know about possible disease and solution.', href: '/app/disease-detection' },
              { title: 'Fertilizer recommendation', body: 'Guides farmer on how to increase nutrient value in soil.', href: '/app/fertilizer-recommendation' },
              { title: 'Forum', body: 'Interact with farmers and build a community to share knowledge.', href: '/app/forum' },
            ].map((f) => (
              <button
                key={f.title}
                type="button"
                onClick={() => nav(f.href)}
                className="text-left rounded-2xl p-7 bg-beige/40 border border-neutral-900/10 shadow-[0_14px_26px_rgba(17,24,19,0.08)] hover:translate-y-[-4px] hover:shadow-[0_18px_34px_rgba(17,24,19,0.12)] transition duration-700 ease-in-out"
              >
                <div className="font-serif text-greenDeep text-[28px] leading-[1.12] tracking-wide">{f.title}</div>
                <div className="mt-[10px] text-neutral-900/65 tracking-wide leading-[1.6]">{f.body}</div>
                <div className="mt-6 text-greenDeep tracking-[0.12em] uppercase text-[12px]">Enter</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-[120px] bg-beige/35">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
          <div className="max-w-[60ch]">
            <div className="font-serif text-greenDeep text-[44px] sm:text-[52px] leading-[1.06] tracking-wide">Testimonials</div>
            <div className="mt-4 text-neutral-900/65 tracking-wide">What Our Customer Says!</div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Kaushal Sikriwal', text: 'It helped me grow various plants which doesnt usually grows near Son river side' },
              { name: 'Satyam Agrahari', text: 'Disease detection is most amazing feature of this platform, it diagnosed the correct disease ' },
              { name: 'Vishwa Deepak', text: 'One stop solution to all agriculure probelems, must recommend for all farmers and gardening enthusiast' },
              // { name: 'Ankit Pandey', text: 'The forum is clean and focused. It helped me connect with fellow farmers and build a community.' },
            ].map((t) => (
              <div key={t.name} className="rounded-2xl p-7 bg-cream/70 border border-neutral-900/10 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
                <div className="font-serif text-greenDeep text-[24px] tracking-wide leading-[1.15]">{t.name}</div>
                <div className="mt-4 text-neutral-900/70 tracking-wide leading-[1.65]">{t.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-[120px]">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="font-serif text-greenDeep text-[44px] sm:text-[52px] leading-[1.06] tracking-wide">About</div>
              <div className="mt-4 text-neutral-900/65 tracking-wide leading-[1.75]">
                AgroSphere is a community driven non profit organization whose aim is to help every farmer and bring together all Botanophiles on a single platform.
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-neutral-900/10 shadow-[0_14px_26px_rgba(17,24,19,0.08)]">
              <img src={hero} alt="" className="w-full h-[360px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-[100px] bg-beige/35">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="font-serif text-greenDeep tracking-wide text-[22px]">AgroSphere</div>
              <div className="mt-4 text-neutral-900/65 tracking-wide max-w-[42ch]">
                Tools that shape tomorrow's future.
              </div>
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
        </div>
      </footer>
    </div>
  );
}

