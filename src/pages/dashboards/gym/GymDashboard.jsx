import React, { useState, useEffect } from 'react';
import { Dumbbell, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import GymProfileTab from './GymProfileTab';
import GymStaffTab from './GymStaffTab';
import GymCatalogTab from './GymCatalogTab';
import GymLogsTab from './GymLogsTab';

export default function GymDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    facilityName: user?.businessName || '', address: '300 Fitness Way', hours: '05:00 - 23:00 Daily',
    trialPolicy: 'First 3 Days Free Trial Pass', ageLimit: '16+ with parental consent',
    amenities: 'Pool, Sauna, Turf, Free Weights', email: user?.email || '', phone: user?.phone || ''
  });

  const [trainers, setTrainers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.Gym_Profiles && res.data.Gym_Profiles.length > 1) {
          const r = res.data.Gym_Profiles[1];
          setProfile({
            facilityName: r[1] || user?.businessName || '', address: r[2] || '', hours: r[3] || '',
            trialPolicy: r[4] || '', ageLimit: r[5] || '', amenities: r[6] || '',
            email: r[7] || user?.email || '', phone: r[8] || user?.phone || ''
          });
        }
        if (res.data.Coaches_Trainers && res.data.Coaches_Trainers.length > 1) {
          setTrainers(res.data.Coaches_Trainers.slice(1).map(r => ({ coachId: r[0], clientId: r[1], name: r[2], expertise: r[3], calId: r[4], hours: r[5] })));
        }
        if (res.data.Membership_Plans && res.data.Membership_Plans.length > 1) {
          setPlans(res.data.Membership_Plans.slice(1).map(r => ({ planId: r[0], clientId: r[1], name: r[2], fee: r[3], term: r[5], benefits: r[6] })));
        }
        if (res.data.LOGS_Fitness && res.data.LOGS_Fitness.length > 1) {
          setLogs(res.data.LOGS_Fitness.slice(1).map(r => ({ logId: r[0], timestamp: r[1], callerName: r[3], callerPhone: r[4], interest: r[5], coach: r[6], slotTime: r[7], summary: r[10], action: r[11] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">G</div>
            <span className="text-base font-bold text-emerald-400">Gym Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Coaches</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Plans</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Inquiries</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Dumbbell className="text-emerald-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <GymProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <GymStaffTab user={user} trainers={trainers} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <GymCatalogTab user={user} plans={plans} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <GymLogsTab logs={logs} />}
      </div>
    </div>
  );
}
