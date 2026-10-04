import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ContentLibraryPage() {
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/content');
        setContent(response.data.content ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    void load();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="text-sm uppercase tracking-[0.22em] text-brand-gold">Library</div>
        <h1 className="mt-2 text-3xl font-bold text-white">Content library</h1>
      </div>

      <div className="card-glass rounded-3xl p-6">
        <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-300">
          <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"><option>Platform</option><option>Instagram</option><option>X</option><option>LinkedIn</option></select>
          <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"><option>Status</option><option>Approved</option><option>Draft</option></select>
          <select className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2"><option>Date</option></select>
        </div>

        <div className="space-y-4">
          {content.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 p-6 text-slate-400">No previously generated content yet.</div>
          ) : (
            content.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                <div>
                  <div className="text-lg font-semibold text-white">{item.brief}</div>
                  <div className="mt-1 text-sm text-slate-400">{item.status} • {new Date(item.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">View</button>
                  <button className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">Duplicate</button>
                  <button className="rounded-lg border border-brand-gold/60 bg-brand-gold/10 px-3 py-2 text-sm text-brand-gold">Download</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
