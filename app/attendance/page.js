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
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Daily Overview</h3>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
                    <p className="text-gray-500">Track employee availability and status for today.</p>
                </div>
                <div className="bg-white border border-gray-200 px-6 py-3 rounded-lg shadow-sm text-gray-700 font-medium text-sm">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <h2 className="text-lg font-medium text-gray-400 animate-pulse">Loading data...</h2>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="p-6">Employee</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-center">Mark Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr><td colSpan="3" className="p-12 text-center text-gray-400">No employees found.</td></tr>
                            ) : (
                                employees.map((emp) => {
                                    const record = attendanceList.find(a =>
                                        a.employeeId && (a.employeeId._id === emp._id || a.employeeId === emp._id) &&
                                        new Date(a.date).toDateString() === new Date().toDateString()
                                    );

                                    let statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Not Marked</span>;

                                    if (record) {
                                        if (record.status === 'Present') {
                                            statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Present</span>;
                                        } else if (record.status === 'Absent') {
                                            statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Absent</span>;
                                        } else if (record.status === 'Half-Day') {
                                            statusBadge = <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Half Day</span>;
                                        }
                                    }

                                    return (
                                        <tr key={emp._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                        {emp.firstName[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{emp.firstName} {emp.lastName}</p>
                                                        <p className="text-xs text-gray-500">{emp.department}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {statusBadge}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex gap-2 justify-center">
                                                    <button onClick={() => markAttendance(emp._id, 'Present')} className="px-4 py-2 rounded-lg text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-colors">Present</button>
                                                    <button onClick={() => markAttendance(emp._id, 'Half-Day')} className="px-4 py-2 rounded-lg text-xs font-medium bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition-colors">Half Day</button>
                                                    <button onClick={() => markAttendance(emp._id, 'Absent')} className="px-4 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors">Absent</button>
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
