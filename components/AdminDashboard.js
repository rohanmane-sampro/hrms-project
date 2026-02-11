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
                        text: `${l.employeeId?.firstName || 'Employee'} requested ${l.type} leave`,
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
            <h2 className="text-xl font-medium text-gray-400 animate-pulse">Loading Dashboard...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Admin Dashboard</h3>
                    <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
                    <p className="text-gray-600 max-w-md">View company statistics, employee attendance, and recent updates at a glance.</p>
                </div>
                <div className="flex gap-4">
                    <a href="/employees" className="btn-action btn-primary">+ Add New Employee</a>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Main Stats */}
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <StatCard title="Total Employees" value={stats.totalEmployees} icon="👥" color="indigo" />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <StatCard title="Total Present" value={stats.present} icon="✅" color="green" />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <StatCard title="Employees on Leave" value={stats.leaves} icon="🗓️" color="amber" />
                </div>
                <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <StatCard title="Recent Hires" value={`+${stats.newJoinees}`} icon="📈" color="cyan" />
                </div>

                {/* Real-time Activity Feed */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Requests</h2>
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs font-bold rounded border border-green-100 uppercase tracking-wide">Live</span>
                    </div>
                    <div className="flex flex-col gap-0">
                        {activities.length === 0 ? (
                            <p className="text-gray-400 text-center py-8 italic">No recent requests...</p>
                        ) : (
                            activities.map((activity, index) => (
                                <ActivityLine
                                    key={activity.id}
                                    text={activity.text}
                                    status={activity.status}
                                    time={activity.time}
                                    isLast={index === activities.length - 1}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* Dept Stats */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Department Distribution</h2>
                    <div className="flex flex-col gap-6">
                        {stats.departmentStats.length === 0 ? <p className="text-gray-400 text-center py-8 italic">No data available...</p> : (
                            stats.departmentStats.map(dept => (
                                <DeptBar
                                    key={dept.name}
                                    name={dept.name || 'Core'}
                                    count={dept.count}
                                    percent={(dept.count / (stats.totalEmployees || 1)) * 100}
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
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100'
    };

    return (
        <div className={`h-full p-6 rounded-xl border ${colors[color]} transition-all hover:shadow-md`}>
            <div className="flex justify-between items-start mb-4">
                <div className="text-3xl bg-white rounded-lg p-2 shadow-sm">{icon}</div>
            </div>
            <div>
                <h1 className="text-4xl font-bold mb-1 text-gray-900">{value}</h1>
                <p className="text-xs font-bold uppercase tracking-wider opacity-70">{title}</p>
            </div>
        </div>
    );
}

function ActivityLine({ text, status, time, isLast }) {
    const statusColors = {
        'Approved': 'bg-emerald-100 text-emerald-700',
        'Pending': 'bg-amber-100 text-amber-700',
        'Rejected': 'bg-red-100 text-red-700'
    };

    return (
        <div className={`flex justify-between items-center py-4 ${!isLast ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors px-2 rounded-lg`}>
            <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <div>
                    <p className="font-semibold text-sm text-gray-800 mb-0.5">{text}</p>
                    <span className="text-xs text-gray-500 font-medium">{time}</span>
                </div>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${statusColors[status] || 'bg-gray-100 text-gray-600'}`}>
                {status || 'INFO'}
            </span>
        </div>
    );
}

function DeptBar({ name, count, percent }) {
    return (
        <div className="group">
            <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-xs uppercase tracking-wider text-gray-600">{name}</span>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{count}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}
