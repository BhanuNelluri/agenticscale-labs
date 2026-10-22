import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function HvacStaffTab({ user, techs, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', certs: '', vehicleId: 'VEH-01', calId: '', hours: '24/7' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.certs.trim() || !form.calId.trim()) {
      setError('Name, certs, and calendar email required.'); return;
    }
    if (!emailRegex.test(form.calId.trim())) { setError('Enter valid calendar email.'); return; }

    setLoading(true);
    const techId = editingId || `TCH-${Date.now()}`;
    const row = [techId, user.clientId, form.name.trim(), form.certs.trim(), (form.vehicleId.trim() || 'VEH-01'), form.calId.trim(), (form.hours.trim() || '24/7'), 'ACTIVE'];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Technicians', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Technicians', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete technician?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Technicians', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Technicians & Dispatch Roster</h2><p className="text-slate-400">Manage field technicians, vehicle IDs, and calendars.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', certs: '', vehicleId: 'VEH-01', calId: '', hours: '24/7' }); setModal(true); }} className="px-4 py-2 bg-amber-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Technician</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Certifications</th><th className="p-4">Vehicle</th><th className="p-4">Calendar</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {techs.map((t) => (
              <tr key={t.techId}>
                <td className="p-4 font-mono text-slate-500">{t.techId}</td>
                <td className="p-4 font-bold text-white">{t.name}</td>
                <td className="p-4 text-slate-300">{t.certs}</td>
                <td className="p-4 text-slate-400">{t.vehicleId}</td>
                <td className="p-4 font-mono text-amber-400">{t.calId}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(t.techId); setForm({ name: t.name, certs: t.certs, vehicleId: t.vehicleId, calId: t.calId, hours: t.hours }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(t.techId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Technician' : 'Add Technician'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Full Name" />
              <input type="text" required value={form.certs} onChange={(e)=>setForm({...form, certs: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Certifications (e.g. Master Tech)" />
              <input type="text" value={form.vehicleId} onChange={(e)=>setForm({...form, vehicleId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Vehicle ID" />
              <input type="email" required value={form.calId} onChange={(e)=>setForm({...form, calId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Calendar Email" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-amber-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
