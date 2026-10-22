import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function SalonProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid notification email.'); return; }

    setLoading(true);
    const row = [
      user.clientId, profile.spaName.trim(), profile.address.trim(), profile.hours.trim(),
      String(profile.depositRequired), String(profile.cancellationGrace), profile.formsLink.trim(),
      profile.email.trim(), profile.personaNotes.trim()
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'MedSpa_Profiles', row);
      setSuccessMsg('MedSpa Profile saved successfully!');
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div><h2 className="text-base font-bold text-white mb-1">Salon & MedSpa Profile Rules</h2><p className="text-slate-400">Configure spa location, deposits, pre-treatment forms, and AI rules.</p></div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Spa / Salon Name</label><input type="text" required value={profile.spaName} onChange={(e)=>setProfile({...profile, spaName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Physical Address</label><input type="text" required value={profile.address} onChange={(e)=>setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-slate-400 mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Deposit Required ($)</label><input type="number" step="0.01" min="0" required value={profile.depositRequired} onChange={(e)=>setProfile({...profile, depositRequired: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Cancellation Grace (Hrs)</label><input type="number" min="0" required value={profile.cancellationGrace} onChange={(e)=>setProfile({...profile, cancellationGrace: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Pre-Treatment Forms URL</label><input type="text" value={profile.formsLink} onChange={(e)=>setProfile({...profile, formsLink: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="https://spa.com/forms" /></div>
          <div><label className="block text-slate-400 mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div><label className="block text-slate-400 mb-1">AI Receptionist Persona Notes</label><input type="text" value={profile.personaNotes} onChange={(e)=>setProfile({...profile, personaNotes: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-pink-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save MedSpa Profile"}</button>
      </form>
    </div>
  );
}
