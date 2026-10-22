import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function RealEstateStaffTab({ user, agents, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', license: '', calId: '', hours: '09:00-18:00' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.license.trim() || !form.calId.trim()) { setError('Name, license, and calendar required.'); return; }
    if (!emailRegex.test(form.calId.trim())) { setError('Enter valid calendar email.'); return; }

    setLoading(true);
    const agentId = editingId || `AGT-${Date.now()}`;
    const row = [agentId, user.clientId, form.name.trim(), form.license.trim(), form.calId.trim(), (form.hours.trim() || '09:00-18:00'), 'ACTIVE'];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Agents_LeasingStaff', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Agents_LeasingStaff', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete agent?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Agents_LeasingStaff', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Leasing Agents & Staff</h2><p className="text-slate-400">Manage real estate agents, RE license numbers, and showing calendars.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', license: '', calId: '', hours: '09:00-18:00' }); setModal(true); }} className="px-4 py-2 bg-purple-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Agent</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Agent Name</th><th className="p-4">RE License #</th><th className="p-4">Calendar</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {agents.map((a) => (
              <tr key={a.agentId}>
                <td className="p-4 font-mono text-slate-500">{a.agentId}</td>
                <td className="p-4 font-bold text-white">{a.name}</td>
                <td className="p-4 text-slate-300 font-mono">{a.license}</td>
                <td className="p-4 font-mono text-purple-400">{a.calId}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(a.agentId); setForm({ name: a.name, license: a.license, calId: a.calId, hours: a.hours }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(a.agentId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Agent' : 'Add Agent'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Agent Full Name" />
              <input type="text" required value={form.license} onChange={(e)=>setForm({...form, license: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="RE License Number" />
              <input type="email" required value={form.calId} onChange={(e)=>setForm({...form, calId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Calendar Email" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-purple-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
