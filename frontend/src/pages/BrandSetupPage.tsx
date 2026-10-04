import { useEffect, useState } from 'react';
import api from '../services/api';

const defaultBrand = {
  brandName: 'Northstar Studio',
  brandDescription: 'Modern lifestyle brand for creators and explorers.',
  targetAudience: 'Gen Z creators and design-conscious professionals',
  brandTone: 'Playful',
  brandColors: ['#F4C95D', '#1E3A8A', '#0A0A0A'],
  preferredLanguage: 'English',
  preferredContentStyle: 'Clean, premium, scroll-stopping',
  platforms: ['Instagram', 'X', 'LinkedIn'],
};

export default function BrandSetupPage() {
  const [brand, setBrand] = useState(defaultBrand);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/brand');
        if (response.data.brand) setBrand(response.data.brand);
      } catch (error) {
        console.error(error);
      }
    };
    void load();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/brand', brand);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="text-sm uppercase tracking-[0.22em] text-brand-gold">Brand Identity</div>
        <h1 className="mt-2 text-3xl font-bold text-white">Brand setup</h1>
      </div>

      <form onSubmit={handleSubmit} className="card-glass rounded-3xl p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Brand name</label>
            <input value={brand.brandName} onChange={(e) => setBrand({ ...brand, brandName: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Brand tone</label>
            <select value={brand.brandTone} onChange={(e) => setBrand({ ...brand, brandTone: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">
              {['Professional', 'Friendly', 'Playful', 'Premium', 'Minimal', 'Bold', 'Inspirational'].map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Brand description</label>
            <textarea value={brand.brandDescription} onChange={(e) => setBrand({ ...brand, brandDescription: e.target.value })} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Target audience</label>
            <input value={brand.targetAudience} onChange={(e) => setBrand({ ...brand, targetAudience: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Preferred language</label>
            <input value={brand.preferredLanguage} onChange={(e) => setBrand({ ...brand, preferredLanguage: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Preferred content style</label>
            <input value={brand.preferredContentStyle} onChange={(e) => setBrand({ ...brand, preferredContentStyle: e.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Brand colors</label>
            <input value={brand.brandColors.join(', ')} onChange={(e) => setBrand({ ...brand, brandColors: e.target.value.split(',').map((value) => value.trim()) })} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm text-slate-300">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {['Instagram', 'X', 'LinkedIn'].map((platform) => {
                const checked = brand.platforms.includes(platform);
                return (
                  <button type="button" key={platform} onClick={() => setBrand({ ...brand, platforms: checked ? brand.platforms.filter((item) => item !== platform) : [...brand.platforms, platform] })} className={`rounded-full border px-4 py-2 text-sm ${checked ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-slate-700 text-slate-300'}`}>
                    {platform}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-slate-400">{saved ? 'Saved successfully.' : 'Brand settings are used automatically for content generation.'}</div>
          <button type="submit" className="rounded-xl bg-gradient-to-r from-brand-gold to-brand-blue px-5 py-3 font-semibold text-slate-950">Save brand</button>
        </div>
      </form>
    </div>
  );
}
