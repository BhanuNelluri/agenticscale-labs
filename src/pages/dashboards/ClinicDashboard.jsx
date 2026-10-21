import React, { useState } from 'react';
import { Stethoscope, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function ClinicDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newDoc, setNewDoc] = useState({ name: '', specialty: '', license: '', calId: '', hours: '08:00-16:00' });
  const [newSvc, setNewSvc] = useState({ name: '', price: '', duration: '', instructions: '' });

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    const staffId = `STF-${Date.now()}`;
    const row = [staffId, user.clientId, newDoc.name, newDoc.specialty, newDoc.license, newDoc.calId, newDoc.hours, "YES", "12", "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Doctors_Staff', row);
      setDoctors([...doctors, { staffId, ...newDoc }]);
      setNewDoc({ name: '', specialty: '', license: '', calId: '', hours: '08:00-16:00' });
    } catch (err) {
      alert('Failed to write record to Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setLoading(true);
    const svcId = `SVC-${Date.now()}`;
    const row = [svcId, user.clientId, newSvc.name, newSvc.price, newSvc.duration, (newSvc.instructions.trim() || "None"), "ALL", "TRUE", "Standard Treatment"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Services_Catalog', row);
      setServices([...services, { svcId, ...newSvc }]);
      setNewSvc({ name: '', price: '', duration: '', instructions: '' });
    } catch (err) {
      alert('Failed to write service to Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Clinic Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Doctors & Staff</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Services Catalog</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Stethoscope className="text-blue-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-400" /> Add Doctor (Doctors_Staff Tab)</h3>
              <form onSubmit={handleAddDoctor} className="grid sm:grid-cols-5 gap-4 text-xs">
                <input type="text" placeholder="Doctor Full Name" required value={newDoc.name} onChange={(e)=>setNewDoc({...newDoc, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Specialty" required value={newDoc.specialty} onChange={(e)=>setNewDoc({...newDoc, specialty: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" /> <input type="text" placeholder="License Number" required value={newDoc.license} onChange={(e)=>setNewDoc({...newDoc, license: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Google Calendar ID" required value={newDoc.calId} onChange={(e)=>setNewDoc({...newDoc, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Row to Sheet"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">Staff ID</th><th className="p-4">Name</th><th className="p-4">Specialty</th><th className="p-4">Calendar ID</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {doctors.map((d, i) => (<tr key={i}><td className="p-4 font-mono text-slate-500">{d.staffId}</td><td className="p-4 font-bold">{d.name}</td><td className="p-4">{d.specialty}</td><td className="p-4 font-mono text-blue-400">{d.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-blue-400" /> Add Service (Services_Catalog Tab)</h3>
              <form onSubmit={handleAddService} className="grid sm:grid-cols-5 gap-4 text-xs">
                <input type="text" placeholder="Service Name" required value={newSvc.name} onChange={(e)=>setNewSvc({...newSvc, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Price (USD)" required value={newSvc.price} onChange={(e)=>setNewSvc({...newSvc, price: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Duration (Mins)" required value={newSvc.duration} onChange={(e)=>setNewSvc({...newSvc, duration: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" /> <input type="text" placeholder="Pre-Appointment Instructions" value={newSvc.instructions} onChange={(e)=>setNewSvc({...newSvc, instructions: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Service Row"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">Service ID</th><th className="p-4">Service Name</th><th className="p-4">Price</th><th className="p-4">Duration</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {services.map((s, i) => (<tr key={i}><td className="p-4 font-mono text-slate-500">{s.svcId}</td><td className="p-4 font-bold">{s.name}</td><td className="p-4 font-mono text-emerald-400">${s.price}</td><td className="p-4">{s.duration} Mins</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}