import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function RealEstateProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid email.'); return; }
    const cleanPhone = profile.maintenancePhone.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanPhone)) { setError('Invalid maintenance phone number.'); return; }

    setLoading(true);
    const row = [
      user.clientId, profile.brokerageName.trim(), profile.address.trim(), profile.hours.trim(),
      String(profile.appFee), profile.petPolicy.trim(), cleanPhone,
      profile.email.trim(), profile.portalLink.trim()
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'RealEstate_Profiles', row);
      setSuccessMsg('Real Estate Profile saved successfully!');
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div><h2 className="text-base font-bold text-white mb-1">Brokerage & Property Management Profile</h2><p className="text-slate-400">Configure application fees, pet policies, and emergency maintenance lines.</p></div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Brokerage / Company Name</label><input type="text" required value={profile.brokerageName} onChange={(e)=>setProfile({...profile, brokerageName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Office Address</label><input type="text" required value={profile.address} onChange={(e)=>setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-slate-400 mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Application Fee ($)</label><input type="number" step="0.01" min="0" required value={profile.appFee} onChange={(e)=>setProfile({...profile, appFee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Pet Policy Rules</label><input type="text" value={profile.petPolicy} onChange={(e)=>setProfile({...profile, petPolicy: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="Pets under 25 lbs" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Maintenance Emergency Phone</label><input type="text" required value={profile.maintenancePhone} onChange={(e)=>setProfile({...profile, maintenancePhone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="+12025550143" /></div>
          <div><label className="block text-slate-400 mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div><label className="block text-slate-400 mb-1">Tenant Application Portal Link</label><input type="text" value={profile.portalLink} onChange={(e)=>setProfile({...profile, portalLink: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="https://realty.com/apply" /></div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-purple-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save Real Estate Profile"}</button>
      </form>
    </div>
  );
}
