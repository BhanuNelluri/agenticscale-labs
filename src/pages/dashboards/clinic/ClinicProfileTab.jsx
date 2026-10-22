import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2 } from 'lucide-react';

export default function ClinicProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');

    if (!emailRegex.test(profile.email)) {
      setError('Please enter a valid notification email.');
      return;
    }
    const cleanSms = profile.smsNumber.replace(/[\s()-]/g, '');
    if (!phoneRegex.test(cleanSms)) {
      setError('Please enter a valid emergency SMS phone number.');
      return;
    }

    setLoading(true);
    const row = [
      user.clientId,
      profile.clinicName.trim(),
      profile.address.trim(),
      profile.hours.trim(),
      profile.acceptedInsurance.trim(),
      profile.copayPolicy.trim(),
      profile.cancellationPolicy.trim(),
      profile.triageRules.trim(),
      profile.parkingNotes.trim(),
      profile.email.trim(),
      cleanSms,
      profile.personaNotes.trim()
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'Clinic_Profiles', row);
      setSuccessMsg('Clinic Profile updated & synced to Google Sheets!');
    } catch (err) {
      setError(err?.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div>
        <h2 className="text-base font-bold text-white mb-1">Clinic Profile & Receptionist Rules</h2>
        <p className="text-slate-400">Configure business details & rules for AI call handling.</p>
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-medium">{error}</div>}
      {successMsg && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-medium flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}

      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Clinic / Practice Name</label>
            <input type="text" required value={profile.clinicName} onChange={(e) => setProfile({...profile, clinicName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Physical Address</label>
            <input type="text" required value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Operating Hours</label>
            <input type="text" required value={profile.hours} onChange={(e) => setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Accepted Insurance Providers</label>
            <input type="text" required value={profile.acceptedInsurance} onChange={(e) => setProfile({...profile, acceptedInsurance: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Notification Email</label>
            <input type="email" required value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Emergency SMS Alert Phone</label>
            <input type="text" required value={profile.smsNumber} onChange={(e) => setProfile({...profile, smsNumber: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50">
          {loading ? "Saving Profile..." : "Save Clinic Profile"}
        </button>
      </form>
    </div>
  );
}
