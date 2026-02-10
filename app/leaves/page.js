"use client";
import { useState, useEffect } from 'react';

export default function AdminLeavesPage() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaves();
    }, []);

    async function fetchLeaves() {
        try {
            const res = await fetch('/api/leaves');
            const data = await res.json();
            if (data.success) {
                setLeaves(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch leaves", error);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id, newStatus) {
        try {
            const res = await fetch('/api/leaves', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                fetchLeaves();
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    }

    return (
        <div className="flex flex-col gap-12 animate-fade-in">
            <header>
                <h3 className="text-indigo-400">Approval Logistics</h3>
                <h1>Leave Requests</h1>
                <p className="max-w-md">Authorize or relocate operational time-off allocations for the global workforce.</p>
            </header>

            <div className="bento-card overflow-hidden p-0 border-white/5 bg-black/20">
                {loading ? (
                    <div className="p-24 text-center">
                        <h2 className="text-xl font-black opacity-30 tracking-[0.3em] animate-pulse uppercase">Retrieving Permission Tickets...</h2>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                    <th className="p-6">SPECIALIST UNIT</th>
                                    <th className="p-6">TEMPORAL RANGE</th>
                                    <th className="p-6">ALLOCATION TYPE</th>
                                    <th className="p-6">JUSTIFICATION</th>
                                    <th className="p-6">CURRENT STATUS</th>
                                    <th className="p-6 text-center">COMMANDS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.length === 0 ? (
                                    <tr><td colSpan="6" className="p-24 text-center text-xl font-black opacity-30 tracking-widest">ZERO PENDING TICKETS</td></tr>
                                ) : (
                                    leaves.map(l => (
                                        <tr key={l._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-600/20 flex items-center justify-center font-black">
                                                        {l.employeeId?.firstName?.[0] || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white uppercase tracking-tight">{l.employeeId ? `${l.employeeId.firstName} ${l.employeeId.lastName}` : 'UNKNOWN'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white">{new Date(l.startDate).toLocaleDateString()}</span>
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">to {new Date(l.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="badge-premium bg-white/5 text-gray-400">{l.type}</span>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-xs font-medium text-gray-400 max-w-[200px] truncate group-hover:whitespace-normal transition-all">{l.reason || 'NO PAYLOAD'}</p>
                                            </td>
                                            <td className="p-6">
                                                <span className={`badge-premium ${l.status === 'Approved' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30' : l.status === 'Rejected' ? 'bg-red-600/20 text-red-500 border-red-600/30' : 'bg-amber-600/20 text-amber-500 border-amber-600/30'}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                {l.status === 'Pending' && (
                                                    <div className="flex gap-2 justify-center">
                                                        <button onClick={() => updateStatus(l._id, 'Approved')} className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center font-black" title="Authorize">
                                                            ✓
                                                        </button>
                                                        <button onClick={() => updateStatus(l._id, 'Rejected')} className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center font-black" title="Void">
                                                            ✗
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
