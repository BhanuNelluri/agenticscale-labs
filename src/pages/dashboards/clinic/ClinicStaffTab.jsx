import React, { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { apiWriteRecord, apiUpdateRecord, apiDeleteRecord } from '../../../services/api';

export default function ClinicStaffTab({ user, doctors, reload }) {
  const [docModal, setDocModal] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);
  const [docForm, setDocForm] = useState({
    name: '', specialty: '', license: '', calId: '',
    startTime: '08:00', endTime: '16:00', acceptsNew: 'YES', maxDaily: '12', status: 'ACTIVE'
  });
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
    const shiftHours = `${docForm.startTime} - ${docForm.endTime}`;
    const row = [
      staffId, user.clientId, docForm.name.trim(), docForm.specialty.trim(),
      docForm.license.trim(), docForm.calId.trim(), shiftHours,
      docForm.acceptsNew, String(docForm.maxDaily), docForm.status
    ];

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
        <div><h2 className="text-base font-bold text-white">Doctors & Medical Personnel</h2><p className="text-slate-400">Manage doctors, shift timings, licenses, and appointment limits.</p></div>
        <button onClick={() => { setEditingDocId(null); setDocForm({ name: '', specialty: '', license: '', calId: '', startTime: '08:00', endTime: '16:00', acceptsNew: 'YES', maxDaily: '12', status: 'ACTIVE' }); setDocModal(true); }} className="px-4 py-2 bg-blue-600 font-bold rounded-xl text-white flex items-center gap-2 cursor-pointer"><Plus className="w-4 h-4" /> Add Doctor</button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Specialty</th><th className="p-4">Shift Hours</th><th className="p-4">Max Daily</th><th className="p-4">Accepts New</th><th className="p-4">Calendar</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {doctors.map((d) => (
              <tr key={d.staffId}>
                <td className="p-4 font-mono text-slate-500">{d.staffId}</td>
                <td className="p-4 font-bold text-white">{d.name}</td>
                <td className="p-4 text-slate-300">{d.specialty}</td>
                <td className="p-4 text-slate-300 font-mono">{d.hours || '08:00 - 16:00'}</td>
                <td className="p-4 font-mono text-emerald-400">{d.maxDaily || '12'} / day</td>
                <td className="p-4 text-blue-400 font-semibold">{d.acceptsNew || 'YES'}</td>
                <td className="p-4 font-mono text-slate-400">{d.calId}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => { setEditingDocId(d.staffId); setDocForm({ name: d.name, specialty: d.specialty, license: d.license, calId: d.calId, startTime: (d.hours ? d.hours.split(' - ')[0] : '08:00'), endTime: (d.hours ? d.hours.split(' - ')[1] : '16:00'), acceptsNew: d.acceptsNew || 'YES', maxDaily: d.maxDaily || '12', status: d.status || 'ACTIVE' }); setDocModal(true); }} className="p-1.5 bg-slate-800 rounded cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDeleteDoctor(d.staffId)} className="p-1.5 bg-slate-800 rounded cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
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
              <input type="text" required value={docForm.name} onChange={(e)=>setDocForm({...docForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Doctor Full Name" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" required value={docForm.specialty} onChange={(e)=>setDocForm({...docForm, specialty: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Specialty" />
                <input type="text" required value={docForm.license} onChange={(e)=>setDocForm({...docForm, license: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="License Number" />
              </div>
              <input type="email" required value={docForm.calId} onChange={(e)=>setDocForm({...docForm, calId: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl outline-none" placeholder="Calendar Email" />
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[10px] text-slate-500 mb-1">Shift Start Time</label><input type="time" required value={docForm.startTime} onChange={(e)=>setDocForm({...docForm, startTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl outline-none text-slate-200" /></div>
                <div><label className="block text-[10px] text-slate-500 mb-1">Shift End Time</label><input type="time" required value={docForm.endTime} onChange={(e)=>setDocForm({...docForm, endTime: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl outline-none text-slate-200" /></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="block text-[10px] text-slate-500 mb-1">Max Daily Appts</label><input type="number" min="1" max="50" required value={docForm.maxDaily} onChange={(e)=>setDocForm({...docForm, maxDaily: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl outline-none text-slate-200" /></div>
                <div><label className="block text-[10px] text-slate-500 mb-1">Accepts New Patients</label><select value={docForm.acceptsNew} onChange={(e)=>setDocForm({...docForm, acceptsNew: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-2 rounded-xl outline-none text-slate-200 cursor-pointer"><option value="YES">YES</option><option value="NO">NO</option></select></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setDocModal(false)} className="flex-1 py-2 bg-slate-800 font-bold rounded-xl text-slate-300 cursor-pointer">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 py-2 bg-blue-600 font-bold rounded-xl text-white cursor-pointer">{loading ? "Saving..." : "Save Record"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
