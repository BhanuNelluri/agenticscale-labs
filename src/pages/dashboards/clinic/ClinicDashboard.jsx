import React, { useState, useEffect } from 'react';
import { Stethoscope, UserCheck, Table, LogOut, PhoneCall, Building, RefreshCw } from 'lucide-react';
import { apiFetchDashboard } from '../../../services/api';
import ClinicProfileTab from './ClinicProfileTab';
import ClinicStaffTab from './ClinicStaffTab';
import ClinicCatalogTab from './ClinicCatalogTab';
import ClinicLogsTab from './ClinicLogsTab';

export default function ClinicDashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [fetching, setFetching] = useState(false);

  const [profile, setProfile] = useState({
    clinicName: user?.businessName || '', address: '', hours: '',
    acceptedInsurance: '', copayPolicy: '', cancellationPolicy: '',
    triageRules: '', parkingNotes: '', email: user?.email || '', smsNumber: user?.phone || '', personaNotes: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => { loadLiveDashboard(); }, []);

  const loadLiveDashboard = async () => {
    if (!user?.spreadsheetId) return;
    setFetching(true);
    try {
      const res = await apiFetchDashboard(user.spreadsheetId);
      if (res && res.status === 'success' && res.data) {
        if (res.data.Clinic_Profiles && res.data.Clinic_Profiles.length > 1) {
          const r = res.data.Clinic_Profiles[1];
          setProfile({
            clinicName: r[1] || user?.businessName || '', address: r[2] || '', hours: r[3] || '',
            acceptedInsurance: r[4] || '', copayPolicy: r[5] || '', cancellationPolicy: r[6] || '',
            triageRules: r[7] || '', parkingNotes: r[8] || '', email: r[9] || user?.email || '',
            smsNumber: r[10] || user?.phone || '', personaNotes: r[11] || ''
          });
        }
        if (res.data.Doctors_Staff && res.data.Doctors_Staff.length > 1) {
          setDoctors(res.data.Doctors_Staff.slice(1).map(r => ({
            staffId: r[0], clientId: r[1], name: r[2], specialty: r[3], license: r[4], calId: r[5],
            hours: r[6], acceptsNew: r[7] || 'YES', maxDaily: r[8] || '12', status: r[9] || 'ACTIVE'
          })));
        }
        if (res.data.Services_Catalog && res.data.Services_Catalog.length > 1) {
          setServices(res.data.Services_Catalog.slice(1).map(r => ({
            svcId: r[0], clientId: r[1], name: r[2], price: r[3], duration: r[4],
            instructions: r[5], doctorIds: r[6] || 'ALL', insuranceCovered: r[7] || 'TRUE', description: r[8] || ''
          })));
        }
        if (res.data.LOGS_Clinics && res.data.LOGS_Clinics.length > 1) {
          setLogs(res.data.LOGS_Clinics.slice(1).map(r => ({ logId: r[0], timestamp: r[1], callerName: r[3], callerPhone: r[4], insurance: r[6], doctor: r[7], service: r[8], slotTime: r[9], status: r[11], summary: r[13], action: r[14] })).reverse());
        }
      }
    } catch (err) { console.error(err); } finally { setFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex text-xs">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">C</div>
            <span className="text-base font-bold text-blue-400">Clinic Portal</span>
          </div>
          <nav className="space-y-1.5 font-bold">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Building className="w-4 h-4" /> Profile</button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'staff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><UserCheck className="w-4 h-4" /> Doctors</button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'catalog' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Table className="w-4 h-4" /> Services</button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl ${activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><PhoneCall className="w-4 h-4" /> Call Logs</button>
          </nav>
        </div>
        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold cursor-pointer"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div><h1 className="text-xl font-bold flex items-center gap-2 text-white"><Stethoscope className="text-blue-400" /> {user?.businessName}</h1><p className="text-slate-400 font-mono mt-1">Spreadsheet ID: {user?.spreadsheetId}</p></div>
          <button onClick={loadLiveDashboard} disabled={fetching} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl font-semibold text-slate-300"><RefreshCw className={`w-3.5 h-3.5 ${fetching ? 'animate-spin' : ''}`} /> Sync Sheet</button>
        </div>

        {activeTab === 'profile' && <ClinicProfileTab user={user} profile={profile} setProfile={setProfile} />}
        {activeTab === 'staff' && <ClinicStaffTab user={user} doctors={doctors} reload={loadLiveDashboard} />}
        {activeTab === 'catalog' && <ClinicCatalogTab user={user} services={services} reload={loadLiveDashboard} />}
        {activeTab === 'logs' && <ClinicLogsTab logs={logs} />}
      </div>
    </div>
  );
}
