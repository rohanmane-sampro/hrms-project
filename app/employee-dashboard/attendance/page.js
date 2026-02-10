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
            <h2 className="text-2xl font-black animate-pulse opacity-50 uppercase tracking-[0.3em]">Accessing Session History...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-12 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Personal Records</h3>
                    <h1>Session History</h1>
                    <p className="max-w-md">Detailed cryptographic log of all your recorded operational sessions.</p>
                </div>
                <div className="badge-premium bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 px-8 py-4">
                    SYNCED: {new Date().toLocaleTimeString()}
                </div>
            </header>

            <div className="bento-card overflow-hidden p-0 border-white/5 bg-black/20">
                <div className="px-8 pt-8 pb-4 border-b border-white/5 bg-white/5">
                    <h2 className="text-xl font-black mb-0 flex items-center gap-4 text-white">
                        <div className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                        DATA LOG ENTRIES
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                <th className="p-6">CYCLE DATE</th>
                                <th className="p-6">STATUS CODE</th>
                                <th className="p-6">CHECK-IN TIME</th>
                                <th className="p-6">LAST METADATA UPDATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.length === 0 ? (
                                <tr><td colSpan="4" className="p-24 text-center text-xl font-black opacity-30 tracking-widest italic uppercase">Zero session logs detected.</td></tr>
                            ) : (
                                attendance.map(a => (
                                    <tr key={a._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-6 text-sm font-black text-white group-hover:text-cyan-400 transition-colors">
                                            {new Date(a.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-6">
                                            <span className={`badge-premium ${a.status === 'Present' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30' : a.status === 'Half-Day' ? 'bg-amber-600/20 text-amber-500 border-amber-600/30' : 'bg-red-600/20 text-red-500 border-red-600/30'}`}>
                                                {a.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-6 font-mono text-indigo-400">
                                            {a.checkIn ? new Date(a.checkIn).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' }) : 'NULL'}
                                        </td>
                                        <td className="p-6 text-xs text-gray-500 font-medium">
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
