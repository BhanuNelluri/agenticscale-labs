import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { apiRegister, apiSendOtp, apiVerifyOtp } from '../services/api';

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    ownerName: '', email: '', password: '', businessName: '', industry: 'Clinics & Healthcare'
  });
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError(''); setSuccessMsg('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Please enter a valid email address first.'); return; }
    setLoading(true);
    try {
      const res = await apiSendOtp(formData.email.trim().toLowerCase());
      if (res && res.status === 'success') {
        setOtpSent(true);
        setSuccessMsg('Verification code sent to your email.');
      } else { setError(res?.message || 'Failed to send OTP.'); }
    } catch (err) { setError('Failed to connect to backend.'); } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    setError(''); setSuccessMsg('');
    if (!otpCode.trim()) { setError('Please enter the 6-digit code.'); return; }
    setLoading(true);
    try {
      const res = await apiVerifyOtp(formData.email.trim().toLowerCase(), otpCode.trim());
      if (res && res.status === 'success') {
        setOtpVerified(true);
        setSuccessMsg('Email verified successfully!');
      } else { setError(res?.message || 'Invalid code.'); }
    } catch (err) { setError('Verification failed.'); } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!otpVerified) { setError('Please verify your email with OTP before registering.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    const cleanDigits = phoneDigits.trim().replace(/\D/g, '');
    if (!/^\d{7,15}$/.test(cleanDigits)) { setError('Please enter a valid phone number (7-15 digits).'); return; }

    setLoading(true);
    try {
      const res = await apiRegister({ ...formData, email: formData.email.trim().toLowerCase(), phone: countryCode + cleanDigits });
      if (res && res.status === 'success') { setUser(res.user); navigate('/deploy'); }
      else { setError(res?.message || 'Registration failed. Check Apps Script logs.'); }
    } catch (err) {
      setError('Failed to connect to backend webhook.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl shadow-2xl text-xs">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-1 text-white">Register Admin User</h2>
          <p className="text-slate-400">Set up your multi-tenant voice AI platform account</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-center font-medium">{error}</div>}
        {successMsg && <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-center font-medium flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Owner Full Name</label>
              <input type="text" required value={formData.ownerName} onChange={(e)=>setFormData({...formData, ownerName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Admin Email</label>
              <div className="flex gap-2">
                <input type="email" required disabled={otpVerified} value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500 font-mono disabled:opacity-50" placeholder="admin@business.com" />
                {!otpVerified && <button type="button" onClick={handleSendOtp} disabled={loading} className="px-3 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-slate-200 cursor-pointer">{otpSent ? "Resend" : "Send OTP"}</button>}
              </div>
            </div>
          </div>

          {otpSent && !otpVerified && (
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <label className="block text-slate-400 font-semibold">Enter 6-Digit Email Verification Code</label>
              <div className="flex gap-2">
                <input type="text" maxLength="6" value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} className="flex-1 bg-slate-900 border border-slate-800 p-2.5 rounded-xl font-mono text-center tracking-widest text-sm outline-none focus:border-blue-500" placeholder="123456" />
                <button type="button" onClick={handleVerifyOtp} disabled={loading} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-white cursor-pointer">Verify</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 pr-10 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder="Enter password" />
                {formData.password && (
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-500 hover:text-white cursor-pointer">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Name</label>
              <input type="text" required value={formData.businessName} onChange={(e)=>setFormData({...formData, businessName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="BrightSmile Dental" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Industry Niche</label>
              <select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 outline-none cursor-pointer">
                <option value="Clinics & Healthcare">Clinics & Healthcare</option>
                <option value="HVAC & Home Services">HVAC & Home Services</option>
                <option value="Salons & MedSpas">Salons & MedSpas</option>
                <option value="Gyms & Fitness Studios">Gyms & Fitness Studios</option>
                <option value="Auto Repair & Detailing">Auto Repair & Detailing</option>
                <option value="Veterinary Clinics">Veterinary Clinics</option>
                <option value="Real Estate & Property Management">Real Estate & Property Management</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Phone</label>
              <div className="flex min-w-0 gap-2">
                <select value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className="shrink-0 bg-slate-950 border border-slate-800 px-2 py-3 rounded-xl text-slate-200 font-mono cursor-pointer outline-none">
                  <option value="+1">+1 (US)</option><option value="+44">+44 (UK)</option><option value="+61">+61 (AU)</option><option value="+91">+91 (IN)</option><option value="+49">+49 (DE)</option>
                </select>
                <input type="text" required value={phoneDigits} onChange={(e)=>setPhoneDigits(e.target.value)} className="min-w-0 w-full flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono outline-none focus:border-blue-500" placeholder="2025550143" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading || !otpVerified} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50">
            {loading ? "Provisioning Database..." : otpVerified ? "Register & Auto-Provision Database" : "Verify Email with OTP to Register"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-5">Already have an account? <Link to="/login" className="text-blue-400 hover:underline font-semibold">Sign In</Link></p>
      </div>
    </div>
  );
}