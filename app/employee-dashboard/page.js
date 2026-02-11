"use client";
import { useState, useEffect } from 'react';

export default function EmployeeDashboard() {
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [marking, setMarking] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [leaveForm, setLeaveForm] = useState({
        type: 'Annual',
        startDate: '',
        endDate: '',
        reason: ''
    });

    useEffect(() => {
        fetchMe();
        fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        if (data.success) setAnnouncements(data.data.slice(0, 3));
    }

    async function fetchMe() {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
            fetchAttendance(data.user.id);
            fetchLeaves(data.user.id);
        } else {
            window.location.href = '/login';
        }
    }

    async function fetchAttendance(id) {
        const res = await fetch(`/api/attendance?employeeId=${id}`);
        const data = await res.json();
        if (data.success) setAttendance(data.data.slice(0, 5));
    }

    async function fetchLeaves(id) {
        const res = await fetch(`/api/leaves?employeeId=${id}`);
        const data = await res.json();
        if (data.success) setLeaves(data.data);
    }

    async function markAttendance(status) {
        if (!user) return;
        setMarking(true);
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId: user.id, status })
            });
            const data = await res.json();
            if (data.success) fetchAttendance(user.id);
        } finally {
            setMarking(false);
        }
    }

    async function submitLeave(e) {
        e.preventDefault();
        if (!user) return;
        const res = await fetch('/api/leaves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...leaveForm, employeeId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            setShowLeaveModal(false);
            fetchLeaves(user.id);
        }
    }

    if (!user) return (
        <div className="flex h-96 items-center justify-center">
            <h2 className="text-xl font-medium text-gray-400 animate-pulse">Loading Portal...</h2>
        </div>
    );

    const todayMarked = attendance.some(a => new Date(a.date).toDateString() === new Date().toDateString());

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-24">
            {/* Header */}
            <header className="flex justify-between items-end border-b border-gray-100 pb-8">
                <div>
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Employee Portal</h3>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome, {user.name.split(' ')[0]}</h1>
                    <p className="text-gray-500 font-medium">{user.role} | {user.email}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 font-bold text-xs uppercase tracking-wide">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Secure Login
                </div>
            </header>

            {/* Announcements Banner */}
            {announcements.length > 0 && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                        Company Announcements
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {announcements.map(a => (
                            <div key={a._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">
                                <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide mb-3 ${a.type === 'Alert' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>{a.type}</span>
                                <h4 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{a.title}</h4>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{a.content}</p>
                                <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-medium text-gray-400">
                                    <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                                    <span className="text-indigo-600 hover:underline cursor-pointer">Read More →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Daily Marking Card */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform"></div>

                    <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 z-10">Attendance</h3>
                    <h1 className="text-6xl font-black text-gray-900 mb-2 z-10 font-mono tracking-tight">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </h1>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-8 z-10">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>

                    <div className="w-full max-w-xs flex flex-col gap-3 z-10">
                        {todayMarked ? (
                            <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-6 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                                <span className="text-lg">✓</span> Marked Present
                            </div>
                        ) : (
                            <button onClick={() => markAttendance('Present')} disabled={marking} className="bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98]">
                                {marking ? 'Marking...' : 'Mark Present'}
                            </button>
                        )}

                        <button
                            onClick={() => setShowLeaveModal(true)}
                            className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 w-full py-4 rounded-xl font-bold text-sm transition-all"
                        >
                            Request Time Off
                        </button>
                    </div>
                </div>

                {/* Leave Status & History */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Leave Status</h2>
                            <a href="/employee-dashboard/leaves" className="text-xs font-bold text-indigo-600 hover:underline">View All →</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            {leaves.length === 0 ? (
                                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                                    <p className="text-gray-400 font-medium text-sm italic">No recent leave requests</p>
                                </div>
                            ) : (
                                leaves.slice(0, 2).map(l => (
                                    <div key={l._id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                                                {l.type[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm mb-0.5">{l.type} Leave</p>
                                                <span className="text-xs font-medium text-gray-500">{new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : l.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                                            {l.status}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Recent Logs</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        <th className="px-6 py-3 font-semibold">Date</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Check In</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map(a => (
                                        <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">{new Date(a.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${a.status === 'Present' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-amber-600 bg-amber-50 border border-amber-100'}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-mono text-gray-500">
                                                {a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Leave Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 animate-fade-in relative">
                        <button onClick={() => setShowLeaveModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-xl">✕</button>

                        <div className="mb-8">
                            <h3 className="text-indigo-600 font-bold text-xs uppercase tracking-wide mb-1">New Request</h3>
                            <h1 className="text-2xl font-bold text-gray-900">Apply for Leave</h1>
                        </div>

                        <form onSubmit={submitLeave} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Leave Type</label>
                                <select className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}>
                                    <option>Annual</option>
                                    <option>Sick</option>
                                    <option>Unpaid</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">From</label>
                                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500" required onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase text-gray-500">To</label>
                                    <input type="date" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500" required onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase text-gray-500">Reason</label>
                                <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-500" placeholder="Why are you taking leave?" style={{ minHeight: '100px' }} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-4 mt-4">
                                <button type="button" onClick={() => setShowLeaveModal(false)} className="flex-1 py-3 rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-[2] py-3 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
