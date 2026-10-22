import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function AutoCatalogTab({ user, services, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', duration: '', notes: 'Standard parts check' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.price || !form.duration) { setError('Service name, price, duration required.'); return; }
    setLoading(true);
    const svcId = editingId || `REP-${Date.now()}`;
    const row = [svcId, user.clientId, form.name.trim(), String(form.price), String(form.duration), (form.notes.trim() || 'Standard parts check'), 'Auto repair service'];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Service_Packages', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Service_Packages', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete package?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Service_Packages', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Service Packages Catalog</h2><p className="text-slate-400">Configure repair packages, parts notes, and prices.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', price: '', duration: '', notes: 'Standard parts check' }); setModal(true); }} className="px-4 py-2 bg-indigo-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Package</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Service Package</th><th className="p-4">Price ($)</th><th className="p-4">Est. Duration</th><th className="p-4">Parts Notes</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {services.map((s) => (
              <tr key={s.svcId}>
                <td className="p-4 font-mono text-slate-500">{s.svcId}</td>
                <td className="p-4 font-bold text-white">{s.name}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">${s.price}</td>
                <td className="p-4 text-slate-300">{s.duration} Mins</td>
                <td className="p-4 text-slate-400">{s.notes}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(s.svcId); setForm({ name: s.name, price: s.price, duration: s.duration, notes: s.notes }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(s.svcId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Package' : 'Add Package'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Package Name" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" min="0" required value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Price ($)" />
                <input type="number" min="1" required value={form.duration} onChange={(e)=>setForm({...form, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Duration (Mins)" />
              </div>
              <input type="text" value={form.notes} onChange={(e)=>setForm({...form, notes: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Parts Notes" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-indigo-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
