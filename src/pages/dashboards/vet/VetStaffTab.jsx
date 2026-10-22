import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function VetStaffTab({ user, vets, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', focus: '', calId: '', hours: '08:00-17:00' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.focus.trim() || !form.calId.trim()) { setError('Name, specialty focus, and calendar required.'); return; }
    if (!emailRegex.test(form.calId.trim())) { setError('Enter valid calendar email.'); return; }

    setLoading(true);
    const vetId = editingId || `VET-${Date.now()}`;
    const row = [vetId, user.clientId, form.name.trim(), form.focus.trim(), form.calId.trim(), (form.hours.trim() || '08:00-17:00'), 'ACTIVE'];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Veterinarians_Staff', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Veterinarians_Staff', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete veterinarian?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Veterinarians_Staff', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Veterinarians & Medical Staff</h2><p className="text-slate-400">Manage veterinarians, pet focus areas, and calendars.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', focus: '', calId: '', hours: '08:00-17:00' }); setModal(true); }} className="px-4 py-2 bg-teal-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Veterinarian</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Specialty Focus</th><th className="p-4">Calendar</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {vets.map((v) => (
              <tr key={v.vetId}>
                <td className="p-4 font-mono text-slate-500">{v.vetId}</td>
                <td className="p-4 font-bold text-white">{v.name}</td>
                <td className="p-4 text-slate-300">{v.focus}</td>
                <td className="p-4 font-mono text-teal-400">{v.calId}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(v.vetId); setForm({ name: v.name, focus: v.focus, calId: v.calId, hours: v.hours }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(v.vetId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Veterinarian' : 'Add Veterinarian'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Full Name (DVM)" />
              <input type="text" required value={form.focus} onChange={(e)=>setForm({...form, focus: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Specialty Focus (Feline, Canine, Surgery)" />
              <input type="email" required value={form.calId} onChange={(e)=>setForm({...form, calId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Calendar Email" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-teal-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
