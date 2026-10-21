import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import { apiUpdateRegistry } from '../services/api';

export default function DeployAgent({ user, setUser }) {
  const [retellAgentId, setRetellAgentId] = useState(user?.retellAgentId || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.assignedPhone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeploy = async (e) => {
    e.preventDefault();
    setError('');

    const agentId = retellAgentId.trim();
    const phone = phoneNumber.trim();
    if (!agentId || !phone) {
      setError('Retell Agent ID and inbound phone number are both required.');
      return;
    }

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
          <p className="text-slate-400 text-xs">Connect your Retell AI Voice Agent and phone number to <span className="text-blue-400 font-bold">{user?.businessName}</span></p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleDeploy} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-slate-400 font-semibold mb-2">Retell AI Agent ID</label>
            <input type="text" required value={retellAgentId} onChange={(e) => setRetellAgentId(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono outline-none" placeholder="agent_38fbc9102c..." />
          </div>
          <div>
            <label className="block uppercase tracking-wider text-slate-400 font-semibold mb-2">Inbound Phone Number</label>
            <input type="text" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl font-mono outline-none" placeholder="+1 (415) 888-9921" />
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
