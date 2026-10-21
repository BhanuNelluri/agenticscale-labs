import React, { useState } from 'react';
import { Building2, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function RealEstateDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newAgent, setNewAgent] = useState({ name: '', license: '', calId: '', hours: '09:00-18:00' });
  const [newProp, setNewProp] = useState({ address: '', price: '', specs: '', lockbox: 'Lockbox 1234' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddAgent = async (e) => {
    e.preventDefault();
    setError('');

    if (!newAgent.name.trim() || !newAgent.license.trim() || !newAgent.calId.trim()) {
      setError('Please fill in agent name, license number, and calendar email.');
      return;
    }
    if (!emailRegex.test(newAgent.calId.trim())) {
      setError('Please enter a valid Google Calendar email address.');
      return;
    }

    setLoading(true);
    const agentId = `AGT-${Date.now()}`;
    const row = [agentId, user.clientId, newAgent.name.trim(), newAgent.license.trim(), newAgent.calId.trim(), (newAgent.hours.trim() || "09:00-18:00"), "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Agents_LeasingStaff', row);
      setAgents([...agents, { agentId, ...newAgent }]);
      setNewAgent({ name: '', license: '', calId: '', hours: '09:00-18:00' });
    } catch (err) {
      setError(err?.message || 'Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProp = async (e) => {
    e.preventDefault();
    setError('');

    if (!newProp.address.trim() || !newProp.price || !newProp.specs) {
      setError('Please fill in property address, price, and specs.');
      return;
    }

    setLoading(true);
    const propId = `PRP-${Date.now()}`;
    const row = [propId, user.clientId, newProp.address.trim(), String(newProp.price), newProp.specs.trim(), "AGT-01", (newProp.lockbox.trim() || "Lockbox 1234")];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Property_Listings', row);
      setProperties([...properties, { propId, ...newProp }]);
      setNewProp({ address: '', price: '', specs: '', lockbox: 'Lockbox 1234' });
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
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Real Estate Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Leasing Agents</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Properties</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Building2 className="text-purple-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-purple-400" /> Add Leasing Agent</h3>
              <form onSubmit={handleAddAgent} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Agent Name" required value={newAgent.name} onChange={(e)=>setNewAgent({...newAgent, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="License Number" required value={newAgent.license} onChange={(e)=>setNewAgent({...newAgent, license: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Calendar Email" required value={newAgent.calId} onChange={(e)=>setNewAgent({...newAgent, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Agent"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">License</th><th className="p-4">Calendar</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {agents.map((a, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{a.agentId}</td><td className="p-4 font-bold">{a.name}</td><td className="p-4">{a.license}</td><td className="p-4 font-mono text-purple-400">{a.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-purple-400" /> Add Property Listing</h3>
              <form onSubmit={handleAddProp} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Property Address" required value={newProp.address} onChange={(e)=>setNewProp({...newProp, address: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Rent/Sale Price" required value={newProp.price} onChange={(e)=>setNewProp({...newProp, price: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Beds | Baths | SQFT" required value={newProp.specs} onChange={(e)=>setNewProp({...newProp, specs: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Property"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Address</th><th className="p-4">Price</th><th className="p-4">Specs</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {properties.map((p, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{p.propId}</td><td className="p-4 font-bold">{p.address}</td><td className="p-4 font-mono text-emerald-400">{p.price}</td><td className="p-4">{p.specs}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}