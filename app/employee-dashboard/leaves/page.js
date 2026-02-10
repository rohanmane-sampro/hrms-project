"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeLeavesPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ type: 'Annual', startDate: '', endDate: '', reason: '' });

    useEffect(() => { fetchMe(); }, []);

    async function fetchMe() {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
            fetchLeaves(data.user.id);
        } else {
            router.push('/login');
        }
    }

    async function fetchLeaves(id) {
        const res = await fetch(`/api/leaves?employeeId=${id}`);
        const data = await res.json();
        if (data.success) {
            setLeaves(data.data);
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch('/api/leaves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, employeeId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            setShowModal(false);
            setForm({ type: 'Annual', startDate: '', endDate: '', reason: '' });
            fetchLeaves(user.id);
        }
    }

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <h2 className="text-2xl font-black animate-pulse opacity-50 uppercase tracking-widest text-white">Loading Records...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-12 animate-fade-in pb-24 text-white">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Leave Management</h3>
                    <h1 className="text-white">Applied Leaves</h1>
                    <p className="max-w-md text-gray-400">Track your leave status and apply for new time off.</p>
                </div>
                <button className="btn-action btn-primary" onClick={() => setShowModal(true)}>
                    + New Leave Request
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bento-card border-indigo-600/10 hover:border-indigo-600/30">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Annual Allowance</p>
                    <h1 className="text-6xl mb-0 leading-none text-white">18 <span className="text-xl text-indigo-400">DAYS</span></h1>
                </div>
                <div className="bento-card border-emerald-600/10 hover:border-emerald-600/30">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Used This Year</p>
                    <h1 className="text-6xl mb-0 leading-none text-emerald-400">04 <span className="text-xl text-emerald-600">DAYS</span></h1>
                </div>
                <div className="bento-card border-amber-600/10 hover:border-amber-600/30">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">Pending Requests</p>
                    <h1 className="text-6xl mb-0 leading-none text-amber-500">{leaves.filter(l => l.status === 'Pending').length} <span className="text-xl text-amber-600">UNITS</span></h1>
                </div>
            </div>

            <div className="bento-card overflow-hidden p-0 border-white/5 bg-black/40">
                <div className="px-8 pt-8 pb-4 border-b border-white/5">
                    <h2 className="text-xl font-black mb-0 flex items-center gap-4 text-white uppercase">
                        <div className="w-2 h-6 bg-indigo-600 rounded-full"></div>
                        Leave History
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                <th className="p-6">Date Range</th>
                                <th className="p-6">Leave Type</th>
                                <th className="p-6">Status</th>
                                <th className="p-6">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr><td colSpan="4" className="p-24 text-center text-xl font-black opacity-30 tracking-widest italic uppercase text-white">No history found</td></tr>
                            ) : (
                                leaves.map(l => (
                                    <tr key={l._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-6 text-sm font-black text-white">
                                            {new Date(l.startDate).toLocaleDateString()} <span className="mx-2 text-indigo-400">→</span> {new Date(l.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-6">
                                            <span className="badge-premium bg-white/5 text-gray-400">[{l.type.toUpperCase()}]</span>
                                        </td>
                                        <td className="p-6">
                                            <span className={`badge-premium ${l.status === 'Approved' ? 'bg-emerald-600/20 text-emerald-400' : l.status === 'Rejected' ? 'bg-red-600/20 text-red-500' : 'bg-amber-600/20 text-amber-500'}`}>
                                                {l.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-xs font-medium opacity-60 max-w-xs truncate group-hover:whitespace-normal transition-all text-gray-300">{l.reason || 'No reason provided'}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[99999] flex items-center justify-center p-8 animate-fade-in">
                    <div className="bento-card w-full max-w-xl border-white/10 ring-1 ring-white/5 shadow-2xl">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-indigo-400">New Request</h3>
                                <h1 className="text-4xl mb-0 uppercase text-white">Apply for Leave</h1>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-xl border border-white/10 text-white">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Leave Type</label>
                                <select className="glass-input text-white" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option className="bg-black">Annual</option>
                                    <option className="bg-black">Sick</option>
                                    <option className="bg-black">Unpaid</option>
                                    <option className="bg-black">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Start Date</label>
                                    <input type="date" required className="glass-input text-white" onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">End Date</label>
                                    <input type="date" required className="glass-input text-white" onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Reason</label>
                                <textarea className="glass-input text-white" placeholder="Reason for leave..." style={{ minHeight: '120px' }} onChange={e => setForm({ ...form, reason: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-4 pt-6 mt-4 border-t border-white/10">
                                <button type="button" className="btn-action btn-ghost flex-1 text-white" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-action btn-primary flex-[2]">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
