import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function VetProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid email.'); return; }
    const cleanEmergency = profile.emergencyPhone.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanEmergency)) { setError('Invalid emergency phone number.'); return; }

    setLoading(true);
    const row = [
      user.clientId, profile.clinicName.trim(), profile.address.trim(), profile.hours.trim(),
      profile.acceptedPets.trim(), String(profile.examFee), cleanEmergency,
      profile.rabiesRequired, profile.email.trim()
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'Vet_Profiles', row);
      setSuccessMsg('Vet Clinic Profile saved successfully!');
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div><h2 className="text-base font-bold text-white mb-1">Veterinary Clinic Profile & Rules</h2><p className="text-slate-400">Configure accepted pets, exam fees, rabies requirements, and emergency contacts.</p></div>
      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">Vet Clinic Name</label><input type="text" required value={profile.clinicName} onChange={(e)=>setProfile({...profile, clinicName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Address</label><input type="text" required value={profile.address} onChange={(e)=>setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-slate-400 mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
          <div><label className="block text-slate-400 mb-1">Accepted Pets</label><input type="text" value={profile.acceptedPets} onChange={(e)=>setProfile({...profile, acceptedPets: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="Dogs, Cats, Small Animals" /></div>
          <div><label className="block text-slate-400 mb-1">Standard Exam Fee ($)</label><input type="number" step="0.01" min="0" required value={profile.examFee} onChange={(e)=>setProfile({...profile, examFee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 mb-1">After-Hours Emergency Hospital Phone</label><input type="text" required value={profile.emergencyPhone} onChange={(e)=>setProfile({...profile, emergencyPhone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" placeholder="+12025550143" /></div>
          <div><label className="block text-slate-400 mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl" /></div>
        </div>
        <button type="submit" disabled={loading} className="px-6 py-3 bg-teal-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save Vet Profile"}</button>
      </form>
    </div>
  );
}
