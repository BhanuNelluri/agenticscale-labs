import React, { useState } from 'react';
import { Sparkles, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function SalonDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [staff, setStaff] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newStaff, setNewStaff] = useState({ name: '', specialty: '', calId: '', hours: '09:00-17:00' });
  const [newTrt, setNewTrt] = useState({ name: '', price: '', duration: '', preCare: 'Standard pre-care rules' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddStaff = async (e) => {
    e.preventDefault();
    setError('');

    if (!newStaff.name.trim() || !newStaff.specialty.trim() || !newStaff.calId.trim()) {
      setError('Please fill in aesthetician name, specialty, and calendar email.');
      return;
    }
    if (!emailRegex.test(newStaff.calId.trim())) {
      setError('Please enter a valid Google Calendar email address.');
      return;
    }

    setLoading(true);
    const staffId = `STF-${Date.now()}`;
    const row = [staffId, user.clientId, newStaff.name.trim(), newStaff.specialty.trim(), newStaff.calId.trim(), (newStaff.hours.trim() || "09:00-17:00"), "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Aestheticians_Staff', row);
      setStaff([...staff, { staffId, ...newStaff }]);
      setNewStaff({ name: '', specialty: '', calId: '', hours: '09:00-17:00' });
    } catch (err) {
      setError(err?.message || 'Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrt = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTrt.name.trim() || !newTrt.price || !newTrt.duration) {
      setError('Please fill in treatment name, price, and duration.');
      return;
    }

    setLoading(true);
    const trtId = `TRT-${Date.now()}`;
    const row = [trtId, user.clientId, newTrt.name.trim(), String(newTrt.price), String(newTrt.duration), (newTrt.preCare.trim() || "Standard pre-care rules"), "ALL", "Facial treatment"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Treatments_Catalog', row);
      setTreatments([...treatments, { trtId, ...newTrt }]);
      setNewTrt({ name: '', price: '', duration: '', preCare: 'Standard pre-care rules' });
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
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Salon Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Aestheticians</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Treatments</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Sparkles className="text-pink-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-pink-400" /> Add Aesthetician</h3>
              <form onSubmit={handleAddStaff} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Staff Name" required value={newStaff.name} onChange={(e)=>setNewStaff({...newStaff, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Specialty" required value={newStaff.specialty} onChange={(e)=>setNewStaff({...newStaff, specialty: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Calendar Email" required value={newStaff.calId} onChange={(e)=>setNewStaff({...newStaff, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Staff"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Specialty</th><th className="p-4">Calendar</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {staff.map((s, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{s.staffId}</td><td className="p-4 font-bold">{s.name}</td><td className="p-4">{s.specialty}</td><td className="p-4 font-mono text-pink-400">{s.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-pink-400" /> Add Treatment</h3>
              <form onSubmit={handleAddTrt} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Treatment Name" required value={newTrt.name} onChange={(e)=>setNewTrt({...newTrt, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Price ($)" required value={newTrt.price} onChange={(e)=>setNewTrt({...newTrt, price: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Duration (Mins)" required value={newTrt.duration} onChange={(e)=>setNewTrt({...newTrt, duration: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-pink-600 hover:bg-pink-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Treatment"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Duration</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {treatments.map((t, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{t.trtId}</td><td className="p-4 font-bold">{t.name}</td><td className="p-4 font-mono text-emerald-400">${t.price}</td><td className="p-4">{t.duration} mins</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}