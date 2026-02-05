"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeAttendancePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMe();
    }, []);

    async function fetchMe() {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
            fetchAttendance(data.user.id);
        } else {
            router.push('/login');
        }
    }

    async function fetchAttendance(id) {
        const res = await fetch(`/api/attendance?employeeId=${id}`);
        const data = await res.json();
        if (data.success) {
            setAttendance(data.data);
            setLoading(false);
        }
    }

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><h2>Loading Session Logs...</h2></div>;

    return (
        <div className="animate-fade">
            <div style={{ marginBottom: '3rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Personal Records</span>
                <h1>My Attendance History</h1>
                <p style={{ color: 'var(--text-muted)' }}>Detailed log of all your recorded sessions</p>
            </div>

            <div className="glass-card">
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>DATE</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>STATUS</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>CHECK-IN</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>UPDATED AT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '5rem', textAlign: 'center' }}>No attendance records found.</td></tr>
                            ) : (
                                attendance.map(a => (
                                    <tr key={a._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.2rem', fontWeight: '500' }}>
                                            {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span className={`badge ${a.status === 'Present' ? 'badge-success' : 'badge-danger'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : '-'}</td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            {new Date(a.updatedAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
