export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="text-sm uppercase tracking-[0.22em] text-brand-gold">Analytics</div>
        <h1 className="mt-2 text-3xl font-bold text-white">Evaluation dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Number of generated posts', '24'],
          ['Number of approved posts', '12'],
          ['Average generation time', '3.2 min'],
          ['Number of edits', '8'],
        ].map(([label, value]) => (
          <div key={label} className="card-glass rounded-2xl p-5">
            <div className="text-sm text-slate-400">{label}</div>
            <div className="mt-3 text-3xl font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card-glass rounded-3xl p-6">
          <div className="mb-4 text-lg font-semibold text-white">Comparison</div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Manual workflow target</span><span className="font-medium text-white">~45 minutes/post</span></div>
            <div className="flex items-center justify-between"><span>BrandForge AI target</span><span className="font-medium text-white">~3 minutes/post</span></div>
            <div className="flex items-center justify-between"><span>Estimated time saved</span><span className="font-medium text-brand-gold">~42 minutes/post</span></div>
          </div>
        </div>

        <div className="card-glass rounded-3xl p-6">
          <div className="mb-4 text-lg font-semibold text-white">Usage profile</div>
          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center justify-between"><span>Most used platform</span><span className="font-medium text-white">Instagram</span></div>
            <div className="flex items-center justify-between"><span>Most used tone</span><span className="font-medium text-white">Playful</span></div>
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-200">Target/demo evaluation metrics only — not real production benchmark claims.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
