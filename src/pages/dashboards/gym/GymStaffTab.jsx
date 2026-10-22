import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function GymStaffTab({ user, trainers, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', expertise: '', calId: '', hours: '06:00-21:00' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.expertise.trim() || !form.calId.trim()) { setError('Name, specialty, and calendar required.'); return; }
    if (!emailRegex.test(form.calId.trim())) { setError('Enter valid calendar email.'); return; }

    setLoading(true);
    const coachId = editingId || `COA-${Date.now()}`;
    const row = [coachId, user.clientId, form.name.trim(), form.expertise.trim(), form.calId.trim(), (form.hours.trim() || '06:00-21:00'), 'ACTIVE'];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Coaches_Trainers', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Coaches_Trainers', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coach?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Coaches_Trainers', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Coaches & Fitness Trainers</h2><p className="text-slate-400">Manage trainers, class specialties, and schedules.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', expertise: '', calId: '', hours: '06:00-21:00' }); setModal(true); }} className="px-4 py-2 bg-emerald-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Coach</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Specialty</th><th className="p-4">Calendar</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {trainers.map((t) => (
              <tr key={t.coachId}>
                <td className="p-4 font-mono text-slate-500">{t.coachId}</td>
                <td className="p-4 font-bold text-white">{t.name}</td>
                <td className="p-4 text-slate-300">{t.expertise}</td>
                <td className="p-4 font-mono text-emerald-400">{t.calId}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(t.coachId); setForm({ name: t.name, expertise: t.expertise, calId: t.calId, hours: t.hours }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(t.coachId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Coach' : 'Add Coach'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Full Name" />
              <input type="text" required value={form.expertise} onChange={(e)=>setForm({...form, expertise: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Specialty Classes (HIIT, Yoga)" />
              <input type="email" required value={form.calId} onChange={(e)=>setForm({...form, calId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Calendar Email" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-emerald-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
