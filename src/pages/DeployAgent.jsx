import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, ArrowRight, Lock } from 'lucide-react';
import { apiUpdateRegistry } from '../services/api';

export default function DeployAgent({ user, setUser }) {
  const [phoneNumber, setPhoneNumber] = useState(user?.assignedPhone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  const handleDeploy = async (e) => {
    e.preventDefault();
    setError('');

    const phone = phoneNumber.trim().replace(/[\s()-]/g, '');
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number with country code (e.g., +12025550143).');
      return;
    }

    // Agent ID is managed automatically based on industry niche
    const agentId = user?.retellAgentId || 'agent_default_v1';

    setLoading(true);
    try {
      const res = await apiUpdateRegistry(user.clientId, user.email, agentId, phone);

      if (res && res.status === 'success') {
        if (setUser) {
          setUser({ ...user, retellAgentId: res.retellAgentId, assignedPhone: res.assignedPhone });
        }
        navigate('/dashboard');
      } else {
        setError(res?.message || 'Failed to save agent configuration.');
      }
    } catch (err) {
      console.error("Deploy API Exception:", err);
      setError('Failed to connect to backend webhook. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-blue-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Deploy Voice Agent Service</h2>
          <p className="text-slate-400 text-xs">Connect your provisioned Retell AI Voice Agent and phone number to <span className="text-blue-400 font-bold">{user?.businessName}</span></p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleDeploy} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Assigned Retell AI Agent ID (Managed)
            </label>
            <input 
              type="text" 
              readOnly
              disabled 
              value={user?.retellAgentId || 'agent_default_v1'} 
              className="w-full bg-slate-950/80 border border-slate-800 p-3 rounded-xl font-mono text-slate-400 cursor-not-allowed outline-none select-none" 
            />
            <p className="text-[11px] text-slate-500 mt-1">Automatically provisioned for <span className="text-slate-300 font-semibold">{user?.industry || 'your industry'}</span> and cannot be edited by the user.</p>
          </div>
          <div>
            <label className="block uppercase tracking-wider text-slate-400 font-semibold mb-2">Inbound Phone Number</label>
            <input 
              type="text" 
              required 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono outline-none focus:border-blue-500" 
              placeholder="+12025550143" 
            />
            <p className="text-[11px] text-slate-500 mt-1">Enter your assigned phone number in E.164 format (e.g. +12025550143).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Schema Webhook Ready
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Target Spreadsheet ID: <span className="font-mono text-slate-200">{user?.spreadsheetId}</span>
            </p>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-500 font-bold text-sm rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
            {loading ? "Saving to Phone Registry..." : <>Deploy Service Live <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
