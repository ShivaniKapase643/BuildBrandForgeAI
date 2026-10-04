import { useEffect, useRef, useState } from 'react';
import { Download, ImagePlus, PencilLine, RefreshCcw, Sparkles, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const defaultBrief = 'new sneaker drop, playful tone';

type Variant = {
  variantNumber: number;
  caption: string;
  hashtags: string[];
  visual: string;
  platformVersions: Record<string, { imageUrl: string; aspectRatio: string }>;
  tone: string;
  reasoning: string;
  edited: boolean;
  approved: boolean;
  platform: string;
};

export default function CreateContentPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [brief, setBrief] = useState(defaultBrief);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState(1);
  const [progressIndex, setProgressIndex] = useState(0);
  const steps = ['Analyzing product image', 'Understanding brand tone', 'Generating captions', 'Creating visual variants', 'Optimizing for platforms', 'Preparing final content'];

  useEffect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      setProgressIndex((prev) => (prev + 1) % steps.length);
    }, 800);
    return () => clearInterval(timer);
  }, [loading]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleGenerate = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Please upload a product image before generating content.');
      return;
    }

    setLoading(true);
    setVariants([]);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('brief', brief);
    formData.append('platform', platform);

    try {
      const response = await api.post('/content/generate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setVariants(response.data.content.variants ?? []);
      setSelectedVariant(1);
    } catch (error: any) {
      alert(error?.response?.data?.message ?? 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const updateVariant = (index: number, patch: Partial<Variant>) => {
    setVariants((current) => current.map((item, idx) => idx === index ? { ...item, ...patch, edited: true } : item));
  };

  const approveVariant = async (contentId: string) => {
    if (!contentId) return;
    try {
      await api.post(`/content/${contentId}/approve`);
      setVariants((current) => current.map((variant) => ({ ...variant, approved: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const downloadPackage = async (id: string) => {
    const response = await api.get(`/content/${id}/export`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'brandforge-export.json';
    link.click();
  };

  const generatedContentId = variants[0]?.id ?? 'demo-post';

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.22em] text-brand-gold">Content Studio</div>
          <h1 className="mt-2 text-3xl font-bold text-white">Create content</h1>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="card-glass rounded-3xl p-5">
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-slate-700 bg-slate-950/80 p-6 text-center">
              <ImagePlus size={28} className="text-brand-gold" />
              <div>
                <div className="text-lg font-semibold text-white">Upload product image</div>
                <div className="text-sm text-slate-400">PNG, JPG, WEBP up to 10MB</div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>

            {imagePreview && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700">
                <img src={imagePreview} alt="product preview" className="h-64 w-full object-cover" />
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">One-line brief</label>
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} rows={3} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-300">Platform</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white">
                {['Instagram', 'X', 'LinkedIn'].map((option) => <option key={option}>{option}</option>)}
              </select>
            </div>

            <button disabled={loading} onClick={handleGenerate} className="w-full rounded-xl bg-gradient-to-r from-brand-gold to-brand-blue px-4 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Generating...' : 'Generate variants'}
            </button>
          </div>

          {loading && (
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-3 text-sm uppercase tracking-[0.18em] text-brand-gold">Processing</div>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm">
                    <div className={`h-2.5 w-2.5 rounded-full ${index === progressIndex ? 'bg-brand-gold' : index < progressIndex ? 'bg-green-400' : 'bg-slate-600'}`} />
                    <span className={index === progressIndex ? 'text-white' : 'text-slate-400'}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {variants.length === 0 ? (
            <div className="card-glass flex min-h-[360px] items-center justify-center rounded-3xl p-8 text-center text-slate-400">
              <div>
                <Sparkles className="mx-auto mb-4 text-brand-gold" size={32} />
                Generated variants will appear here after you upload a product image and brief.
              </div>
            </div>
          ) : (
            variants.map((variant) => (
              <div key={variant.variantNumber} className={`card-glass overflow-hidden rounded-3xl border ${selectedVariant === variant.variantNumber ? 'border-brand-gold/60' : 'border-slate-800'}`}>
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 p-4">
                  <div className="font-semibold text-white">Variant {variant.variantNumber}</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedVariant(variant.variantNumber)} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Compare</button>
                    <button onClick={() => updateVariant(variant.variantNumber - 1, { approved: true })} className="rounded-full border border-brand-gold/50 bg-brand-gold/10 px-3 py-1 text-xs text-brand-gold">Approve</button>
                  </div>
                </div>

                <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
                    <img src={variant.visual || imagePreview || 'https://placehold.co/1200x1200/0f172a/f8fafc?text=Brand+Visual'} alt="variant visual" className="h-full w-full object-cover" />
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">Caption</span>
                        <span className="text-xs uppercase tracking-[0.14em] text-brand-gold">{variant.tone}</span>
                      </div>
                      <div>{variant.caption}</div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-white">Hashtags</span>
                        <span className="text-xs text-slate-400">{variant.platform}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-brand-blue">{variant.hashtags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {[PencilLine, RefreshCcw, Download, ClipboardCheck].map((Icon, index) => (
                        <button key={index} className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-brand-gold hover:text-brand-gold">
                          <Icon size={15} />
                          {index === 0 ? 'Edit' : index === 1 ? 'Regenerate' : index === 2 ? 'Download' : 'Approve'}
                        </button>
                      ))}
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                      <div className="mb-2 flex items-center gap-2 text-brand-gold"><CheckCircle2 size={15} /> <span className="font-medium text-white">Reasoning</span></div>
                      <div>{variant.reasoning}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
