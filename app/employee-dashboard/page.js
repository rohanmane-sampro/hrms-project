"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
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
    }, []);

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
            alert('Leave request submitted!');
            setShowLeaveModal(false);
            fetchLeaves(user.id);
        }
    }

    if (!user) return <div style={{ textAlign: 'center', padding: '10rem' }}><h2>Synchronizing Portal...</h2></div>;

    const todayMarked = attendance.some(a => new Date(a.date).toDateString() === new Date().toDateString());

    return (
        <div className="animate-fade">
            {/* Header */}
            <div className="flex justify-between items-end" style={{ marginBottom: '3rem' }}>
                <div>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Member Access</span>
                    <h1>Welcome, {user.name}</h1>
                    <p style={{ color: 'var(--text-muted)' }}>{user.role} | {user.email}</p>
                </div>
                <div className="glass-card" style={{ padding: '0.8rem 1.5rem', borderRadius: '50px' }}>
                    <span style={{ color: 'var(--success)' }}>●</span> System Active
                </div>
            </div>

            <div className="grid grid-2">
                {/* Quick Actions */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Daily Presence</h3>
                    <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <h2 style={{ marginBottom: '1rem' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</h2>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}</p>

                        {todayMarked ? (
                            <div className="badge badge-success" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                                ✓ Check-in Complete
                            </div>
                        ) : (
                            <button onClick={() => markAttendance('Present')} disabled={marking} className="btn-premium" style={{ width: '100%', justifyContent: 'center' }}>
                                {marking ? 'Signing in...' : 'Register Attendance'}
                            </button>
                        )}
                    </div>
                    <button
                        onClick={() => setShowLeaveModal(true)}
                        className="btn-outline"
                        style={{ width: '100%', marginTop: '1.5rem', justifyContent: 'center' }}
                    >
                        Request Time Off
                    </button>
                </div>

                {/* Leave Status */}
                <div className="glass-card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Leave Management</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {leaves.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No recent leave requests.</p>
                        ) : (
                            leaves.map(l => (
                                <div key={l._id} className="flex justify-between items-center" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem' }}>
                                    <div>
                                        <p style={{ fontWeight: '600' }}>{l.type} Holiday</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`badge ${l.status === 'Approved' ? 'badge-success' : 'badge-danger'}`} style={{ background: l.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : '', color: l.status === 'Pending' ? 'var(--warning)' : '' }}>
                                        {l.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* History */}
                <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity Logs</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>Date</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>Status</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>Recorded At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map(a => (
                                <tr key={a._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.2rem' }}>{new Date(a.date).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.2rem' }}><span className={`badge ${a.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>{a.status}</span></td>
                                    <td style={{ padding: '1.2rem' }}>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Leave Modal */}
            {showLeaveModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
                    <div className="glass-card animate-fade" style={{ width: '500px' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Apply for Leave</h2>
                        <form onSubmit={submitLeave} className="flex flex-col gap-5">
                            <select className="input-premium" value={leaveForm.type} onChange={e => setLeaveForm({ ...leaveForm, type: e.target.value })}>
                                <option>Annual</option>
                                <option>Sick</option>
                                <option>Unpaid</option>
                            </select>
                            <div className="grid grid-2">
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start Date</label>
                                    <input type="date" className="input-premium" required onChange={e => setLeaveForm({ ...leaveForm, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>End Date</label>
                                    <input type="date" className="input-premium" required onChange={e => setLeaveForm({ ...leaveForm, endDate: e.target.value })} />
                                </div>
                            </div>
                            <textarea className="input-premium" placeholder="Reason for leave" style={{ minHeight: '100px' }} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })}></textarea>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowLeaveModal(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn-premium" style={{ flex: 1, justifyContent: 'center' }}>Submit Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
