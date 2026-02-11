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
        <div className="flex flex-col gap-8 animate-fade-in">
            <header>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Time Off</h3>
                <h1 className="text-3xl font-bold text-gray-900">Leave Requests</h1>
                <p className="text-gray-600 max-w-md">Review and manage employee leave applications.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400 font-medium animate-pulse">
                        Loading requests...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-500">
                                    <th className="p-6">Employee</th>
                                    <th className="p-6">Duration</th>
                                    <th className="p-6">Type</th>
                                    <th className="p-6">Reason</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.length === 0 ? (
                                    <tr><td colSpan="6" className="p-12 text-center text-gray-400 font-medium">No pending leave requests.</td></tr>
                                ) : (
                                    leaves.map(l => (
                                        <tr key={l._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
                                                        {l.employeeId?.firstName?.[0] || '?'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 leading-snug">{l.employeeId ? `${l.employeeId.firstName} ${l.employeeId.lastName}` : 'Unknown'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-900">{new Date(l.startDate).toLocaleDateString()}</span>
                                                    <span className="text-xs font-medium text-gray-500">to {new Date(l.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">{l.type}</span>
                                            </td>
                                            <td className="p-6">
                                                <p className="text-sm text-gray-600 max-w-[200px] truncate group-hover:whitespace-normal transition-all">{l.reason || 'No reason provided'}</p>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : l.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                {l.status === 'Pending' && (
                                                    <div className="flex gap-2 justify-center">
                                                        <button onClick={() => updateStatus(l._id, 'Approved')} className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors flex items-center justify-center font-bold" title="Approve">
                                                            ✓
                                                        </button>
                                                        <button onClick={() => updateStatus(l._id, 'Rejected')} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors flex items-center justify-center font-bold" title="Reject">
                                                            ✕
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
