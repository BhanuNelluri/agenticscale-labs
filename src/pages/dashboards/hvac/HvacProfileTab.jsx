import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function HvacProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid notification email.'); return; }
    const cleanSms = profile.dispatchSms.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanSms)) { setError('Invalid dispatch SMS number.'); return; }

    setLoading(true);
    const row = [
      user.clientId, profile.companyName.trim(), profile.zipCodes.trim(), profile.hours.trim(),
      String(profile.calloutFee), String(profile.emergencySurcharge), profile.overtimePolicy.trim(),
      profile.licenseInfo.trim(), profile.email.trim(), cleanSms
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'HVAC_Profiles', row);
      setSuccessMsg('HVAC Profile saved successfully!');
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div><h2 className="text-base font-bold text-white mb-1">HVAC Company Profile & Dispatch Rules</h2><p className="text-slate-400 font-medium">Configure service zips, callout fees, and dispatch rules.</p></div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Company Name</label><input type="text" required value={profile.companyName} onChange={(e)=>setProfile({...profile, companyName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Service Zip Codes</label><input type="text" required value={profile.zipCodes} onChange={(e)=>setProfile({...profile, zipCodes: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="90210, 90211, 90212" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-slate-400 mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Standard Callout Fee ($)</label><input type="number" step="0.01" min="0" required value={profile.calloutFee} onChange={(e)=>setProfile({...profile, calloutFee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Emergency Surcharge ($)</label><input type="number" step="0.01" min="0" required value={profile.emergencySurcharge} onChange={(e)=>setProfile({...profile, emergencySurcharge: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Dispatch SMS Phone Number</label><input type="text" required value={profile.dispatchSms} onChange={(e)=>setProfile({...profile, dispatchSms: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="+12025550143" /></div>
        </div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-amber-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save HVAC Profile"}</button>
      </form>
    </div>
  );
}
