import React from 'react';

export default function HvacLogsTab({ logs }) {
  return (
    <div className="space-y-6 text-xs">
      <div>
        <h2 className="text-base font-bold text-white">HVAC Service & Dispatch Logs (LOGS_HomeServices)</h2>
        <p className="text-slate-400">Emergency calls, dispatched tech assignments, and arrival windows.</p>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-900/80 text-slate-400 font-semibold">
            <tr><th className="p-4">Log ID</th><th className="p-4">Timestamp</th><th className="p-4">Caller & Address</th><th className="p-4">Issue & Urgency</th><th className="p-4">Dispatched Tech</th><th className="p-4">Arrival Window & Action</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {logs.length === 0 ? (
              <tr><td colSpan="6" className="p-6 text-center text-slate-500">No dispatch calls logged yet.</td></tr>
            ) : (
              logs.map((l) => (
                <tr key={l.logId}>
                  <td className="p-4 font-mono text-slate-500">{l.logId}</td>
                  <td className="p-4 font-mono text-slate-400">{l.timestamp}</td>
                  <td className="p-4 font-bold text-white">{l.callerName}<br/><span className="text-[10px] text-slate-500 font-mono">{l.callerPhone} | {l.address}</span></td>
                  <td className="p-4 text-amber-400 font-medium">{l.category}<br/><span className="text-[10px] text-slate-400">Urgency: {l.urgency}</span></td>
                  <td className="p-4 font-bold text-slate-200">{l.tech}</td>
                  <td className="p-4 text-slate-300">{l.window}<br/><span className="text-[10px] text-indigo-400">{l.action}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
