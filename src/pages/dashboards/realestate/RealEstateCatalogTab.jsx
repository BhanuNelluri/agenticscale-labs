import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function RealEstateCatalogTab({ user, properties, reload }) {
  const [modal, setModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ address: '', price: '', specs: '', lockbox: 'Lockbox 1234' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault(); setError('');
    if (!form.address.trim() || !form.price || !form.specs) { setError('Address, price, and specs required.'); return; }
    setLoading(true);
    const propId = editingId || `PRP-${Date.now()}`;
    const row = [propId, user.clientId, form.address.trim(), String(form.price), form.specs.trim(), 'AGT-01', (form.lockbox.trim() || 'Lockbox 1234')];

    try {
      if (editingId) await apiUpdateRecord(user.spreadsheetId, 'Property_Listings', editingId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Property_Listings', row);
      await reload(); setModal(false); setEditingId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete property listing?')) return;
    setLoading(true);
    try { await apiDeleteRecord(user.spreadsheetId, 'Property_Listings', id); await reload(); }
    catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Property Listings & Catalog</h2><p className="text-slate-400">Configure property rental/sale prices, specifications, and lockbox access notes.</p></div>
        <button onClick={() => { setEditingId(null); setForm({ address: '', price: '', specs: '', lockbox: 'Lockbox 1234' }); setModal(true); }} className="px-4 py-2 bg-purple-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Property</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Property Address</th><th className="p-4">Price / Rent</th><th className="p-4">Beds/Baths/SQFT</th><th className="p-4">Lockbox / Notes</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {properties.map((p) => (
              <tr key={p.propId}>
                <td className="p-4 font-mono text-slate-500">{p.propId}</td>
                <td className="p-4 font-bold text-white">{p.address}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">{p.price}</td>
                <td className="p-4 text-slate-300">{p.specs}</td>
                <td className="p-4 text-slate-400">{p.lockbox}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingId(p.propId); setForm({ address: p.address, price: p.price, specs: p.specs, lockbox: p.lockbox }); setModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.propId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingId ? 'Edit Property' : 'Add Property'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSave} className="space-y-3">
              <input type="text" required value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Property Address" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required value={form.price} onChange={(e)=>setForm({...form, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Rent or Price (e.g. $2,800/mo)" />
                <input type="text" required value={form.specs} onChange={(e)=>setForm({...form, specs: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Specs (3 Beds | 2 Baths)" />
              </div>
              <input type="text" value={form.lockbox} onChange={(e)=>setForm({...form, lockbox: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Lockbox Access Notes" />
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
