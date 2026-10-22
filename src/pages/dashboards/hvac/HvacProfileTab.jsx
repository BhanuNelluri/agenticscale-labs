import React, { useState } from 'react';
import { apiSaveProfile } from '../../../services/api';
import { CheckCircle2, Lock, Edit3 } from 'lucide-react';

export default function HvacProfileTab({ user, profile, setProfile }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isEditing, setIsEditing] = useState(!profile.zipCodes);

  const [countryCode, setCountryCode] = useState('+1');
  const [phoneDigits, setPhoneDigits] = useState(profile.dispatchSms ? profile.dispatchSms.replace(/^\+?[1-9]\d{0,3}/, '') : '');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsRegex = /^\d{7,15}$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError(''); setSuccessMsg('');
    if (!emailRegex.test(profile.email)) { setError('Invalid notification email.'); return; }
    const cleanDigits = phoneDigits.trim().replace(/\D/g, '');
    if (!digitsRegex.test(cleanDigits)) { setError('Invalid dispatch SMS phone digits (7-15 digits).'); return; }

    const fullPhone = countryCode + cleanDigits;
    setLoading(true);
    const row = [
      user.clientId, user.businessName, profile.zipCodes.trim(), profile.hours.trim(),
      String(profile.calloutFee || '0'), String(profile.emergencySurcharge || '0'), profile.overtimePolicy.trim(),
      profile.licenseInfo.trim(), profile.email.trim(), fullPhone
    ];

    try {
      await apiSaveProfile(user.spreadsheetId, 'HVAC_Profiles', row);
      setProfile({ ...profile, dispatchSms: fullPhone });
      setSuccessMsg('HVAC Company Profile saved successfully!');
      setIsEditing(false);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-6 max-w-4xl text-xs">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white mb-1">HVAC Company Profile & Dispatch Rules</h2>
          <p className="text-slate-400">Configure service zips, callout fees, and dispatch rules.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setSuccessMsg(''); }} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 font-bold rounded-xl text-white cursor-pointer transition">
            <Edit3 className="w-3.5 h-3.5 text-amber-400" /> Edit Profile
          </button>
        )}
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">{error}</div>}
      {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> {successMsg}</div>}

      {!isEditing ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Company Name</span>
            <p className="font-bold text-white text-sm">{user?.businessName}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Service Zip Codes</span>
            <p className="font-semibold text-slate-200">{profile.zipCodes || 'None specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Operating Hours</span>
            <p className="font-semibold text-slate-200">{profile.hours || '24/7'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Callout & Surcharges</span>
            <p className="font-mono text-amber-400 font-bold">${profile.calloutFee || 0} base / ${profile.emergencySurcharge || 0} emergency</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Overtime Hours Policy</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.overtimePolicy || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">License & Insurance Information</span>
            <p className="font-semibold text-slate-200 whitespace-pre-wrap">{profile.licenseInfo || 'Not specified'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Notification Email</span>
            <p className="font-mono text-slate-300">{profile.email || 'None'}</p>
          </div>
          <div className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Dispatch SMS Phone</span>
            <p className="font-mono text-emerald-400 font-semibold">{profile.dispatchSms || 'Not configured'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-amber-400" /> Company Name (Locked)</label>
              <input type="text" disabled readOnly value={user?.businessName || ''} className="w-full bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-slate-400 cursor-not-allowed outline-none font-semibold" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Service Zip Codes</label>
              <input type="text" required value={profile.zipCodes} onChange={(e)=>setProfile({...profile, zipCodes: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="e.g. 90210, 90211, 90212" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Operating Hours</label>
              <input type="text" required value={profile.hours} onChange={(e)=>setProfile({...profile, hours: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="e.g. 24/7 Emergency Dispatch" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Standard Callout Fee ($)</label>
              <input type="number" step="0.01" min="0" required value={profile.calloutFee} onChange={(e)=>setProfile({...profile, calloutFee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="e.g. 99" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Emergency Surcharge ($)</label>
              <input type="number" step="0.01" min="0" required value={profile.emergencySurcharge} onChange={(e)=>setProfile({...profile, emergencySurcharge: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="e.g. 150" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Overtime Hours Policy</label>
              <textarea value={profile.overtimePolicy} onChange={(e)=>setProfile({...profile, overtimePolicy: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="After-hours and overtime rates or rules" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">License & Insurance Information</label>
              <textarea value={profile.licenseInfo} onChange={(e)=>setProfile({...profile, licenseInfo: e.target.value})} className="w-full min-h-24 bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="License numbers and coverage details" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Notification Email</label>
              <input type="email" required value={profile.email} onChange={(e)=>setProfile({...profile, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none focus:border-amber-500" placeholder="dispatch@hvac.com" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Dispatch SMS Phone Number</label>
              <div className="flex gap-2">
                <select value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-200 font-mono cursor-pointer outline-none">
                  <option value="+1">+1 (US)</option><option value="+44">+44 (UK)</option><option value="+61">+61 (AU)</option><option value="+91">+91 (IN)</option><option value="+49">+49 (DE)</option>
                </select>
                <input type="text" required value={phoneDigits} onChange={(e)=>setPhoneDigits(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono outline-none focus:border-amber-500" placeholder="2025550143" />
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            {profile.zipCodes && (
              <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-3 bg-slate-800 font-bold rounded-xl text-slate-300 cursor-pointer">Cancel</button>
            )}
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 font-bold rounded-xl text-white cursor-pointer disabled:opacity-50">
              {loading ? "Saving..." : "Save HVAC Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
