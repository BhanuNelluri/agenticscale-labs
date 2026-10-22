import React, { useState, useEffect } from 'react';
import { Sparkles, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import SalonProfileTab from './SalonProfileTab';
import SalonStaffTab from './SalonStaffTab';
import SalonCatalogTab from './SalonCatalogTab';
import SalonLogsTab from './SalonLogsTab';

export default function SalonDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    spaName: user?.businessName || '', address: '200 Beauty Boulevard', hours: '09:00 - 19:00 Tue-Sat',
    depositRequired: '50', cancellationGrace: '24', formsLink: 'https://medspa.com/forms',
    email: user?.email || '', personaNotes: 'Sophisticated, welcoming spa receptionist'
  });

  const [staff, setStaff] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.MedSpa_Profiles && res.data.MedSpa_Profiles.length > 1) {
          const r = res.data.MedSpa_Profiles[1];
          setProfile({
            spaName: r[1] || user?.businessName || '', address: r[2] || '', hours: r[3] || '',
            depositRequired: r[4] || '', cancellationGrace: r[5] || '', formsLink: r[6] || '',
            email: r[7] || user?.email || '', personaNotes: r[8] || ''
          });
        }
        if (res.data.Aestheticians_Staff && res.data.Aestheticians_Staff.length > 1) {
          setStaff(res.data.Aestheticians_Staff.slice(1).map(r => ({ staffId: r[0], clientId: r[1], name: r[2], specialty: r[3], calId: r[4], hours: r[5] })));
        }
        if (res.data.Treatments_Catalog && res.data.Treatments_Catalog.length > 1) {
          setTreatments(res.data.Treatments_Catalog.slice(1).map(r => ({ trtId: r[0], clientId: r[1], name: r[2], price: r[3], duration: r[4], preCare: r[5] })));
        }
        if (res.data.LOGS_MedSpa && res.data.LOGS_MedSpa.length > 1) {
          setLogs(res.data.LOGS_MedSpa.slice(1).map(r => ({ logId: r[0], timestamp: r[1], callerName: r[3], callerPhone: r[4], treatment: r[5], aesthetician: r[6], slotTime: r[7], depositStatus: r[8], summary: r[11], action: r[12] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-pink-600 flex items-center justify-center font-bold text-white">S</div>
            <span className="text-base font-bold text-pink-400">Salon Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Aestheticians</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Treatments</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Spa Logs</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Sparkles className="text-pink-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <SalonProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <SalonStaffTab user={user} staff={staff} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <SalonCatalogTab user={user} treatments={treatments} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <SalonLogsTab logs={logs} />}
      </div>
    </div>
  );
}
