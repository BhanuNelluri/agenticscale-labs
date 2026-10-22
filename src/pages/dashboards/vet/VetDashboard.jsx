import React, { useState, useEffect } from 'react';
import { Dog, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import VetProfileTab from './VetProfileTab';
import VetStaffTab from './VetStaffTab';
import VetCatalogTab from './VetCatalogTab';
import VetLogsTab from './VetLogsTab';

export default function VetDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    clinicName: user?.businessName || '', address: '500 Animal Care Drive', hours: '08:00 - 18:00 Mon-Sat',
    acceptedPets: 'Dogs, Cats, Birds', examFee: '75', emergencyPhone: user?.phone || '',
    rabiesRequired: 'YES', email: user?.email || ''
  });

  const [vets, setVets] = useState([]);
  const [services, setServices] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.Vet_Profiles && res.data.Vet_Profiles.length > 1) {
          const r = res.data.Vet_Profiles[1];
          setProfile({
            clinicName: r[1] || user?.businessName || '', address: r[2] || '', hours: r[3] || '',
            acceptedPets: r[4] || '', examFee: r[5] || '', emergencyPhone: r[6] || '',
            rabiesRequired: r[7] || 'YES', email: r[8] || user?.email || ''
          });
        }
        if (res.data.Veterinarians_Staff && res.data.Veterinarians_Staff.length > 1) {
          setVets(res.data.Veterinarians_Staff.slice(1).map(r => ({ vetId: r[0], clientId: r[1], name: r[2], focus: r[3], calId: r[4], hours: r[5] })));
        }
        if (res.data.Vet_Services && res.data.Vet_Services.length > 1) {
          setServices(res.data.Vet_Services.slice(1).map(r => ({ svcId: r[0], clientId: r[1], name: r[2], price: r[3], duration: r[4], fasting: r[5] })));
        }
        if (res.data.LOGS_Vet && res.data.LOGS_Vet.length > 1) {
          setLogs(res.data.LOGS_Vet.slice(1).map(r => ({ logId: r[0], timestamp: r[1], ownerName: r[3], callerPhone: r[4], petInfo: r[5], service: r[6], vet: r[7], slotTime: r[8], summary: r[11], action: r[12] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center font-bold text-white">V</div>
            <span className="text-base font-bold text-teal-400">Vet Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Veterinarians</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Exam Services</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Vet Logs</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Dog className="text-teal-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <VetProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <VetStaffTab user={user} vets={vets} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <VetCatalogTab user={user} services={services} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <VetLogsTab logs={logs} />}
      </div>
    </div>
  );
}
