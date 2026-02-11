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
            <h2 className="text-xl font-bold animate-pulse text-indigo-500">Loading Records...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-24">
            <header className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">Leaves</h3>
                    <h1 className="text-3xl font-bold text-gray-900">Request Time Off</h1>
                    <p className="text-gray-500 font-medium text-sm">Manage your leave balance and applications.</p>
                </div>
                <button className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm px-6 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2" onClick={() => setShowModal(true)}>
                    + New Request
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Annual Balance</p>
                    <h1 className="text-4xl font-black text-gray-900 leading-none">18 <span className="text-lg font-bold text-indigo-600 ml-1">Days</span></h1>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Used This Year</p>
                    <h1 className="text-4xl font-black text-gray-900 leading-none">04 <span className="text-lg font-bold text-emerald-600 ml-1">Days</span></h1>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Pending Approval</p>
                    <h1 className="text-4xl font-black text-gray-900 leading-none">{leaves.filter(l => l.status === 'Pending').length} <span className="text-lg font-bold text-amber-600 ml-1">Reqs</span></h1>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Leave History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Dates</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr><td colSpan="4" className="p-12 text-center text-gray-400 font-medium italic">No history found</td></tr>
                            ) : (
                                leaves.map(l => (
                                    <tr key={l._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                            {new Date(l.startDate).toLocaleDateString()} <span className="mx-1 text-gray-400">→</span> {new Date(l.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">{l.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${l.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : l.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-500 font-medium max-w-xs truncate">{l.reason || '-'}</p>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 pb-4 pt-24 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-gray-100 p-8 relative overflow-hidden flex flex-col">
                        <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 text-lg">✕</button>

                        <div className="mb-6">
                            <h3 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-1">New Application</h3>
                            <h1 className="text-2xl font-bold text-gray-900">Submit Leave Request</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase text-gray-500 px-1">Leave Type</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                    <option>Annual</option>
                                    <option>Sick</option>
                                    <option>Unpaid</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase text-gray-500 px-1">From</label>
                                    <input type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500" onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold uppercase text-gray-500 px-1">To</label>
                                    <input type="date" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500" onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold uppercase text-gray-500 px-1">Reason</label>
                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-indigo-500" placeholder="Please provide a reason..." style={{ minHeight: '100px' }} onChange={e => setForm({ ...form, reason: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                <button type="button" className="flex-1 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="flex-[2] py-3 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">Submit Application</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
