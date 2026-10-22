import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function GymCatalogTab({ user, plans, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', fee: '', term: '', benefits: 'Full gym access' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.name.trim() || !form.fee || !form.term) { setError('Plan name, monthly fee, and term required.'); return; }
    setLoading(true);
    const planId = editingId || `PLN-${Date.now()}`;
    const row = [planId, user.clientId, form.name.trim(), String(form.fee), '0', String(form.term), (form.benefits.trim() || 'Full gym access')];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Membership_Plans', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Membership_Plans', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete plan?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Membership_Plans', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Membership Plans & Tiers</h2><p className="text-slate-400">Configure monthly fees, contract terms, and member benefits.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ name: '', fee: '', term: '', benefits: 'Full gym access' }); setModal(true); }} className="px-4 py-2 bg-emerald-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Plan</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Plan Name</th><th className="p-4">Monthly Fee ($)</th><th className="p-4">Term (Months)</th><th className="p-4">Benefits Included</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {plans.map((p) => (
              <tr key={p.planId}>
                <td className="p-4 font-mono text-slate-500">{p.planId}</td>
                <td className="p-4 font-bold text-white">{p.name}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">${p.fee}</td>
                <td className="p-4 text-slate-300">{p.term} Months</td>
                <td className="p-4 text-slate-400">{p.benefits}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(p.planId); setForm({ name: p.name, fee: p.fee, term: p.term, benefits: p.benefits }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.planId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Plan' : 'Add Plan'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Plan Name" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" min="0" required value={form.fee} onChange={(e)=>setForm({...form, fee: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Monthly Fee ($)" />
                <input type="number" min="0" required value={form.term} onChange={(e)=>setForm({...form, term: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Term (Months)" />
              </div>
              <input type="text" value={form.benefits} onChange={(e)=>setForm({...form, benefits: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Benefits Included" />
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
