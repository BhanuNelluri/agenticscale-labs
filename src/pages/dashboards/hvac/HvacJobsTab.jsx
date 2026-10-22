import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function HvacJobsTab({ user, jobs, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', price: '', duration: '', description: 'Standard Diagnostic' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.title.trim() || !form.price || !form.duration) { setError('Title, price, duration required.'); return; }
    setLoading(true);
    const jobId = editingId || `JOB-${Date.now()}`;
    const row = [jobId, user.clientId, form.title.trim(), String(form.price), String(form.duration), 'TRUE', (form.description.trim() || 'Standard Diagnostic')];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Jobs_Services', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Jobs_Services', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete job?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Jobs_Services', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Jobs & Services Catalog</h2><p className="text-slate-400">Configure callout prices and duration estimates.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ title: '', price: '', duration: '', description: 'Standard Diagnostic' }); setModal(true); }} className="px-4 py-2 bg-amber-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Job</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Job Title</th><th className="p-4">Callout Price</th><th className="p-4">Est. Duration</th><th className="p-4">Description</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {jobs.map((j) => (
              <tr key={j.jobId}>
                <td className="p-4 font-mono text-slate-500">{j.jobId}</td>
                <td className="p-4 font-bold text-white">{j.title}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">${j.price}</td>
                <td className="p-4 text-slate-300">{j.duration} Mins</td>
                <td className="p-4 text-slate-400">{j.description}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(j.jobId); setForm({ title: j.title, price: j.price, duration: j.duration, description: j.description }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(j.jobId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Job' : 'Add Job'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.title} onChange={(e)=>setForm({...form, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Job Title" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" min="0" required value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Callout Price ($)" />
                <input type="number" min="1" required value={form.duration} onChange={(e)=>setForm({...form, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Duration (Mins)" />
              </div>
              <input type="text" value={form.description} onChange={(e)=>setForm({...form, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Description / Notes" />
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
