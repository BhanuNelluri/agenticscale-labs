import React, { useState } from 'react';
import { Dog, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function VetDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [vets, setVets] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newVet, setNewVet] = useState({ name: '', focus: '', calId: '' });
  const [newSvc, setNewSvc] = useState({ name: '', price: '', duration: '' });

  const handleAddVet = async (e) => {
    e.preventDefault();
    setLoading(true);
    const vetId = `VET-${Date.now()}`;
    const row = [vetId, user.clientId, newVet.name, newVet.focus, newVet.calId, "08:00-17:00", "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Veterinarians_Staff', row);
      setVets([...vets, { vetId, ...newVet }]);
      setNewVet({ name: '', focus: '', calId: '' });
    } catch (err) { alert('Sync failed.'); } finally { setLoading(false); }
  };

  const handleAddSvc = async (e) => {
    e.preventDefault();
    setLoading(true);
    const svcId = `EXM-${Date.now()}`;
    const row = [svcId, user.clientId, newSvc.name, newSvc.price, newSvc.duration, "Standard wellness exam check", "Pet exam service"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Vet_Services', row);
      setServices([...services, { svcId, ...newSvc }]);
      setNewSvc({ name: '', price: '', duration: '' });
    } catch (err) { alert('Sync failed.'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">Vet Clinic Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Veterinarians</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Exam Types</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Dog className="text-teal-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-teal-400" /> Add Veterinarian</h3>
              <form onSubmit={handleAddVet} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Vet Name" required value={newVet.name} onChange={(e)=>setNewVet({...newVet, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Specialty Focus" required value={newVet.focus} onChange={(e)=>setNewVet({...newVet, focus: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Calendar Email" required value={newVet.calId} onChange={(e)=>setNewVet({...newVet, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Vet"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Focus</th><th className="p-4">Calendar</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {vets.map((v, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{v.vetId}</td><td className="p-4 font-bold">{v.name}</td><td className="p-4">{v.focus}</td><td className="p-4 font-mono text-teal-400">{v.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-teal-400" /> Add Exam</h3>
              <form onSubmit={handleAddSvc} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Exam Name" required value={newSvc.name} onChange={(e)=>setNewSvc({...newSvc, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Price ($)" required value={newSvc.price} onChange={(e)=>setNewSvc({...newSvc, price: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Duration (Mins)" required value={newSvc.duration} onChange={(e)=>setNewSvc({...newSvc, duration: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Exam"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Exam Name</th><th className="p-4">Price</th><th className="p-4">Duration</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {services.map((s, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{s.svcId}</td><td className="p-4 font-bold">{s.name}</td><td className="p-4 font-mono text-emerald-400">${s.price}</td><td className="p-4">{s.duration} mins</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}