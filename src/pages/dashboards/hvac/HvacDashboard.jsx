import React, { useState, useEffect } from 'react';
import { Wrench, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import HvacProfileTab from './HvacProfileTab';
import HvacStaffTab from './HvacStaffTab';
import HvacJobsTab from './HvacJobsTab';
import HvacLogsTab from './HvacLogsTab';

export default function HvacDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    companyName: user?.businessName || '', zipCodes: '90210, 90211', hours: '24/7 Emergency Dispatch',
    calloutFee: '99', emergencySurcharge: '150', overtimePolicy: 'Time-and-a-half after 18:00',
    licenseInfo: 'HVAC-Lic #884912', email: user?.email || '', dispatchSms: user?.phone || ''
  });

  const [techs, setTechs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.HVAC_Profiles && res.data.HVAC_Profiles.length > 1) {
          const r = res.data.HVAC_Profiles[1];
          setProfile({
            companyName: r[1] || user?.businessName || '', zipCodes: r[2] || '', hours: r[3] || '',
            calloutFee: r[4] || '', emergencySurcharge: r[5] || '', overtimePolicy: r[6] || '',
            licenseInfo: r[7] || '', email: r[8] || user?.email || '', dispatchSms: r[9] || user?.phone || ''
          });
        }
        if (res.data.Technicians && res.data.Technicians.length > 1) {
          setTechs(res.data.Technicians.slice(1).map(r => ({ techId: r[0], clientId: r[1], name: r[2], certs: r[3], vehicleId: r[4], calId: r[5], hours: r[6] })));
        }
        if (res.data.Jobs_Services && res.data.Jobs_Services.length > 1) {
          setJobs(res.data.Jobs_Services.slice(1).map(r => ({ jobId: r[0], clientId: r[1], title: r[2], price: r[3], duration: r[4], description: r[6] })));
        }
        if (res.data.LOGS_HomeServices && res.data.LOGS_HomeServices.length > 1) {
          setLogs(res.data.LOGS_HomeServices.slice(1).map(r => ({ logId: r[0], timestamp: r[1], callerName: r[3], callerPhone: r[4], address: r[5], category: r[6], urgency: r[7], tech: r[8], window: r[9], summary: r[12], action: r[13] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white">H</div>
            <span className="text-base font-bold text-amber-400">HVAC Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Technicians</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Jobs</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Dispatch Logs</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Wrench className="text-amber-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <HvacProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <HvacStaffTab user={user} techs={techs} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <HvacJobsTab user={user} jobs={jobs} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <HvacLogsTab logs={logs} />}
      </div>
    </div>
  );
}
