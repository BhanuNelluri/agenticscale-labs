import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { apiLogin } from '../services/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiLogin(email.trim().toLowerCase(), password);

      if (res && res.status === 'success' && res.user) {
        setUser(res.user);
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Invalid credentials or account not found. Please register.');
      }
    } catch (err) {
      console.error("Login API Exception:", err);
      setError('Failed to connect to backend webhook. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Strict Admin Sign In</h2>
          <p className="text-slate-400 text-xs">Verify your master database record to access your tenant dashboard</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" placeholder="admin@business.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 pl-11 pr-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50">
            {loading ? "Verifying Master Registry..." : "Sign In & Access Portal"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need an account? <Link to="/register" className="text-blue-400 hover:underline font-semibold">Register admin user</Link>
        </p>
      </div>
    </div>
  );
}
