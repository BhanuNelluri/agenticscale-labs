import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, Wrench, Sparkles, Dumbbell, Car, Dog, Building2, 
  ArrowRight, Play, Volume2, Cpu 
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollCycleWidget from '../components/ScrollCycleWidget';

export default function Landing({ user, setUser }) {
  const [callsPerDay, setCallsPerDay] = useState(30);
  const [avgTicket, setAvgTicket] = useState(200);
  const navigate = useNavigate();

  const missedCallsMonth = Math.round(callsPerDay * 0.25 * 30);
  const potentialRevenue = (missedCallsMonth * avgTicket * 0.4).toLocaleString();

  const handleDeployClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login?redirect=deploy');
    }
  };

  const niches = [
    { title: "Clinics & Healthcare", tag: "Medical & Dental", icon: <Stethoscope className="w-6 h-6 text-blue-400" />, image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80", desc: "Triages emergency symptoms, answers insurance questions, and books directly into doctor Google Calendars." },
    { title: "HVAC & Home Services", tag: "Plumbing & Electrical", icon: <Wrench className="w-6 h-6 text-amber-400" />, image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=600&q=80", desc: "Dispatches technicians 24/7, handles call-out fee queries, and sends instant SMS technician notifications." },
    { title: "Salons & MedSpas", tag: "Aesthetics & Care", icon: <Sparkles className="w-6 h-6 text-pink-400" />, image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80", desc: "Explains pre-care guidelines, deposit requirements, and assigns consults to specific aestheticians." },
    { title: "Gyms & Studios", tag: "Fitness & Training", icon: <Dumbbell className="w-6 h-6 text-emerald-400" />, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", desc: "Schedules free trial guest passes, explains membership pricing tiers, and maps personal trainer slots." },
    { title: "Auto Repair & Detailing", tag: "Mechanics & Detailing", icon: <Car className="w-6 h-6 text-indigo-400" />, image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80", desc: "Logs vehicle year/make/model, coordinates morning drop-offs, and provides after-hours towing contacts." },
    { title: "Veterinary Clinics", tag: "Pet Healthcare", icon: <Dog className="w-6 h-6 text-teal-400" />, image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80", desc: "Screens pet injury symptoms, checks rabies vaccine status, and books vet exam appointments." },
    { title: "Real Estate & Property", tag: "Leasing & Sales", icon: <Building2 className="w-6 h-6 text-purple-400" />, image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80", desc: "Screens tenant lead qualifications, answers rental application queries, and schedules property tours." }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-20">
      <Header user={user} setUser={setUser} />
      <ScrollCycleWidget />

      <section className="pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-xs font-bold uppercase tracking-wider mb-8">
          <Cpu className="w-4 h-4" /> Multi-Tenant AI Voice Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
          Never Miss a Lead Again. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
            Autonomous Voice AI Agents
          </span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Deploy production-grade voice agents powered by Retell AI. Answer caller inquiries 24/7, screen emergencies, and sync bookings straight to staff calendars and Google Sheets.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button onClick={handleDeployClick} className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer">
            Deploy Your Voice Agent <ArrowRight className="w-5 h-5" />
          </button>
          <a href="#demo" className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-2">
            <Play className="w-4 h-4 text-blue-400 fill-current" /> Listen to Demo Call
          </a>
        </div>

        <div id="demo" className="max-w-3xl mx-auto p-6 glass-panel rounded-2xl text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">Audio Sample Preview</span>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
              Ready for Integration
            </span>
          </div>

          <div className="bg-slate-950 p-8 rounded-xl border border-slate-800 text-center space-y-3">
            <Volume2 className="w-10 h-10 text-blue-400 mx-auto opacity-80" />
            <h4 className="text-sm font-bold text-slate-200">Retell AI Live Webhook Simulation Active</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Inbound phone streams automatically link to your Google Sheets schema when deployed through the client portal.
            </p>
          </div>
        </div>
      </section>

      <section id="roi" className="py-16 px-6 max-w-5xl mx-auto my-12 glass-panel p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-2">Calculate Your Recoverable Revenue</h2>
          <p className="text-slate-400 text-sm">Service businesses lose up to 25% of revenue to unanswered inbound calls.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-200 mb-2">
                <span>Inbound Calls Received / Day</span>
                <span className="text-blue-400">{callsPerDay} calls</span>
              </div>
              <input type="range" min="5" max="100" value={callsPerDay} onChange={(e) => setCallsPerDay(Number(e.target.value))} className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-slate-200 mb-2">
                <span>Average Value / Job or Sale</span>
                <span className="text-indigo-400">${avgTicket}</span>
              </div>
              <input type="range" min="50" max="1000" step="25" value={avgTicket} onChange={(e) => setAvgTicket(Number(e.target.value))} className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-xs uppercase font-bold text-slate-400 mb-2">Estimated Monthly Missed Calls</div>
            <div className="text-3xl font-black text-amber-400 mb-6 font-mono">{missedCallsMonth} calls missed</div>

            <div className="text-xs uppercase font-bold text-slate-400 mb-2">Recoverable Revenue With AI Agent</div>
            <div className="text-4xl md:text-5xl font-black text-emerald-400 font-mono">+${potentialRevenue} / mo</div>
          </div>
        </div>
      </section>

      <section id="niches" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-2">Supported Industry Niches</h2>
          <p className="text-slate-400 text-sm">Isolated spreadsheet schemas, staff scheduling, and dynamic Google Sheets logs.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {niches.map((item, idx) => (
            <div key={idx} className="glass-panel overflow-hidden flex flex-col justify-between">
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-950 text-slate-200 border border-slate-800">
                    {item.tag}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">{item.icon}</div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-16 px-6 max-w-3xl mx-auto border-t border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-2">All-In-One SaaS Subscription</h2>
          <p className="text-slate-400 text-sm">Everything you need to run your AI voice agency and connect to Google Sheets schemas.</p>
        </div>

        <div className="glass-panel p-8 border-blue-500 rounded-3xl relative text-center">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider px-4 py-1 rounded-full bg-blue-600 text-white shadow-lg">
            Pro Plan
          </span>
          <h3 className="text-2xl font-bold text-white mb-2 mt-2">Voice Agent Growth Plan</h3>
          <p className="text-slate-400 text-xs mb-6">Complete access to Retell AI voice agents, Google Sheets database integrations, and staff calendar mapping.</p>
          <div className="text-5xl font-black text-white mb-8 font-mono">$299 <span className="text-xs font-normal text-slate-400">/ month</span></div>
          
          <button onClick={handleDeployClick} className="w-full max-w-md py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 cursor-pointer">
            Start 7-Day Trial & Deploy Agent
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}