import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function ClinicCatalogTab({ user, services, reload }) {
  const [svcModal, setSvcModal] = useState(false);
  const [editingSvcId, setEditingSvcId] = useState(null);
  const [svcForm, setSvcForm] = useState({ name: '', price: '', duration: '', instructions: '', insuranceCovered: 'TRUE', description: 'Standard Treatment' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSaveService = async (e) => {
    e.preventDefault(); setError('');
    if (!svcForm.name.trim() || !svcForm.price || !svcForm.duration) {
      setError('Name, price, and duration are required.'); return;
    }
    setLoading(true);
    const svcId = editingSvcId || `SVC-${Date.now()}`;
    const row = [
      svcId, user.clientId, svcForm.name.trim(), String(svcForm.price), String(svcForm.duration),
      (svcForm.instructions.trim() || 'None'), 'ALL', svcForm.insuranceCovered, (svcForm.description.trim() || 'Standard Treatment')
    ];

    try {
      if (editingSvcId) await apiUpdateRecord(user.spreadsheetId, 'Services_Catalog', editingSvcId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Services_Catalog', row);
      await reload(); setSvcModal(false); setEditingSvcId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDeleteService = async (svcId) => {
    if (!window.confirm('Delete service?')) return;
    setLoading(true);
    try {
      await apiDeleteRecord(user.spreadsheetId, 'Services_Catalog', svcId); await reload();
    } catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Services Catalog</h2><p className="text-slate-400">Define procedure prices, durations, and instructions.</p></div>
        <button onClick={() => { setEditingSvcId(null); setSvcForm({ name: '', price: '', duration: '', instructions: '' }); setSvcModal(true); }} className="px-4 py-2 bg-blue-600 font-bold rounded-xl text-white flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> Add Service</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Procedure Name</th><th className="p-4">Price ($)</th><th className="p-4">Duration</th><th className="p-4">Instructions</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {services.map((s) => (
              <tr key={s.svcId}>
                <td className="p-4 font-mono text-slate-500">{s.svcId}</td>
                <td className="p-4 font-bold text-white">{s.name}</td>
                <td className="p-4 font-mono text-emerald-400 font-bold">${s.price}</td>
                <td className="p-4 text-slate-300">{s.duration} Mins</td>
                <td className="p-4 text-slate-400">{s.instructions || 'None'}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingSvcId(s.svcId); setSvcForm({ name: s.name, price: s.price, duration: s.duration, instructions: s.instructions }); setSvcModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteService(s.svcId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {svcModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingSvcId ? 'Edit Procedure' : 'Add Procedure'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSaveService} className="space-y-3">
              <input type="text" required value={svcForm.name} onChange={(e)=>setSvcForm({...svcForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Procedure Name" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" min="0" required value={svcForm.price} onChange={(e)=>setSvcForm({...svcForm, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Price ($ USD)" />
                <input type="number" min="1" required value={svcForm.duration} onChange={(e)=>setSvcForm({...svcForm, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Duration (Mins)" />
              </div>
              <input type="text" value={svcForm.instructions} onChange={(e)=>setSvcForm({...svcForm, instructions: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Pre-Appointment Instructions" />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[10px] text-slate-500 mb-1">Insurance Covered</label><select value={svcForm.insuranceCovered} onChange={(e)=>setSvcForm({...svcForm, insuranceCovered: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl outline-none text-slate-200 cursor-pointer"><option value="TRUE">TRUE</option><option value="FALSE">FALSE</option></select></div>
                <div><label className="block text-[10px] text-slate-500 mb-1">Category / Description</label><input type="text" value={svcForm.description} onChange={(e)=>setSvcForm({...svcForm, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl outline-none text-slate-200" placeholder="e.g. Preventative" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setSvcModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 font-bold rounded-xl text-white cursor-pointer">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
