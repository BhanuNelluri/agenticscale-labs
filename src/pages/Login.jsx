import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { apiLogin, apiForgotPassword, apiResetPassword } from '../services/api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // 'login' | 'forgot' | 'reset'
  const [mode, setMode] = useState('login');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    setLoading(true);
    try {
      const res = await apiLogin(email.trim().toLowerCase(), password);
      if (res && res.status === 'success' && res.user) {
        setUser(res.user);
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Invalid credentials or account not found.');
      }
    } catch (err) {
      setError('Failed to connect to backend webhook.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const res = await apiForgotPassword(email.trim().toLowerCase());
      if (res && res.status === 'success') {
        setMode('reset');
        setSuccessMsg(res.mockOtp ? `Reset code sent! (Mock: ${res.mockOtp})` : 'Reset code sent to your email.');
      } else {
        setError(res?.message || 'Email not found.');
      }
    } catch (err) {
      setError('Failed to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteReset = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    if (!resetCode.trim() || newPassword.length < 6) {
      setError('Enter 6-digit OTP and new password (min 6 characters).');
      return;
    }
    setLoading(true);
    try {
      const res = await apiResetPassword(email.trim().toLowerCase(), resetCode.trim(), newPassword);
      if (res && res.status === 'success') {
        setSuccessMsg('Password reset successfully! Please sign in with your new password.');
        setTimeout(() => {
          setMode('login');
          setPassword('');
          setNewPassword('');
          setResetCode('');
        }, 2000);
      } else {
        setError(res?.message || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError('Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl text-xs">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-white">{mode === 'login' ? 'Strict Admin Sign In' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}</h2>
          <p className="text-slate-400">{mode === 'login' ? 'Access your secure multi-tenant portal' : 'Enter your email to receive a password reset OTP'}</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-center font-medium">{error}</div>}
        {successMsg && <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-center font-medium flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 pl-10 pr-3 py-3 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder="admin@business.com" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-slate-400 font-semibold">Password</label>
                <button type="button" onClick={()=>{setMode('forgot'); setError(''); setSuccessMsg('');}} className="text-blue-400 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 pl-10 pr-10 py-3 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder="Enter password" />
                {password && (
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white cursor-pointer">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                )}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50">
              {loading ? "Verifying Master Registry..." : "Sign In & Access Portal"}
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleSendResetOtp} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Your Registered Email</label>
              <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder="admin@business.com" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white cursor-pointer disabled:opacity-50">
              {loading ? "Sending Code..." : "Send Password Reset OTP"}
            </button>
            <button type="button" onClick={()=>setMode('login')} className="w-full py-2 bg-transparent text-slate-400 hover:text-white cursor-pointer">Back to Sign In</button>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleExecuteReset} className="space-y-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Enter 6-Digit Verification Code</label>
              <input type="text" maxLength="6" required value={resetCode} onChange={(e)=>setResetCode(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono text-center tracking-widest text-sm outline-none focus:border-blue-500" placeholder="123456" />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">New Password</label>
              <div className="relative">
                <input type={showNewPassword ? "text" : "password"} required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 pr-10 rounded-xl font-mono outline-none focus:border-blue-500" placeholder="Enter new password" />
                {newPassword && (
                  <button type="button" onClick={()=>setShowNewPassword(!showNewPassword)} className="absolute right-3.5 top-3.5 text-slate-500 hover:text-white cursor-pointer">{showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                )}
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white cursor-pointer disabled:opacity-50">
              {loading ? "Updating..." : "Reset Password & Login"}
            </button>
            <button type="button" onClick={()=>setMode('login')} className="w-full py-2 bg-transparent text-slate-400 hover:text-white cursor-pointer">Back to Sign In</button>
          </form>
        )}

        {mode === 'login' && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Need an account? <Link to="/register" className="text-blue-400 hover:underline font-semibold">Register admin user</Link>
          </p>
        )}
      </div>
    </div>
  );
}
