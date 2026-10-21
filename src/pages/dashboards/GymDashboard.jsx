import React, { useState } from 'react';
import { Dumbbell, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function GymDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [newTrainer, setNewTrainer] = useState({ name: '', expertise: '', calId: '', hours: '06:00-21:00' });
  const [newPlan, setNewPlan] = useState({ name: '', fee: '', term: '', benefits: 'Full gym access' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleAddTrainer = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTrainer.name.trim() || !newTrainer.expertise.trim() || !newTrainer.calId.trim()) {
      setError('Please fill in coach name, specialty/classes, and calendar email.');
      return;
    }
    if (!emailRegex.test(newTrainer.calId.trim())) {
      setError('Please enter a valid Google Calendar email address.');
      return;
    }

    setLoading(true);
    const coachId = `COA-${Date.now()}`;
    const row = [coachId, user.clientId, newTrainer.name.trim(), newTrainer.expertise.trim(), newTrainer.calId.trim(), (newTrainer.hours.trim() || "06:00-21:00"), "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Coaches_Trainers', row);
      setTrainers([...trainers, { coachId, ...newTrainer }]);
      setNewTrainer({ name: '', expertise: '', calId: '', hours: '06:00-21:00' });
    } catch (err) {
      setError(err?.message || 'Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPlan.name.trim() || !newPlan.fee || !newPlan.term) {
      setError('Please fill in plan name, monthly fee, and contract term.');
      return;
    }

    setLoading(true);
    const planId = `PLN-${Date.now()}`;
    const row = [planId, user.clientId, newPlan.name.trim(), String(newPlan.fee), "0", String(newPlan.term), (newPlan.benefits.trim() || "Full gym access")];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Membership_Plans', row);
      setPlans([...plans, { planId, ...newPlan }]);
      setNewPlan({ name: '', fee: '', term: '', benefits: 'Full gym access' });
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
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Gym Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Coaches & Trainers</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Membership Plans</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Dumbbell className="text-emerald-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" /> Add Coach</h3>
              <form onSubmit={handleAddTrainer} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Coach Name" required value={newTrainer.name} onChange={(e)=>setNewTrainer({...newTrainer, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Specialty" required value={newTrainer.expertise} onChange={(e)=>setNewTrainer({...newTrainer, expertise: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Calendar Email" required value={newTrainer.calId} onChange={(e)=>setNewTrainer({...newTrainer, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Coach"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Specialty</th><th className="p-4">Calendar</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {trainers.map((t, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{t.coachId}</td><td className="p-4 font-bold">{t.name}</td><td className="p-4">{t.expertise}</td><td className="p-4 font-mono text-emerald-400">{t.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" /> Add Plan</h3>
              <form onSubmit={handleAddPlan} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Plan Name" required value={newPlan.name} onChange={(e)=>setNewPlan({...newPlan, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Monthly Fee ($)" required value={newPlan.fee} onChange={(e)=>setNewPlan({...newPlan, fee: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Term (Months)" required value={newPlan.term} onChange={(e)=>setNewPlan({...newPlan, term: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Plan"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Plan Name</th><th className="p-4">Monthly Fee</th><th className="p-4">Term</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {plans.map((p, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{p.planId}</td><td className="p-4 font-bold">{p.name}</td><td className="p-4 font-mono text-emerald-400">${p.fee}</td><td className="p-4">{p.term} Months</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}