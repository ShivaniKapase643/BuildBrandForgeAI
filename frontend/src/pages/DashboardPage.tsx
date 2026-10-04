import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import api from '../services/api';

export default function DashboardPage() {
  const [brand, setBrand] = useState<any>(null);
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [brandRes, contentRes] = await Promise.all([
          api.get('/brand'),
          api.get('/content'),
        ]);
        setBrand(brandRes.data.brand);
        setContent(contentRes.data.content ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    void load();
  }, []);

  const totalPosts = content.length;
  const approvedPosts = content.filter((item) => item.status === 'APPROVED').length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.22em] text-brand-gold">Overview</div>
          <h1 className="mt-2 text-3xl font-bold text-white">Dashboard</h1>
        </div>
        <Link to="/app/content" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-blue px-4 py-3 font-semibold text-slate-950">
          Create Content <ArrowRight size={18} />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-glass rounded-2xl p-5">
          <div className="text-sm text-slate-400">Total posts generated</div>
          <div className="mt-3 text-3xl font-bold text-white">{totalPosts}</div>
        </div>
        <div className="card-glass rounded-2xl p-5">
          <div className="text-sm text-slate-400">Approved posts</div>
          <div className="mt-3 text-3xl font-bold text-white">{approvedPosts}</div>
        </div>
        <div className="card-glass rounded-2xl p-5">
          <div className="text-sm text-slate-400">Current brand profile</div>
          <div className="mt-3 text-lg font-semibold text-white">{brand?.brandName ?? 'Northstar Studio'}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card-glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2 text-brand-gold"><TrendingUp size={18} /> <span className="font-medium">Recent content</span></div>
          <div className="space-y-4">
            {content.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 p-6 text-slate-400">No content has been generated yet.</div>
            ) : (
              content.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                  <div>
                    <div className="font-semibold text-white">{item.brief}</div>
                    <div className="mt-1 text-sm text-slate-400">{item.status} • {new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300">{item.variants?.length ?? 0} variants</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2 text-brand-gold"><Sparkles size={18} /> <span className="font-medium">Brand profile</span></div>
          <div className="space-y-3 text-sm text-slate-300">
            <div><span className="text-slate-500">Brand:</span> {brand?.brandName ?? 'Northstar Studio'}</div>
            <div><span className="text-slate-500">Tone:</span> {brand?.brandTone ?? 'Playful'}</div>
            <div><span className="text-slate-500">Audience:</span> {brand?.targetAudience ?? 'Creators and design lovers'}</div>
            <div className="flex gap-2 pt-2">
              {(brand?.brandColors ?? ['#F4C95D', '#1E3A8A', '#0A0A0A']).map((color: string) => (
                <span key={color} className="h-8 w-8 rounded-full border border-slate-700" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-brand-gold/30 bg-brand-gold/10 p-4 text-sm text-brand-gold">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Brand consistency: enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
