import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { apiUpdateRegistry } from '../services/api';

export default function DeployAgent({ user, setUser }) {
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneDigits, setPhoneDigits] = useState(user?.assignedPhone ? user.assignedPhone.replace(/^\+?[1-9]\d{0,3}/, '') : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeploy = async (e) => {
    e.preventDefault(); setError('');
    const cleanDigits = phoneDigits.trim().replace(/\D/g, '');
    if (!/^\d{7,15}$/.test(cleanDigits)) {
      setError('Please enter valid phone digits (7 to 15 digits).');
      return;
    }

    const fullPhone = countryCode + cleanDigits;
    const agentId = user?.retellAgentId || 'agent_default_v1';

    setLoading(true);
    try {
      const res = await apiUpdateRegistry(user.clientId, user.email, agentId, fullPhone);
      if (res && res.status === 'success') {
        if (setUser) setUser({ ...user, retellAgentId: res.retellAgentId, assignedPhone: res.assignedPhone });
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Failed to save agent configuration.');
      }
    } catch (err) {
      setError('Failed to connect to backend webhook.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl shadow-2xl space-y-6 text-xs">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Deploy Voice Agent Service</h2>
          <p className="text-slate-400">Connect your provisioned Retell AI Agent and phone number to <span className="text-blue-400 font-bold">{user?.businessName}</span></p>
        </div>

        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-medium">{error}</div>}

        <form onSubmit={handleDeploy} className="space-y-4">
          <div>
            <label className="block uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Assigned Retell AI Agent ID (Managed)
            </label>
            <input type="text" readOnly disabled value={user?.retellAgentId || 'agent_default_v1'} className="w-full bg-slate-950/80 border border-slate-800 p-3 rounded-xl font-mono text-slate-400 cursor-not-allowed outline-none select-none" />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-slate-400 font-semibold mb-2">Inbound Phone Number</label>
            <div className="flex gap-2">
              <select value={countryCode} onChange={(e)=>setCountryCode(e.target.value)} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none text-slate-200 font-mono cursor-pointer">
                <option value="+1">+1</option><option value="+44">+44</option><option value="+61">+61</option><option value="+91">+91</option><option value="+49">+49</option>
              </select>
              <input type="text" required value={phoneDigits} onChange={(e)=>setPhoneDigits(e.target.value)} className="flex-1 bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono outline-none focus:border-blue-500" placeholder="2025550143" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold"><ShieldCheck className="w-4 h-4" /> Schema Webhook Ready</div>
            <p className="text-slate-400 font-mono">Target Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
            {loading ? "Saving to Phone Registry..." : <>Deploy Service Live <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
