import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2, Lock, Edit3 } from 'lucide-react';

export default function ClinicProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(!profile.address);

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneDigits, setPhoneDigits] = useState(profile.smsNumber ? profile.smsNumber.replace(/^\+?[1-9]\d{0,3}/, '') : '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsRegex = /^\d{7,15}$/;

  const handleSaveProfile = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Please enter a valid email.'); return; }
    const cleanDigits = phoneDigits.trim().replace(/\D/g, '');
    if (!digitsRegex.test(cleanDigits)) { setError('Please enter valid phone digits (7-15 digits).'); return; }

    const fullPhone = countryCode + cleanDigits;
    setLoading(true);
    const row = [
      user.clientId, user.businessName, profile.address.trim(), profile.hours.trim(),
      profile.acceptedInsurance.trim(), profile.copayPolicy.trim(), profile.cancellationPolicy.trim(),
      profile.triageRules.trim(), profile.parkingNotes.trim(), profile.email.trim(), fullPhone, profile.personaNotes.trim()
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'Clinic_Profiles', row);
      setProfile({ ...profile, smsNumber: fullPhone });
      setSuccessMsg('Clinic Profile saved & synced to Google Sheets!');
      setIsEditing(false);
    } catch (err) { setError(err?.message || 'Failed to save profile.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white mb-1">Clinic Profile & Receptionist Rules</h2>
          <p className="text-slate-400">Configure practice details & rules for AI call handling.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setSuccessMsg(''); }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-white cursor-pointer transition">
            <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Edit Profile
          </button>
        )}
      </div>

      {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-medium">{error}</div>}
      {successMsg && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center font-medium flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}

      {!isEditing ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Practice Name</span>
            <p className="font-bold text-white text-sm">{user?.businessName}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Physical Address</span>
            <p className="font-semibold text-slate-200">{profile.address || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Operating Hours</span>
            <p className="font-semibold text-slate-200">{profile.hours || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Accepted Insurances</span>
            <p className="font-semibold text-blue-400">{profile.acceptedInsurance || 'Self-pay only'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Payment & Copay Policy</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.copayPolicy || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Cancellation Policy</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.cancellationPolicy || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Emergency Triage Rules</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.triageRules || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Parking & Directions</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.parkingNotes || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Notification Email</span>
            <p className="font-mono text-slate-300">{profile.email || 'None'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Emergency SMS Phone</span>
            <p className="font-mono text-emerald-400 font-semibold">{profile.smsNumber || 'Not configured'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1 col-span-2">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">AI Receptionist Persona Notes</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.personaNotes || 'Not specified'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 font-semibold mb-1 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-400" /> Practice Name (Locked)</label>
            <input type="text" disabled readOnly value={user?.businessName || ''} className="w-full bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-slate-400 cursor-not-allowed outline-none font-semibold" />
          </div>
          <div><label className="block text-slate-400 font-semibold mb-1">Physical Address</label><input type="text" required value={profile.address} onChange={(e) => setProfile({...profile, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="100 Medical Center Way" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 font-semibold mb-1">Operating Hours</label><input type="text" required value={profile.hours} onChange={(e) => setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Mon-Fri 08:00-17:00; Sat Closed; Sun Closed" /><p className="mt-1 text-[10px] text-slate-500">Use 24-hour HH:mm times and day ranges. Saved as entered in the Operating_Hours sheet column.</p></div>
          <div><label className="block text-slate-400 font-semibold mb-1">Accepted Insurance Providers</label><input type="text" required value={profile.acceptedInsurance} onChange={(e) => setProfile({...profile, acceptedInsurance: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Delta Dental, Cigna" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 font-semibold mb-1">Payment & Copay Policy</label><textarea value={profile.copayPolicy} onChange={(e) => setProfile({...profile, copayPolicy: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Payment methods, copays, and billing details" /></div>
          <div><label className="block text-slate-400 font-semibold mb-1">Cancellation Fee Policy</label><textarea value={profile.cancellationPolicy} onChange={(e) => setProfile({...profile, cancellationPolicy: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Notice period and applicable fees" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 font-semibold mb-1">Emergency Triage Rules</label><textarea value={profile.triageRules} onChange={(e) => setProfile({...profile, triageRules: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Escalation guidance for urgent symptoms" /></div>
          <div><label className="block text-slate-400 font-semibold mb-1">Parking & Directions</label><textarea value={profile.parkingNotes} onChange={(e) => setProfile({...profile, parkingNotes: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Parking, entrance, and arrival instructions" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-slate-400 font-semibold mb-1">Notification Email</label><input type="email" required value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="admin@clinic.com" /></div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Emergency SMS Alert Phone</label>
            <div className="flex gap-2">
              <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none text-slate-200 font-mono cursor-pointer">
                <option value="+1">+1 (US)</option><option value="+44">+44 (UK)</option><option value="+61">+61 (AU)</option><option value="+91">+91 (IN)</option><option value="+49">+49 (DE)</option>
              </select>
              <input type="text" required value={phoneDigits} onChange={(e) => setPhoneDigits(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500 font-mono" placeholder="2025550143" />
            </div>
          </div>
        </div>
        <div><label className="block text-slate-400 font-semibold mb-1">AI Receptionist Persona Notes</label><textarea value={profile.personaNotes} onChange={(e) => setProfile({...profile, personaNotes: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-blue-500" placeholder="Tone, call flow, and service guidance" /></div>
        <div className="flex gap-3">
          {profile.address && (
            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-3 bg-slate-800 font-bold rounded-xl text-slate-300 cursor-pointer">Cancel</button>
          )}
          <button type="submit" disabled={loading} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-white shadow-lg shadow-blue-600/25 cursor-pointer disabled:opacity-50">
            {loading ? "Saving Profile..." : "Save Clinic Profile"}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}
