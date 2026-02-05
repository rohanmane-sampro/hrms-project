"use client";
import { useState, useEffect } from 'react';

export default function AttendancePage() {
    const [employees, setEmployees] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        try {
            const dateStr = new Date().toISOString().split('T')[0];
            const [empRes, attRes] = await Promise.all([
                fetch('/api/employees'),
                fetch(`/api/attendance?date=${dateStr}`)
            ]);
            const empData = await empRes.json();
            const attData = await attRes.json();

            if (empData.success) setEmployees(empData.data);
            if (attData.success) setAttendanceList(attData.data);
        } finally {
            setLoading(false);
        }
    }

    async function markAttendance(employeeId, status) {
        try {
            const res = await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ employeeId, status })
            });
            const data = await res.json();
            if (data.success) {
                fetchInitialData();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="animate-fade">
            <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1>Presence Control</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Daily operations and availability tracker</p>
                </div>
                <div style={{ color: 'var(--primary)', fontWeight: '700' }}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0' }}>
                {loading ? <p style={{ padding: '3rem', textAlign: 'center' }}>Synchronizing...</p> : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>SPECIALIST</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>AVAILABILITY</th>
                                <th style={{ padding: '1.2rem', color: 'var(--text-muted)', textAlign: 'center' }}>QUICK ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr><td colSpan="3" style={{ padding: '3rem', textAlign: 'center' }}>No workforce records available.</td></tr>
                            ) : (
                                employees.map((emp) => {
                                    const record = attendanceList.find(a =>
                                        a.employeeId && (a.employeeId._id === emp._id || a.employeeId === emp._id) &&
                                        new Date(a.date).toDateString() === new Date().toDateString()
                                    );
                                    return (
                                        <tr key={emp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1.2rem' }}>
                                                <p style={{ fontWeight: '600' }}>{emp.firstName} {emp.lastName}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.department}</span>
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                {record ? (
                                                    <div className="flex items-center gap-2">
                                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: record.status === 'Present' ? 'var(--success)' : 'var(--danger)' }}></div>
                                                        <span style={{ fontWeight: 'bold' }}>{record.status}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({new Date(record.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>Awaiting Check-in</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div className="flex gap-3 justify-center">
                                                    <button onClick={() => markAttendance(emp._id, 'Present')} className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', borderColor: 'var(--success)', color: 'var(--success)' }}>Check In</button>
                                                    <button onClick={() => markAttendance(emp._id, 'Absent')} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', border: 'none', cursor: 'pointer', borderRadius: '50px' }}>Mark Absent</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
