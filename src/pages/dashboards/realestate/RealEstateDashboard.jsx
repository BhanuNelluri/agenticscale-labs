import React, { useState, useEffect } from 'react';
import { Building2, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import RealEstateProfileTab from './RealEstateProfileTab';
import RealEstateStaffTab from './RealEstateStaffTab';
import RealEstateCatalogTab from './RealEstateCatalogTab';
import RealEstateLogsTab from './RealEstateLogsTab';

export default function RealEstateDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    brokerageName: user?.businessName || '', address: '600 Prime Parkway', hours: '09:00 - 18:00 Mon-Sat',
    appFee: '50', petPolicy: 'Pets under 25 lbs allowed', maintenancePhone: user?.phone || '',
    email: user?.email || '', portalLink: 'https://realty.com/apply'
  });

  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.RealEstate_Profiles && res.data.RealEstate_Profiles.length > 1) {
          const r = res.data.RealEstate_Profiles[1];
          setProfile({
            brokerageName: r[1] || user?.businessName || '', address: r[2] || '', hours: r[3] || '',
            appFee: r[4] || '', petPolicy: r[5] || '', maintenancePhone: r[6] || '',
            email: r[7] || user?.email || '', portalLink: r[8] || ''
          });
        }
        if (res.data.Agents_LeasingStaff && res.data.Agents_LeasingStaff.length > 1) {
          setAgents(res.data.Agents_LeasingStaff.slice(1).map(r => ({ agentId: r[0], clientId: r[1], name: r[2], license: r[3], calId: r[4], hours: r[5] })));
        }
        if (res.data.Property_Listings && res.data.Property_Listings.length > 1) {
          setProperties(res.data.Property_Listings.slice(1).map(r => ({ propId: r[0], clientId: r[1], address: r[2], price: r[3], specs: r[4], lockbox: r[6] })));
        }
        if (res.data.LOGS_RealEstate && res.data.LOGS_RealEstate.length > 1) {
          setLogs(res.data.LOGS_RealEstate.slice(1).map(r => ({ logId: r[0], timestamp: r[1], callerName: r[3], callerPhone: r[4], propertyAddress: r[5], agent: r[6], slotTime: r[7], summary: r[10], action: r[11] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white">R</div>
            <span className="text-base font-bold text-purple-400">Realty Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Leasing Agents</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Properties</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Tour Logs</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Building2 className="text-purple-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <RealEstateProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <RealEstateStaffTab user={user} agents={agents} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <RealEstateCatalogTab user={user} properties={properties} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <RealEstateLogsTab logs={logs} />}
      </div>
    </div>
  );
}
