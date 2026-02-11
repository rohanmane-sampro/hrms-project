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

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <h2 className="text-xl font-bold animate-pulse text-indigo-500">Loading History...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-24">
            <header className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">My Records</h3>
                    <h1 className="text-3xl font-bold text-gray-900">Attendance History</h1>
                    <p className="text-gray-500 font-medium text-sm">View your daily check-ins and status logs.</p>
                </div>
                <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-600 font-bold text-xs uppercase tracking-wide">
                    Live Sync
                </div>
            </header>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        Data Logs
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Time In</th>
                                <th className="px-6 py-4">Last Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length === 0 ? (
                                <tr><td colSpan="4" className="p-12 text-center text-gray-400 font-medium italic">No attendance records found.</td></tr>
                            ) : (
                                attendance.map(a => (
                                    <tr key={a._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${a.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : a.status === 'Half-Day' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-gray-600 font-bold bg-gray-50/50 rounded-lg">
                                            {a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400 font-medium">
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
