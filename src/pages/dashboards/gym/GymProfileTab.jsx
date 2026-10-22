import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function GymProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid email.'); return; }
    const cleanPhone = profile.phone.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanPhone)) { setError('Invalid phone number.'); return; }

    setLoading(true);
    const row = [
      user.clientId, profile.facilityName.trim(), profile.address.trim(), profile.hours.trim(),
      profile.trialPolicy.trim(), profile.ageLimit.trim(), profile.amenities.trim(),
      profile.email.trim(), cleanPhone
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'Gym_Profiles', row);
      setSuccessMsg('Gym Profile saved successfully!');
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div><h2 className="text-base font-bold text-white mb-1">Gym Facility Profile & Rules</h2><p className="text-slate-400">Manage trial passes, age limits, amenities, and front desk contacts.</p></div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Facility Name</label><input type="text" required value={profile.facilityName} onChange={(e)=>setProfile({...profile, facilityName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Address</label><input type="text" required value={profile.address} onChange={(e)=>setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-slate-400 mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Free Trial Pass Policy</label><input type="text" value={profile.trialPolicy} onChange={(e)=>setProfile({...profile, trialPolicy: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Age Limit Rules</label><input type="text" value={profile.ageLimit} onChange={(e)=>setProfile({...profile, ageLimit: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Amenities List</label><input type="text" value={profile.amenities} onChange={(e)=>setProfile({...profile, amenities: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="Pool, Sauna, Turf" /></div>
          <div><label className="block text-slate-400 mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div><label className="block text-slate-400 mb-1">Front Desk Phone Number</label><input type="text" required value={profile.phone} onChange={(e)=>setProfile({...profile, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-emerald-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save Gym Profile"}</button>
      </form>
    </div>
  );
}
