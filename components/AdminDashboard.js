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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/stats');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch stats");
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><h2>Syncing Workspace...</h2></div>;

    return (
        <div className="animate-fade">
            <div className="flex justify-between items-center" style={{ marginBottom: '4rem' }}>
                <div>
                    <h1>Workforce Overview</h1>
                    <p>Real-time insights into your global team operations</p>
                </div>
                <div className="flex gap-4">
                    <button className="btn-outline" onClick={async () => {
                        await fetch('/api/auth/logout', { method: 'POST' });
                        window.location.href = '/login';
                    }}>Sign Out</button>
                    <a href="/employees" className="btn-premium" style={{ textDecoration: 'none' }}>+ Onboard Employee</a>
                </div>
            </div>

            <div className="grid grid-4" style={{ marginBottom: '4rem' }}>
                <StatCard title="Total Employees" value={stats.totalEmployees} icon="👥" color="#4f46e5" />
                <StatCard title="Present Now" value={stats.present} icon="✅" color="#10b981" />
                <StatCard title="On Leave" value={stats.leaves} icon="🗓️" color="#f59e0b" />
                <StatCard title="Monthly Growth" value={stats.newJoinees} icon="📈" color="#6366f1" />
            </div>

            <div className="grid grid-2">
                <div className="glass-card">
                    <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
                        <h3>Recent Activity</h3>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Live Updates</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <ActivityLine text="System security check complete" status="Successful" time="12m ago" />
                        <ActivityLine text="Safety protocols distributed" status="Active" time="45m ago" />
                        <ActivityLine text="Cloud infrastructure scaled" status="Successful" time="2h ago" />
                        <ActivityLine text="New department 'Cloud Ops' initialized" status="Successful" time="3h ago" />
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '2rem' }}>Department Statistics</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {stats.departmentStats.length === 0 ? <p>No data recorded yet.</p> : (
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
    return (
        <div className="glass-card flex items-center gap-6" style={{ padding: '2rem' }}>
            <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                background: `${color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                color: color
            }}>
                {icon}
            </div>
            <div>
                <h2 style={{ marginBottom: '0', fontSize: '1.75rem', fontWeight: '700' }}>{value}</h2>
                <p style={{ fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
            </div>
        </div>
    );
}

function ActivityLine({ text, status, time }) {
    return (
        <div className="flex justify-between items-center" style={{ paddingBottom: '1.2rem', borderBottom: '1px solid var(--border)' }}>
            <div>
                <p style={{ fontWeight: '500', fontSize: '0.95rem', color: 'var(--text-main)' }}>{text}</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{time}</span>
            </div>
            <span className={`badge ${status === 'Successful' ? 'badge-success' : 'badge-danger'}`}>{status}</span>
        </div>
    );
}

function DeptBar({ name, count, percent }) {
    return (
        <div>
            <div className="flex justify-between" style={{ marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{name}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{count} experts</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '50px', overflow: 'hidden' }}>
                <div style={{
                    width: percent,
                    height: '100%',
                    background: 'var(--primary)',
                    borderRadius: '50px'
                }}></div>
            </div>
        </div>
    );
}
