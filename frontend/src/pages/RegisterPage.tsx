import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('Demo Creator');
  const [email, setEmail] = useState('demo@brandforge.ai');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      await register(name, email, password);
      navigate('/app');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-glow">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold to-brand-blue font-black text-slate-950">B</div>
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-brand-gold">BrandForge</div>
            <div className="text-xl font-bold text-white">AI Studio</div>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-white">Create your account</h1>
        <p className="mb-6 text-sm text-slate-400">Set up your brand profile and generate your first content system.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-brand-gold" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-brand-gold" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-slate-100 outline-none transition focus:border-brand-gold" />
          </div>
          {error && <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</div>}

          <button className="w-full rounded-xl bg-gradient-to-r from-brand-gold to-brand-blue px-4 py-3 font-semibold text-slate-950 transition hover:opacity-95">
            Sign up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-gold">Login</Link>
        </div>
      </div>
    </div>
  );
}
