import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function AutoProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid notification email.'); return; }
    const cleanTowing = profile.towingPhone.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanTowing)) { setError('Invalid towing partner phone number.'); return; }

    setLoading(true);
    const row = [
      user.clientId, profile.shopName.trim(), profile.address.trim(), profile.hours.trim(),
      String(profile.laborRate), String(profile.diagnosticFee), cleanTowing,
      profile.email.trim(), profile.personaNotes.trim()
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'Auto_Profiles', row);
      setSuccessMsg('Auto Shop Profile saved successfully!');
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div><h2 className="text-base font-bold text-white mb-1">Auto Shop Profile & Labor Rates</h2><p className="text-slate-400">Configure labor rates, diagnostic fees, and towing partners.</p></div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Auto Shop Name</label><input type="text" required value={profile.shopName} onChange={(e)=>setProfile({...profile, shopName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Physical Address</label><input type="text" required value={profile.address} onChange={(e)=>setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-slate-400 mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Hourly Labor Rate ($)</label><input type="number" step="0.01" min="0" required value={profile.laborRate} onChange={(e)=>setProfile({...profile, laborRate: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Diagnostic Fee ($)</label><input type="number" step="0.01" min="0" required value={profile.diagnosticFee} onChange={(e)=>setProfile({...profile, diagnosticFee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Towing Partner Phone</label><input type="text" required value={profile.towingPhone} onChange={(e)=>setProfile({...profile, towingPhone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="+12025550143" /></div>
          <div><label className="block text-slate-400 mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div><label className="block text-slate-400 mb-1">AI Receptionist Persona Notes</label><input type="text" value={profile.personaNotes} onChange={(e)=>setProfile({...profile, personaNotes: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-indigo-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save Auto Shop Profile"}</button>
      </form>
    </div>
  );
}
