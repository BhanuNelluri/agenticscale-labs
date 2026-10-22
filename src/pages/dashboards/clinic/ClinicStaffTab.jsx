import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function ClinicStaffTab({ user, doctors, reload }) {
  const [docModal, setDocModal] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [docForm, setDocForm] = useState({ name: '', specialty: '', license: '', calId: '', hours: '08:00-16:00' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSaveDoctor = async (e) => {
    e.preventDefault(); setError('');
    if (!docForm.name.trim() || !docForm.specialty.trim() || !docForm.license.trim() || !docForm.calId.trim()) {
      setError('Name, specialty, license, and calendar ID required.'); return;
    }
    if (!emailRegex.test(docForm.calId.trim())) {
      setError('Enter a valid Calendar email.'); return;
    }
    setLoading(true);
    const staffId = editingDocId || `STF-${Date.now()}`;
    const row = [staffId, user.clientId, docForm.name.trim(), docForm.specialty.trim(), docForm.license.trim(), docForm.calId.trim(), docForm.hours.trim(), 'YES', '12', 'ACTIVE'];

    try {
      if (editingDocId) await apiUpdateRecord(user.spreadsheetId, 'Doctors_Staff', editingDocId, row);
      else await apiWriteRecord(user.spreadsheetId, 'Doctors_Staff', row);
      await reload(); setDocModal(false); setEditingDocId(null);
    } catch (err) { setError(err?.message || 'Save failed.'); } finally { setLoading(false); }
  };

  const handleDeleteDoctor = async (staffId) => {
    if (!window.confirm('Delete doctor?')) return;
    setLoading(true);
    try {
      await apiDeleteRecord(user.spreadsheetId, 'Doctors_Staff', staffId); await reload();
    } catch (err) { alert(err?.message || 'Delete failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <div><h2 className="text-base font-bold text-white">Doctors & Staff</h2><p className="text-slate-400">Manage doctors and calendar sync links.</p></div>
        <button onClick={() => { setEditingDocId(null); setDocForm({ name: '', specialty: '', license: '', calId: '', hours: '08:00-16:00' }); setDocModal(true); }} className="px-4 py-2 bg-blue-600 font-bold rounded-xl text-white flex items-center gap-2"><Plus className="w-4 h-4" /> Add Doctor</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Specialty</th><th className="p-4">License</th><th className="p-4">Calendar</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {doctors.map((d) => (
              <tr key={d.staffId}>
                <td className="p-4 font-mono text-slate-500">{d.staffId}</td>
                <td className="p-4 font-bold text-white">{d.name}</td>
                <td className="p-4 text-slate-300">{d.specialty}</td>
                <td className="p-4 text-slate-400 font-mono">{d.license}</td>
                <td className="p-4 font-mono text-blue-400">{d.calId}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingDocId(d.staffId); setDocForm({ name: d.name, specialty: d.specialty, license: d.license, calId: d.calId, hours: d.hours }); setDocModal(true); }} className="p-1.5 bg-slate-800 rounded"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteDoctor(d.staffId)} className="p-1.5 bg-slate-800 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {docModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">{editingDocId ? 'Edit Doctor' : 'Add Doctor'}</h3>
            {error && <div className="p-2 bg-red-500/10 text-red-400 text-center rounded">{error}</div>}
            <form onSubmit={handleSaveDoctor} className="space-y-3">
              <input type="text" required value={docForm.name} onChange={(e)=>setDocForm({...docForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Full Name" />
              <input type="text" required value={docForm.specialty} onChange={(e)=>setDocForm({...docForm, specialty: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Specialty" />
              <input type="text" required value={docForm.license} onChange={(e)=>setDocForm({...docForm, license: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="License Number" />
              <input type="email" required value={docForm.calId} onChange={(e)=>setDocForm({...docForm, calId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl" placeholder="Calendar Email" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setDocModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 font-bold rounded-xl text-white">{loading ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
