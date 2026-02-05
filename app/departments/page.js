"use client";
import { useState, useEffect } from 'react';

export default function DepartmentsPage() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/stats')
            .then(res => res.json())
            .then(data => {
                if (data.success) setStats(data.data.departmentStats);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="animate-fade">
            <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div>
                    <h1>Department Hub</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Corporate structural breakdown and saturation</p>
                </div>
                <button className="btn-premium">+ New Department</button>
            </div>

            <div className="grid grid-3">
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center' }}><h2>Loading structures...</h2></div>
                ) : stats.length === 0 ? (
                    <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center' }}>
                        <p>No organizational data found. Add employees to generate department nodes.</p>
                    </div>
                ) : (
                    stats.map((dept) => (
                        <div key={dept.name} className="glass-card" style={{ position: 'relative', overflow: 'hidden' }}>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '4px',
                                height: '100%',
                                background: 'var(--grad-primary)'
                            }}></div>

                            <h3 style={{ marginBottom: '0.5rem' }}>{dept.name || 'Core Operations'}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Primary Business Unit</p>

                            <div className="flex justify-between items-end">
                                <div>
                                    <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{dept.count}</span>
                                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Talent</p>
                                </div>
                                <button className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>View Roster</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
