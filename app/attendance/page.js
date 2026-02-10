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

            if (empData.success) {
                // Filter out Admin accounts
                const filteredEmployees = empData.data.filter(e => e.role !== 'Admin' && e.email !== 'admin@hrms.com');
                setEmployees(filteredEmployees);
            }
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
        <div className="flex flex-col gap-12 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Operational Status</h3>
                    <h1>Presence Control</h1>
                    <p className="max-w-md">Real-time availability monitoring and active duty tracking.</p>
                </div>
                <div className="bento-card py-4 px-8 bg-indigo-600/10 border-indigo-600/20 translate-y-0 hover:translate-y-0 text-indigo-400 font-black tracking-widest text-sm uppercase">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </header>

            <div className="bento-card overflow-hidden p-0 border-white/5 bg-black/20">
                {loading ? (
                    <div className="p-24 text-center">
                        <h2 className="text-xl font-black opacity-30 tracking-widest animate-pulse uppercase">Synchronizing Neural Link...</h2>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                <th className="p-6">SPECIALIST UNIT</th>
                                <th className="p-6">AVAILABILITY HEX</th>
                                <th className="p-6 text-center">OVERRIDE COMMANDS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr><td colSpan="3" className="p-24 text-center text-xl font-black opacity-30 tracking-widest uppercase">ZERO ACTIVE UNITS FOUND</td></tr>
                            ) : (
                                employees.map((emp) => {
                                    const record = attendanceList.find(a =>
                                        a.employeeId && (a.employeeId._id === emp._id || a.employeeId === emp._id) &&
                                        new Date(a.date).toDateString() === new Date().toDateString()
                                    );

                                    let badgeClass = 'bg-white/5 text-gray-500';
                                    let glowClass = 'bg-gray-500 shadow-none';

                                    if (record) {
                                        if (record.status === 'Present') {
                                            badgeClass = 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30';
                                            glowClass = 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]';
                                        } else if (record.status === 'Absent') {
                                            badgeClass = 'bg-red-600/20 text-red-400 border-red-600/30';
                                            glowClass = 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]';
                                        } else if (record.status === 'Half-Day') {
                                            badgeClass = 'bg-amber-600/20 text-amber-400 border-amber-600/30';
                                            glowClass = 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]';
                                        }
                                    }

                                    return (
                                        <tr key={emp._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                            <td className="p-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white text-lg">
                                                        {emp.firstName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-lg uppercase tracking-tight leading-none mb-1">{emp.firstName} {emp.lastName}</p>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 opacity-60">{emp.department}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {record ? (
                                                    <div className={`badge-premium ${badgeClass} border inline-flex items-center gap-3`}>
                                                        <div className={`w-2 h-2 rounded-full ${glowClass}`}></div>
                                                        <span className="mr-2 uppercase tracking-widest">{record.status}</span>
                                                        <span className="opacity-40 font-mono">[{new Date(record.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 text-gray-600 uppercase font-black text-xs tracking-widest animate-pulse">
                                                        <div className="w-2 h-2 rounded-full bg-gray-700"></div>
                                                        Awaiting Status...
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button onClick={() => markAttendance(emp._id, 'Present')} className="btn-action bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white px-4 py-2 border border-emerald-600/20 text-xs shadow-lg shadow-emerald-600/5">CHECK IN</button>
                                                    <button onClick={() => markAttendance(emp._id, 'Half-Day')} className="btn-action bg-amber-600/10 text-amber-500 hover:bg-amber-600 hover:text-white px-4 py-2 border border-amber-600/20 text-xs">PARTIAL</button>
                                                    <button onClick={() => markAttendance(emp._id, 'Absent')} className="btn-action bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 border border-red-600/20 text-xs shadow-lg shadow-red-600/5">VOID</button>
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
