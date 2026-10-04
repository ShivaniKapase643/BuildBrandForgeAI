export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="text-sm uppercase tracking-[0.22em] text-brand-gold">Settings</div>
        <h1 className="mt-2 text-3xl font-bold text-white">Workspace settings</h1>
      </div>

      <div className="card-glass rounded-3xl p-6">
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span>Demo mode</span>
            <span className="rounded-full bg-brand-gold/10 px-2 py-1 text-brand-gold">Enabled</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span>AI provider fallback</span>
            <span className="text-white">Local demo generation</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <span>Upload validation</span>
            <span className="text-white">JPG / PNG / WEBP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
