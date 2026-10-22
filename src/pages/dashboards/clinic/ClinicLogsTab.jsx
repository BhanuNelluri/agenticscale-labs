import React from 'react';

export default function ClinicLogsTab({ logs }) {
  return (
    <div className="space-y-6 text-xs">
      <div>
        <h2 className="text-base font-bold text-white">Live Call & Appointment Logs (LOGS_Clinics)</h2>
        <p className="text-slate-400">Real-time transcripts, booking slots, and AI receptionist triages captured automatically.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold">
            <tr><th className="p-4">Log ID</th><th className="p-4">Timestamp</th><th className="p-4">Caller Details</th><th className="p-4">Doctor & Service</th><th className="p-4">Booked Slot</th><th className="p-4">Transcript & AI Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {logs.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-500">No calls logged yet. Incoming calls from your Retell agent will appear here automatically.</td></tr>
            ) : (
              logs.map((l) => (
                <tr key={l.logId} className="hover:bg-slate-900/40">
                  <td className="p-4 font-mono text-slate-500">{l.logId}</td>
                  <td className="p-4 font-mono text-slate-400">{l.timestamp}</td>
                  <td className="p-4 font-bold text-white">{l.callerName}<br/><span className="text-[10px] text-slate-500 font-mono">{l.callerPhone}</span></td>
                  <td className="p-4 text-blue-400 font-medium">{l.doctor}<br/><span className="text-[10px] text-slate-400">{l.service} ({l.insurance || 'Self-pay'})</span></td>
                  <td className="p-4 text-emerald-400 font-semibold">{l.slotTime}</td>
                  <td className="p-4 text-slate-300 max-w-xs">{l.summary}<br/><span className="text-[10px] text-indigo-400 font-medium">{l.action}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
