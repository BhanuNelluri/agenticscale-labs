import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#020617] pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">A</div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              AgenticScale Labs
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Autonomous multi-tenant voice AI agency platform. Connecting Retell AI agents with dynamic Google Sheets database schemas and real-time client portal dashboards.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Udyam Registered Entity: <span className="text-slate-200 font-bold">UDYAM-AP-22-0076833</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Supported Niches</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Clinics & Healthcare</li>
            <li>HVAC & Home Services</li>
            <li>Salons & MedSpas</li>
            <li>Gyms & Fitness Studios</li>
            <li>Auto Repair & Detailing</li>
            <li>Veterinary Hospitals</li>
            <li>Real Estate & Property Management</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">Platform Specs</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Retell AI Real-Time Engine</li>
            <li>Google Calendar API Mapping</li>
            <li>Multi-Tenant Master Registry</li>
            <li>Google Sheets Webhook Schema Sync</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>&copy; {new Date().getFullYear()} AgenticScale Labs. All rights reserved.</p>
        <p className="font-mono text-[11px]">Primary Domain: agenticscalelabs.com</p>
      </div>
    </footer>
  );
}