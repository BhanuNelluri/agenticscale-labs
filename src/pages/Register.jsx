import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiRegister } from '../services/api';

export default function Register({ setUser }) {
  const [formData, setFormData] = useState({
    ownerName: '', email: '', password: '', businessName: '', industry: 'Clinics & Healthcare'
  });
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError('Valid email required.'); return; }
    if (formData.password.length < 6) { setError('Password must be at least 6 chars.'); return; }
    const cleanDigits = phoneDigits.trim().replace(/\D/g, '');
    if (!/^\d{7,15}$/.test(cleanDigits)) { setError('Valid phone digits required.'); return; }

    setLoading(true);
    try {
      const res = await apiRegister({ ...formData, email: formData.email.trim().toLowerCase(), phone: countryCode + cleanDigits });
      if (res && res.status === 'success') { setUser(res.user); navigate('/deploy'); }
      else { setError(res?.message || 'Registration failed.'); }
    } catch (err) { setError('Backend connection failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold"><ArrowLeft className="w-4 h-4" /> Back</Link>
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl shadow-2xl">
        <div className="mb-6 text-center"><h2 className="text-2xl font-bold mb-1">Register Admin User</h2><p className="text-slate-400 text-xs">Provision database schema and voice agent</p></div>
        {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-slate-400 font-semibold mb-1">Owner Full Name</label><input type="text" required value={formData.ownerName} onChange={(e)=>setFormData({...formData, ownerName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="John Doe" /></div>
            <div><label className="block text-slate-400 font-semibold mb-1">Admin Email</label><input type="email" required value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="john@clinic.com" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-slate-400 font-semibold mb-1">Password</label><input type="password" required value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="••••••••" /></div>
            <div><label className="block text-slate-400 font-semibold mb-1">Business Name</label><input type="text" required value={formData.businessName} onChange={(e)=>setFormData({...formData, businessName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="BrightSmile Dental" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-slate-400 font-semibold mb-1">Industry Niche</label><select value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 cursor-pointer"><option value="Clinics & Healthcare">Clinics & Healthcare</option><option value="HVAC & Home Services">HVAC & Home Services</option><option value="Salons & MedSpas">Salons & MedSpas</option><option value="Gyms & Fitness Studios">Gyms & Fitness Studios</option><option value="Auto Repair & Detailing">Auto Repair & Detailing</option><option value="Veterinary Clinics">Veterinary Clinics</option><option value="Real Estate & Property Management">Real Estate & Property Management</option></select></div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Business Phone</label>
              <div className="flex gap-2">
                <select value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 font-mono cursor-pointer"><option value="+1">+1</option><option value="+44">+44</option><option value="+61">+61</option><option value="+91">+91</option><option value="+49">+49</option></select>
                <input type="text" required value={phoneDigits} onChange={(e)=>setPhoneDigits(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono" placeholder="2025550143" />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50">{loading ? "Provisioning..." : "Register & Auto-Provision Database"}</button>
        </form>
      </div>
    </div>
  );
}
