import React, { useState, useEffect } from 'react';
import { Car, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import AutoProfileTab from './AutoProfileTab';
import AutoStaffTab from './AutoStaffTab';
import AutoCatalogTab from './AutoCatalogTab';
import AutoLogsTab from './AutoLogsTab';

export default function AutoDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    shopName: user?.businessName || '', address: '400 Motor Way', hours: '08:00 - 18:00 Mon-Sat',
    laborRate: '120', diagnosticFee: '85', towingPhone: user?.phone || '',
    email: user?.email || '', personaNotes: 'Knowledgeable auto shop advisor persona'
  });

  const [techs, setTechs] = useState([]);
  const [services, setServices] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.Auto_Profiles && res.data.Auto_Profiles.length > 1) {
          const r = res.data.Auto_Profiles[1];
          setProfile({
            shopName: r[1] || user?.businessName || '', address: r[2] || '', hours: r[3] || '',
            laborRate: r[4] || '', diagnosticFee: r[5] || '', towingPhone: r[6] || '',
            email: r[7] || user?.email || '', personaNotes: r[8] || ''
          });
        }
        if (res.data.Mechanics_Techs && res.data.Mechanics_Techs.length > 1) {
          setTechs(res.data.Mechanics_Techs.slice(1).map(r => ({ techId: r[0], clientId: r[1], name: r[2], certs: r[3], calId: r[4], hours: r[5] })));
        }
        if (res.data.Service_Packages && res.data.Service_Packages.length > 1) {
          setServices(res.data.Service_Packages.slice(1).map(r => ({ svcId: r[0], clientId: r[1], name: r[2], price: r[3], duration: r[4], notes: r[5] })));
        }
        if (res.data.LOGS_Auto && res.data.LOGS_Auto.length > 1) {
          setLogs(res.data.LOGS_Auto.slice(1).map(r => ({ logId: r[0], timestamp: r[1], callerName: r[3], callerPhone: r[4], vehicle: r[5], service: r[6], tech: r[7], slotTime: r[8], summary: r[11], action: r[12] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white">A</div>
            <span className="text-base font-bold text-indigo-400">Auto Shop Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Mechanics</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Packages</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Dropoff Logs</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Car className="text-indigo-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <AutoProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <AutoStaffTab user={user} techs={techs} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <AutoCatalogTab user={user} services={services} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <AutoLogsTab logs={logs} />}
      </div>
    </div>
  );
}
