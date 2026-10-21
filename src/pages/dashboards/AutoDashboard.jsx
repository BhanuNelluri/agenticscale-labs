import React, { useState } from 'react';
import { Car, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function AutoDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [techs, setTechs] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newTech, setNewTech] = useState({ name: '', certs: '', calId: '', hours: '08:00-17:00' });
  const [newSvc, setNewSvc] = useState({ name: '', price: '', duration: '', notes: 'Standard parts check' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddTech = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTech.name.trim() || !newTech.certs.trim() || !newTech.calId.trim()) {
      setError('Please fill in mechanic name, ASE certifications, and calendar email.');
      return;
    }
    if (!emailRegex.test(newTech.calId.trim())) {
      setError('Please enter a valid Google Calendar email address.');
      return;
    }

    setLoading(true);
    const techId = `MEC-${Date.now()}`;
    const row = [techId, user.clientId, newTech.name.trim(), newTech.certs.trim(), newTech.calId.trim(), (newTech.hours.trim() || "08:00-17:00"), "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Mechanics_Techs', row);
      setTechs([...techs, { techId, ...newTech }]);
      setNewTech({ name: '', certs: '', calId: '', hours: '08:00-17:00' });
    } catch (err) {
      setError(err?.message || 'Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSvc = async (e) => {
    e.preventDefault();
    setError('');

    if (!newSvc.name.trim() || !newSvc.price || !newSvc.duration) {
      setError('Please fill in service package name, price, and duration.');
      return;
    }

    setLoading(true);
    const svcId = `REP-${Date.now()}`;
    const row = [svcId, user.clientId, newSvc.name.trim(), String(newSvc.price), String(newSvc.duration), (newSvc.notes.trim() || "Standard parts check"), "Auto repair service"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Service_Packages', row);
      setServices([...services, { svcId, ...newSvc }]);
      setNewSvc({ name: '', price: '', duration: '', notes: 'Standard parts check' });
    } catch (err) {
      setError(err?.message || 'Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">Auto Shop Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Mechanics</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Service Packages</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Car className="text-indigo-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" /> Add Mechanic</h3>
              <form onSubmit={handleAddTech} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Mechanic Name" required value={newTech.name} onChange={(e)=>setNewTech({...newTech, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="ASE Certifications" required value={newTech.certs} onChange={(e)=>setNewTech({...newTech, certs: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Calendar Email" required value={newTech.calId} onChange={(e)=>setNewTech({...newTech, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Mechanic"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Certs</th><th className="p-4">Calendar</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {techs.map((t, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{t.techId}</td><td className="p-4 font-bold">{t.name}</td><td className="p-4">{t.certs}</td><td className="p-4 font-mono text-indigo-400">{t.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" /> Add Package</h3>
              <form onSubmit={handleAddSvc} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Service Name" required value={newSvc.name} onChange={(e)=>setNewSvc({...newSvc, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Price ($)" required value={newSvc.price} onChange={(e)=>setNewSvc({...newSvc, price: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Duration (Mins)" required value={newSvc.duration} onChange={(e)=>setNewSvc({...newSvc, duration: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Package"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Service</th><th className="p-4">Price</th><th className="p-4">Duration</th></tr></thead>
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