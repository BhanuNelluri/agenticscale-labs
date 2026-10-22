import React from 'react';

export default function SalonLogsTab({ logs }) {
  return (
    <div className="space-y-6 text-xs">
      <div>
        <h2 className="text-base font-bold text-white">Salon & MedSpa Activity Logs (LOGS_MedSpa)</h2>
        <p className="text-slate-400">Treatment requests, assigned aestheticians, and deposit collection status.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">Log ID</th><th className="p-4">Timestamp</th><th className="p-4">Caller</th><th className="p-4">Requested Treatment</th><th className="p-4">Aesthetician</th><th className="p-4">Booked Slot & Deposit</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {logs.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-500">No spa booking calls logged yet.</td></tr>
            ) : (
              logs.map((l) => (
                <tr key={l.logId}>
                  <td className="p-4 font-mono text-slate-500">{l.logId}</td>
                  <td className="p-4 font-mono text-slate-400">{l.timestamp}</td>
                  <td className="p-4 font-bold text-white">{l.callerName}<br/><span className="text-[10px] text-slate-500 font-mono">{l.callerPhone}</span></td>
                  <td className="p-4 text-pink-400 font-medium">{l.treatment}</td>
                  <td className="p-4 text-slate-200 font-bold">{l.aesthetician}</td>
                  <td className="p-4 text-emerald-400 font-semibold">{l.slotTime}<br/><span className="text-[10px] text-indigo-400">Deposit: {l.depositStatus}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
