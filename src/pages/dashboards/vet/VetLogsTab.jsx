import React from 'react';

export default function VetLogsTab({ logs }) {
  return (
    <div className="space-y-6 text-xs">
      <div>
        <h2 className="text-base font-bold text-white">Veterinary Patient & Appointment Logs (LOGS_Vet)</h2>
        <p className="text-slate-400">Pet owner calls, pet species/breed info, assigned veterinarian, and appointment slots.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">Log ID</th><th className="p-4">Timestamp</th><th className="p-4">Pet Owner & Pet Info</th><th className="p-4">Service Requested</th><th className="p-4">Assigned Vet</th><th className="p-4">Appointment Slot</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {logs.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-500">No veterinary appointment calls logged yet.</td></tr>
            ) : (
              logs.map((l) => (
                <tr key={l.logId}>
                  <td className="p-4 font-mono text-slate-500">{l.logId}</td>
                  <td className="p-4 font-mono text-slate-400">{l.timestamp}</td>
                  <td className="p-4 font-bold text-white">{l.ownerName}<br/><span className="text-[10px] text-slate-500 font-mono">{l.callerPhone} | Pet: {l.petInfo}</span></td>
                  <td className="p-4 text-teal-400 font-medium">{l.service}</td>
                  <td className="p-4 text-slate-200 font-bold">{l.vet}</td>
                  <td className="p-4 text-emerald-400 font-semibold">{l.slotTime}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
