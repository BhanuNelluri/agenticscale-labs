import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, Settings, LogOut, CheckCircle2, ShieldCheck, 
  ExternalLink, Table, UserCheck, Stethoscope, Wrench, Sparkles, 
  Dumbbell, Car, Dog, Building2
} from 'lucide-react';

export default function Dashboard({ user, setUser }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentIndustry = user?.industry || "Clinics & Healthcare";

  const [profileData, setProfileData] = useState({});
  const [staffData, setStaffData] = useState([]);
  const [catalogData, setCatalogData] = useState([]);
  const [logsData, setLogsData] = useState([]);

  useEffect(() => {
    if (currentIndustry === "Clinics & Healthcare") {
      setProfileData({ businessName: user?.businessName || "BrightSmile Dental Practice", acceptedInsurance: "Delta Dental, Cigna, MetLife", copayPolicy: "$50 deposit required", triageRules: "Route acute tooth pain to on-call doctor.", sheetUrl: "https://docs.google.com/spreadsheets/d/DB_Clinics/edit" });
      setStaffData([{ id: "DOC-101", name: "Dr. Emily Lee", title: "Cosmetic Dentistry", calId: "bhanunelluri08@gmail.com", hours: "08:00-16:00" }]);
      setCatalogData([{ id: "SVC-01", name: "Laser Teeth Whitening", price: "350", duration: "45 Mins" }]);
      setLogsData([{ id: "LOG-1", time: "2026-10-21 10:15", caller: "Alex Morgan", phone: "+1 (555) 321-7654", staff: "Dr. Emily Lee", req: "Teeth Whitening", slot: "Oct 22, 2:00 PM", status: "Synced to LOGS_Clinics" }]);
    } else if (currentIndustry === "HVAC & Home Services") {
      setProfileData({ businessName: user?.businessName || "Apex HVAC Services", serviceZipCodes: "90210, 90211", calloutFee: "99", emergencySurcharge: "150", sheetUrl: "https://docs.google.com/spreadsheets/d/DB_HVAC/edit" });
      setStaffData([{ id: "TECH-01", name: "Mike Miller", certs: "HVAC Master Tech", calId: "mike@hvac.com", hours: "24/7" }]);
      setCatalogData([{ id: "JOB-01", name: "AC Diagnostic Check", price: "99", duration: "60 Mins" }]);
      setLogsData([{ id: "LOG-1", time: "2026-10-21 09:30", caller: "David Wright", phone: "+1 (555) 444-1234", staff: "Mike Miller", req: "AC Repair", slot: "Oct 21, 11:30 AM", status: "Synced to LOGS_HomeServices" }]);
    } else if (currentIndustry === "Real Estate & Property Management") {
      setProfileData({ businessName: user?.businessName || "Prime Realty Group", appFee: "50", petPolicy: "Pets under 25 lbs allowed", sheetUrl: "https://docs.google.com/spreadsheets/d/DB_RealEstate/edit" });
      setStaffData([{ id: "AGT-01", name: "Sarah Connor", license: "RE-882109", calId: "sarah@realty.com", hours: "09:00-18:00" }]);
      setCatalogData([{ id: "PROP-101", address: "742 Evergreen Terrace", price: "$2,800 / mo", specs: "3 Beds | 2 Baths" }]);
      setLogsData([{ id: "LOG-1", time: "2026-10-21 08:45", caller: "Jessica Alba", phone: "+1 (555) 222-9876", staff: "Sarah Connor", req: "Showing Tour", slot: "Oct 22, 10:00 AM", status: "Synced to LOGS_RealEstate" }]);
    } else {
      setProfileData({ businessName: user?.businessName || "Service Agency", address: "Main Center", sheetUrl: "https://docs.google.com/spreadsheets/d/Master/edit" });
      setStaffData([{ id: "STF-01", name: "Primary Agent", calId: "agent@gmail.com", hours: "09:00-17:00" }]);
      setCatalogData([{ id: "CAT-01", name: "Standard Consultation", price: "100", duration: "30 Mins" }]);
      setLogsData([{ id: "LOG-1", time: "2026-10-21 11:00", caller: "John Doe", phone: "+1 (555) 000-1111", staff: "Primary Agent", req: "Consult", slot: "Oct 21, 3:00 PM", status: "Synced" }]);
    }
  }, [currentIndustry, user]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getNicheIcon = () => {
    if (currentIndustry.includes("Clinic")) return <Stethoscope className="w-5 h-5 text-blue-400" />;
    if (currentIndustry.includes("HVAC")) return <Wrench className="w-5 h-5 text-amber-400" />;
    if (currentIndustry.includes("Spa")) return <Sparkles className="w-5 h-5 text-pink-400" />;
    if (currentIndustry.includes("Gym")) return <Dumbbell className="w-5 h-5 text-emerald-400" />;
    if (currentIndustry.includes("Auto")) return <Car className="w-5 h-5 text-indigo-400" />;
    if (currentIndustry.includes("Vet")) return <Dog className="w-5 h-5 text-teal-400" />;
    return <Building2 className="w-5 h-5 text-purple-400" />;
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      <div className="w-64 bg-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">AgenticScale</span>
          </div>

          <nav className="space-y-1.5">
            <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'profile' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Settings className="w-4 h-4" /> Profile Schema Tab
            </button>
            <button onClick={() => setActiveTab('staff')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'staff' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <UserCheck className="w-4 h-4" /> Personnel Schema Tab
            </button>
            <button onClick={() => setActiveTab('catalog')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <Table className="w-4 h-4" /> Catalog Schema Tab
            </button>
            <button onClick={() => setActiveTab('logs')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'}`}>
              <PhoneCall className="w-4 h-4" /> Activity Logs Tab
            </button>
          </nav>
        </div>

        <button onClick={() => setUser(null)} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold transition px-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-lg font-bold text-white mb-1">
              {getNicheIcon()}
              <span>{profileData.businessName}</span>
            </div>
            <p className="text-xs text-slate-400">Active Database Schema: <span className="text-blue-400 font-mono font-semibold">{currentIndustry}</span></p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Voice Agent Synced
          </span>
        </div>

        {activeTab === 'profile' && (
          <form onSubmit={handleSave} className="glass-panel p-8 rounded-2xl space-y-6">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-4">Profile Table Schema Inputs: [{currentIndustry}]</h2>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-2">Business Name</label>
                <input type="text" value={profileData.businessName || ""} onChange={(e)=>setProfileData({...profileData, businessName: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl outline-none" />
              </div>
              <div>
                <label className="block font-bold text-slate-300 mb-2">Synced Google Spreadsheet URL</label>
                <div className="flex gap-2">
                  <input type="text" value={profileData.sheetUrl || ""} onChange={(e)=>setProfileData({...profileData, sheetUrl: e.target.value})} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono outline-none text-slate-300" />
                  <a href={profileData.sheetUrl} target="_blank" rel="noreferrer" className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-300"><ExternalLink className="w-4 h-4" /></a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 font-bold text-xs rounded-xl transition cursor-pointer">Save Schema Inputs</button>
              {saveSuccess && <span className="text-xs text-emerald-400 font-semibold">Schema updated successfully!</span>}
            </div>
          </form>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white">Personnel Schema Tab</h2>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                  <tr><th className="p-4">ID</th><th className="p-4">Name</th><th className="p-4">Role/Certs</th><th className="p-4">Calendar ID</th><th className="p-4">Hours</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {staffData.map((st, i) => (
                    <tr key={i}><td className="p-4 font-mono text-slate-500">{st.id}</td><td className="p-4 font-bold text-white">{st.name}</td><td className="p-4 text-slate-300">{st.title || st.certs || st.license}</td><td className="p-4 font-mono text-blue-400">{st.calId}</td><td className="p-4 font-mono text-slate-400">{st.hours}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white">Services & Catalog Schema Tab</h2>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                  <tr><th className="p-4">ID</th><th className="p-4">Service / Property</th><th className="p-4">Price</th><th className="p-4">Duration / Specs</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {catalogData.map((cat, i) => (
                    <tr key={i}><td className="p-4 font-mono text-slate-500">{cat.id}</td><td className="p-4 font-bold text-white">{cat.name || cat.address}</td><td className="p-4 font-mono text-emerald-400 font-bold">${cat.price}</td><td className="p-4 text-slate-300">{cat.duration || cat.specs}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-white">Activity Logs Schema Tab</h2>
            <div className="glass-panel rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                  <tr><th className="p-4">Time</th><th className="p-4">Caller</th><th className="p-4">Staff</th><th className="p-4">Request & Slot</th><th className="p-4">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {logsData.map((log, i) => (
                    <tr key={i}><td className="p-4 font-mono text-slate-400">{log.time}</td><td className="p-4 font-bold text-white">{log.caller}<br/><span className="text-[10px] text-slate-500">{log.phone}</span></td><td className="p-4 text-blue-400">{log.staff}</td><td className="p-4 text-slate-300">{log.req}<br/><span className="text-[10px] text-slate-500">{log.slot}</span></td><td className="p-4"><span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px]">{log.status}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}