"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
    const router = useRouter();
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
        if (data.success) setAnnouncements(data.data.slice(0, 3)); // Show top 3
    }

    async function fetchMe() {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
            fetchAttendance(data.user.id);
            fetchLeaves(data.user.id);
        } else {
            router.push('/login');
        }
    }

    async function fetchAttendance(id) {
        const res = await fetch(`/api/attendance?employeeId=${id}`);
        const data = await res.json();
        if (data.success) setAttendance(data.data.slice(0, 5)); // Just the last 5
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
            <h2 className="text-2xl font-black animate-pulse opacity-50 uppercase tracking-[0.3em] text-white">Loading Portal...</h2>
        </div>
    );

    const todayMarked = attendance.some(a => new Date(a.date).toDateString() === new Date().toDateString());

    return (
        <div className="flex flex-col gap-12 animate-fade-in pb-24">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Employee Portal</h3>
                    <h1 className="text-6xl font-black text-white">Welcome, {user.name.split(' ')[0]}</h1>
                    <p className="max-w-md font-medium text-gray-500 uppercase tracking-widest text-[10px]">{user.role} | {user.email}</p>
                </div>
                <div className="badge-premium bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 flex items-center gap-4 px-8 py-5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] animate-pulse"></div>
                    SECURE LOGIN
                </div>
            </header>

            {/* Announcements Banner */}
            {announcements.length > 0 && (
                <div className="flex flex-col gap-6">
                    <h2 className="text-2xl font-black mb-2 flex items-center gap-4 text-white">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                        COMPANY ANNOUNCEMENTS
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {announcements.map(a => (
                            <div key={a._id} className="bento-card border-indigo-600/10 p-8 hover:scale-[1.02] transition-transform">
                                <span className={`badge-premium text-[10px] ${a.type === 'Alert' ? 'bg-red-600/20 text-red-500' : 'bg-indigo-600/20 text-indigo-400'}`}>[{a.type.toUpperCase()}]</span>
                                <h4 className="text-xl font-black mt-6 mb-3 uppercase tracking-tight leading-tight text-white">{a.title}</h4>
                                <p className="text-sm font-medium line-clamp-2 opacity-60 mb-6 leading-relaxed">{a.content}</p>
                                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{new Date(a.createdAt).toLocaleDateString()}</span>
                                    <span className="text-indigo-400 text-xs font-black uppercase tracking-widest cursor-pointer hover:underline underline-offset-4">Read More →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Daily Marking Card */}
                <div className="col-span-12 lg:col-span-4 bento-card bg-indigo-600/5 border-indigo-600/20 flex flex-col items-center justify-center py-16 text-center group relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full"></div>
                    <h3 className="text-indigo-400 mb-2 relative">ATTENDANCE</h3>
                    <h1 className="text-8xl font-black mb-1 p-0 leading-none group-hover:scale-105 transition-transform duration-700 relative text-white">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </h1>
                    <p className="text-sm font-black uppercase tracking-[0.4em] text-gray-500 mb-12 relative">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>

                    <div className="w-full max-w-xs flex flex-col gap-4 relative">
                        {todayMarked ? (
                            <div className="badge-premium bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 px-12 py-5 rounded-3xl flex items-center justify-center gap-3 font-black tracking-widest">
                                <span className="text-2xl">✓</span> ATTENDANCE MARKED
                            </div>
                        ) : (
                            <button onClick={() => markAttendance('Present')} disabled={marking} className="btn-action btn-primary w-full py-6 shadow-glow">
                                {marking ? 'MARKING...' : 'MARK ATTENDANCE'}
                            </button>
                        )}

                        <button
                            onClick={() => setShowLeaveModal(true)}
                            className="btn-action btn-ghost w-full py-6 font-black tracking-widest text-white"
                        >
                            REQUEST LEAVE
                        </button>
                    </div>
                </div>

                {/* Leave Status & History */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <div className="bento-card flex-1">
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="text-2xl font-black mb-0 text-white">LEAVE STATUS</h2>
                            <a href="/employee-dashboard/leaves" className="text-[10px] font-black uppercase text-indigo-400 tracking-widest hover:underline">View All Requests →</a>
                        </div>
                        <div className="flex flex-col gap-6">
                            {leaves.length === 0 ? (
                                <div className="border border-dashed border-white/10 rounded-3xl p-16 text-center">
                                    <p className="opacity-30 font-black tracking-[0.3em] uppercase italic text-sm text-white">No leave requests found</p>
                                </div>
                            ) : (
                                leaves.slice(0, 2).map(l => (
                                    <div key={l._id} className="flex justify-between items-center p-8 glass-panel hover:bg-white/5 transition-all group">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/20 flex items-center justify-center font-black text-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                {l.type[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-xl font-black uppercase tracking-tighter text-white">{l.type} LEAVE</p>
                                                <span className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">{new Date(l.startDate).toLocaleDateString()} <span className="text-indigo-400">→</span> {new Date(l.endDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <span className={`badge-premium px-8 py-3 rounded-2xl ${l.status === 'Approved' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-600/20' : l.status === 'Pending' ? 'bg-amber-600/20 text-amber-500 border-amber-600/20' : 'bg-red-600/20 text-red-400 border-red-600/20'}`}>
                                            {l.status.toUpperCase()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Attendance History */}
                    <div className="bento-card overflow-hidden p-0 bg-black/40">
                        <div className="px-8 pt-8 pb-4 border-b border-white/5">
                            <h2 className="text-xl font-black mb-0 uppercase text-white">Recent Attendance Logs</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                        <th className="p-6">DATE</th>
                                        <th className="p-6">STATUS</th>
                                        <th className="p-6">CHECK-IN TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendance.map(a => (
                                        <tr key={a._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                            <td className="p-6 text-sm font-black text-white">{new Date(a.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</td>
                                            <td className="p-6">
                                                <span className={`badge-premium text-[10px] ${a.status === 'Present' ? 'text-emerald-400' : 'text-amber-500'}`}>
                                                    {a.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-6 text-[10px] font-mono text-indigo-400 opacity-60">
                                                {a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---'}
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
                <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[99999] flex items-center justify-center p-8 animate-fade-in">
                    <div className="bento-card w-full max-w-xl border-white/10 ring-1 ring-white/10 shadow-2xl p-12">
                        <div className="flex justify-between items-start mb-16">
                            <div>
                                <h3 className="text-indigo-400 mb-1">Leave Request</h3>
                                <h1 className="text-5xl font-black mb-0 text-white">Request Time Off</h1>
                            </div>
                            <button onClick={() => setShowLeaveModal(false)} className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-xl border border-white/10 text-white">✕</button>
                        </div>

                        <form onSubmit={submitLeave} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-6">Leave Type</label>
                                <select className="glass-input py-6 text-xl text-white" value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}>
                                    <option className="bg-black">Annual</option>
                                    <option className="bg-black">Sick</option>
                                    <option className="bg-black">Unpaid</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-6">Start Date</label>
                                    <input type="date" className="glass-input py-6 text-white" required onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-6">End Date</label>
                                    <input type="date" className="glass-input py-6 text-white" required onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 px-6">Reason for Leave</label>
                                <textarea className="glass-input p-6 text-sm text-white" placeholder="Provide a reason for your leave request..." style={{ minHeight: '140px' }} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}></textarea>
                            </div>
                            <div className="flex gap-6 pt-12 mt-4 border-t border-white/10">
                                <button type="button" onClick={() => setShowLeaveModal(false)} className="btn-action btn-ghost flex-1 py-6 font-black uppercase tracking-widest text-white">Cancel</button>
                                <button type="submit" className="btn-action btn-primary flex-[2] py-6 font-black uppercase tracking-widest shadow-glow">Submit Leave</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
