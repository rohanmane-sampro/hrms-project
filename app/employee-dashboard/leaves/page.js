"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeLeavesPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ type: 'Annual', startDate: '', endDate: '', reason: '' });

    useEffect(() => { fetchMe(); }, []);

    async function fetchMe() {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success) {
            setUser(data.user);
            fetchLeaves(data.user.id);
        } else {
            router.push('/login');
        }
    }

    async function fetchLeaves(id) {
        const res = await fetch(`/api/leaves?employeeId=${id}`);
        const data = await res.json();
        if (data.success) {
            setLeaves(data.data);
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch('/api/leaves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, employeeId: user.id })
        });
        const data = await res.json();
        if (data.success) {
            setShowModal(false);
            setForm({ type: 'Annual', startDate: '', endDate: '', reason: '' });
            fetchLeaves(user.id);
        }
    }

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><h2>Syncing Leave Data...</h2></div>;

    return (
        <div className="animate-fade">
            <div className="flex justify-between items-center" style={{ marginBottom: '3rem' }}>
                <div>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Time Off</span>
                    <h1>Leave Applications</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and track your absence requests</p>
                </div>
                <button className="btn-premium" onClick={() => setShowModal(true)}>+ New Application</button>
            </div>

            <div className="grid grid-3" style={{ marginBottom: '3rem' }}>
                <div className="glass-card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Remaining Annual</p>
                    <h2>18 Days</h2>
                </div>
                <div className="glass-card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Used This Year</p>
                    <h2>4 Days</h2>
                </div>
                <div className="glass-card">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Requests</p>
                    <h2>{leaves.filter(l => l.status === 'Pending').length}</h2>
                </div>
            </div>

            <div className="glass-card">
                <h3>Request History</h3>
                <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>PERIOD</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>TYPE</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>STATUS</th>
                                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>REASON</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center' }}>No applications recorded.</td></tr>
                            ) : (
                                leaves.map(l => (
                                    <tr key={l._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.2rem' }}>
                                            {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1.2rem' }}>{l.type}</td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span className={`badge ${l.status === 'Approved' ? 'badge-success' : l.status === 'Rejected' ? 'badge-danger' : ''}`} style={{ background: l.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : '', color: l.status === 'Pending' ? 'var(--warning)' : '' }}>
                                                {l.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{l.reason || 'N/A'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
                    <div className="glass-card animate-fade" style={{ width: '500px' }}>
                        <h2 style={{ marginBottom: '2rem' }}>Request Time Off</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <select className="input-premium" required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option>Annual</option>
                                <option>Sick</option>
                                <option>Unpaid</option>
                                <option>Other</option>
                            </select>
                            <div className="grid grid-2">
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start Date</label>
                                    <input type="date" required className="input-premium" onChange={e => setForm({ ...form, startDate: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>End Date</label>
                                    <input type="date" required className="input-premium" onChange={e => setForm({ ...form, endDate: e.target.value })} />
                                </div>
                            </div>
                            <textarea className="input-premium" placeholder="Brief explanation..." style={{ minHeight: '100px' }} onChange={e => setForm({ ...form, reason: e.target.value })}></textarea>
                            <div className="flex gap-4">
                                <button type="button" className="btn-outline" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                                <button type="submit" className="btn-premium" style={{ flex: 1, justifyContent: 'center' }}>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
