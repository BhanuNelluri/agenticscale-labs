import React, { useState } from 'react';
import { Wrench, Plus, UserCheck, Table, ShieldCheck, LogOut } from 'lucide-react';
import { apiWriteRecord } from '../../services/api';

export default function HvacDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('staff');
  const [techs, setTechs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newTech, setNewTech] = useState({ name: '', certs: '', calId: '' });
  const [newJob, setNewJob] = useState({ title: '', price: '', duration: '' });

  const handleAddTech = async (e) => {
    e.preventDefault();
    setLoading(true);
    const techId = `TCH-${Date.now()}`;
    const row = [techId, user.clientId, newTech.name, newTech.certs, "VEH-01", newTech.calId, "24/7", "ACTIVE"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Technicians', row);
      setTechs([...techs, { techId, ...newTech }]);
      setNewTech({ name: '', certs: '', calId: '' });
    } catch (err) {
      alert('Failed to sync tech.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    const jobId = `JOB-${Date.now()}`;
    const row = [jobId, user.clientId, newJob.title, newJob.price, newJob.duration, "TRUE", "Standard Diagnostic"];

    try {
      await apiWriteRecord(user.spreadsheetId, 'Jobs_Services', row);
      setJobs([...jobs, { jobId, ...newJob }]);
      setNewJob({ title: '', price: '', duration: '' });
    } catch (err) {
      alert('Failed to sync job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">HVAC Portal</span>
          </div>
          <nav className="space-y-1.5 text-xs font-bold">
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Technicians</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Jobs & Services</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2"><Wrench className="text-amber-400" /> {user?.businessName}</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"><ShieldCheck className="w-4 h-4" /> Live Webhook Active</span>
        </div>

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-400" /> Add Technician (Technicians Tab)</h3>
              <form onSubmit={handleAddTech} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Tech Name" required value={newTech.name} onChange={(e)=>setNewTech({...newTech, name: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Certifications" required value={newTech.certs} onChange={(e)=>setNewTech({...newTech, certs: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="email" placeholder="Calendar Email" required value={newTech.calId} onChange={(e)=>setNewTech({...newTech, calId: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Tech"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Certs</th><th className="p-4">Calendar</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {techs.map((t, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{t.techId}</td><td className="p-4 font-bold">{t.name}</td><td className="p-4">{t.certs}</td><td className="p-4 font-mono text-amber-400">{t.calId}</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-400" /> Add Job (Jobs_Services Tab)</h3>
              <form onSubmit={handleAddJob} className="grid sm:grid-cols-4 gap-4 text-xs">
                <input type="text" placeholder="Job Title" required value={newJob.title} onChange={(e)=>setNewJob({...newJob, title: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Base Price ($)" required value={newJob.price} onChange={(e)=>setNewJob({...newJob, price: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <input type="text" placeholder="Duration (Mins)" required value={newJob.duration} onChange={(e)=>setNewJob({...newJob, duration: e.target.value})} className="bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
                <button type="submit" disabled={loading} className="bg-amber-600 hover:bg-amber-500 font-bold py-3 rounded-xl text-white">{loading ? "Syncing..." : "Save Job"}</button>
              </form>
            </div>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold"><tr><th className="p-4">ID</th><th className="p-4">Title</th><th className="p-4">Price</th><th className="p-4">Duration</th></tr></thead>
                <tbody className="divide-y divide-slate-800">
                  {jobs.map((j, i)=>(<tr key={i}><td className="p-4 font-mono text-slate-500">{j.jobId}</td><td className="p-4 font-bold">{j.title}</td><td className="p-4 font-mono text-emerald-400">${j.price}</td><td className="p-4">{j.duration} mins</td></tr>))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}