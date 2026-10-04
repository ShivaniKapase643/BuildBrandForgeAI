import { ArrowRight, CheckCircle2, Sparkles, Wand2, ShieldCheck, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Sparkles, title: 'AI-native creative system', text: 'Turn one photo and brief into multiple brand-consistent concepts.' },
  { icon: Wand2, title: 'Platform optimization', text: 'Generate caption, hashtags, tone and layout variants for each network.' },
  { icon: ShieldCheck, title: 'Human approval', text: 'Review, edit, and approve before export or publishing.' },
  { icon: Clock3, title: 'Faster production', text: 'Target time-to-post improved across your workflow.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold to-brand-blue font-black text-slate-950">B</div>
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-brand-gold">BrandForge</div>
            <div className="text-lg font-semibold">AI</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-300 transition hover:text-white">Login</Link>
          <Link to="/register" className="rounded-full border border-brand-gold px-4 py-2 text-sm font-medium text-brand-gold hover:bg-brand-gold hover:text-slate-950">Get started</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blue/40 bg-brand-blue/10 px-4 py-2 text-sm text-brand-blue">
              <Sparkles size={16} />
              AI Content Studio for Brands & Creators
            </div>
            <h1 className="max-w-xl text-5xl font-black leading-tight text-white sm:text-6xl">
              Your brand. Your style. AI-powered content.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              Turn one product photo and one-line brief into publish-ready social content in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/app/content" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-gold to-brand-blue px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]">
                Create Content <ArrowRight size={18} />
              </Link>
              <Link to="/register" className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-100 transition hover:border-slate-500">
                See demo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              {['Brand-safe tone', 'Platform-ready variants', 'Human approval'].map((item) => (
                <div key={item} className="flex items-center gap-2"><CheckCircle2 size={16} className="text-brand-gold" />{item}</div>
              ))}
            </div>
          </div>

          <div className="card-glass rounded-[28px] p-4">
            <div className="rounded-[22px] border border-slate-800 bg-slate-900/80 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Post preview</div>
                  <div className="mt-1 text-xl font-semibold">Launch drop</div>
                </div>
                <div className="rounded-full border border-brand-gold/50 bg-brand-gold/10 px-2 py-1 text-xs text-brand-gold">AI generated</div>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-3">
                <div className="mb-3 h-64 rounded-xl bg-gradient-to-br from-brand-gold/40 via-brand-blue/20 to-slate-800" />
                <div className="rounded-xl bg-slate-900 p-3 text-sm text-slate-200">
                  “Built for the moment. Launch day energy meets premium design and creator-first storytelling.”
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-brand-blue">
                  <span>#LaunchReady</span>
                  <span>#BrandStory</span>
                  <span>#CreatorEconomy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-glass rounded-2xl p-5">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold"><Icon size={20} /></div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
