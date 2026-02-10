"use client";
import { useState, useEffect } from 'react';

export default function AdminDashboard({ user }) {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        present: 0,
        leaves: 0,
        newJoinees: 0,
        departmentStats: []
    });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch stats and recent leaves for "activity"
                const [statsRes, leavesRes] = await Promise.all([
                    fetch('/api/stats'),
                    fetch('/api/leaves')
                ]);

                const statsData = await statsRes.json();
                const leavesData = await leavesRes.json();

                if (statsData.success) {
                    setStats(statsData.data);
                }

                if (leavesData.success) {
                    // Map leaves to activity feed items
                    const recentLeaves = leavesData.data.slice(0, 5).map(l => ({
                        id: l._id,
                        text: `${l.employeeId?.name || 'Employee'} requested ${l.type} leave`,
                        status: l.status,
                        time: new Date(l.createdAt).toLocaleDateString(),
                        type: 'leave'
                    }));
                    setActivities(recentLeaves);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <h2 className="text-2xl font-black animate-pulse opacity-50 uppercase tracking-[0.3em] text-white">Loading Dashboard...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-12 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Admin Dashboard</h3>
                    <h1 className="text-7xl font-black text-white">System Overview</h1>
                    <p className="max-w-md">View company statistics, employee attendance, and recent updates at a glance.</p>
                </div>
                <div className="flex gap-4">
                    <a href="/employees" className="btn-action btn-primary">+ Add New Employee</a>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-12 gap-8 auto-rows-[280px]">
                {/* Main Stats */}
                <div className="col-span-12 lg:col-span-3">
                    <StatCard title="Total Employees" value={stats.totalEmployees} icon="👥" color="indigo" />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <StatCard title="Total Present" value={stats.present} icon="✅" color="emerald" />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <StatCard title="Employees on Leave" value={stats.leaves} icon="🗓️" color="amber" />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <StatCard title="Recent Hires" value={`+${stats.newJoinees}`} icon="📈" color="cyan" />
                </div>

                {/* Real-time Activity Feed */}
                <div className="col-span-12 lg:col-span-7 row-span-2 bento-card">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black mb-0 uppercase tracking-tighter text-white">Recent Requests</h2>
                        <span className="badge-premium bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">Live Sync</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {activities.length === 0 ? (
                            <p className="opacity-30 font-black tracking-widest text-center py-12 uppercase italic text-white">No recent requests...</p>
                        ) : (
                            activities.map(activity => (
                                <ActivityLine
                                    key={activity.id}
                                    text={activity.text}
                                    status={activity.status}
                                    time={activity.time}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Dept Stats */}
                <div className="col-span-12 lg:col-span-5 row-span-2 bento-card bg-indigo-600/5">
                    <h2 className="text-2xl font-black mb-10 uppercase tracking-tighter text-white">Department Distribution</h2>
                    <div className="flex flex-col gap-10">
                        {stats.departmentStats.length === 0 ? <p className="opacity-50 font-black tracking-widest text-center py-12 uppercase italic text-white">No data available...</p> : (
                            stats.departmentStats.map(dept => (
                                <DeptBar
                                    key={dept.name}
                                    name={dept.name || 'Core'}
                                    count={dept.count}
                                    percent={`${(dept.count / (stats.totalEmployees || 1)) * 100}%`}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    const colors = {
        indigo: 'from-indigo-600/20 to-indigo-900/10 border-indigo-500/20 text-indigo-400',
        emerald: 'from-emerald-600/20 to-emerald-900/10 border-emerald-500/20 text-emerald-400',
        amber: 'from-amber-600/20 to-amber-900/10 border-amber-500/20 text-amber-500',
        cyan: 'from-cyan-600/20 to-cyan-900/10 border-cyan-500/20 text-cyan-400'
    };

    return (
        <div className={`bento-card h-full flex flex-col justify-between bg-gradient-to-br ${colors[color]}`}>
            <div className="text-4xl filter drop-shadow-md">{icon}</div>
            <div>
                <h1 className="text-7xl font-black mb-1 p-0 leading-none tracking-tighter text-white">{value}</h1>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 m-0 leading-none">{title}</p>
            </div>
        </div>
    );
}

function ActivityLine({ text, status, time }) {
    const statusColors = {
        'Approved': 'bg-emerald-600/20 text-emerald-400',
        'Pending': 'bg-amber-600/20 text-amber-500',
        'Rejected': 'bg-red-600/20 text-red-500'
    };

    return (
        <div className="flex justify-between items-center p-6 glass-panel hover:bg-white/5 transition-all group cursor-pointer border-white/5">
            <div className="flex items-center gap-6">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] animate-pulse"></div>
                <div>
                    <p className="font-black text-sm uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors leading-none mb-1">{text}</p>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-black opacity-50">{time}</span>
                </div>
            </div>
            <span className={`badge-premium ${statusColors[status] || 'bg-indigo-600/20 text-indigo-400'}`}>
                {status?.toUpperCase() || 'INFO'}
            </span>
        </div>
    );
}

function DeptBar({ name, count, percent }) {
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-4">
                <span className="font-black uppercase tracking-[0.2em] text-[11px] text-white group-hover:text-indigo-400 transition-all">{name}</span>
                <span className="text-[10px] font-black text-indigo-400 p-1 px-3 bg-indigo-500/10 rounded-lg">{count} EMPLOYEES</span>
            </div>
            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    style={{ width: percent }}
                ></div>
            </div>
        </div>
    );
}
