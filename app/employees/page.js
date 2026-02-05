"use client";
import { useState, useEffect } from 'react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        department: 'Engineering',
        position: '',
        salary: '',
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    async function fetchEmployees() {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (data.success) {
                setEmployees(data.data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                setFormData({ firstName: '', lastName: '', email: '', department: 'Engineering', position: '', salary: '' });
                fetchEmployees();
            }
        } catch (error) {
            console.error('Failed to add employee', error);
        }
    }

    async function deleteEmployee(id) {
        if (!confirm('Delete this record permanently?')) return;
        await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        fetchEmployees();
    }

    return (
        <div className="animate-fade">
            <div className="flex justify-between items-center" style={{ marginBottom: '4rem' }}>
                <div>
                    <h1>Talent Directory</h1>
                    <p>Centralized workspace for global employee management</p>
                </div>
                <button className="btn-premium" onClick={() => setShowModal(true)}>+ Onboard Employee</button>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Info</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role & Dept</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '1.5rem', color: 'var(--text-dim)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" style={{ padding: '5rem', textAlign: 'center' }}>Syncing Directory...</td></tr>
                            ) : employees.length === 0 ? (
                                <tr><td colSpan="4" style={{ padding: '5rem', textAlign: 'center' }}>No specialized talent found in the registry.</td></tr>
                            ) : (
                                employees.map((emp) => (
                                    <tr key={emp._id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1.5rem' }}>
                                            <div className="flex items-center gap-4">
                                                <div style={{
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '12px',
                                                    background: 'var(--primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '700',
                                                    fontSize: '1.1rem'
                                                }}>
                                                    {emp.firstName[0]}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.1rem' }}>{emp.firstName} {emp.lastName}</p>
                                                    <p style={{ fontSize: '0.8rem' }}>{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <p style={{ fontWeight: '500', marginBottom: '0.2rem' }}>{emp.position}</p>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{emp.department}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem' }}>
                                            <span className="badge badge-success">Verified</span>
                                        </td>
                                        <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => deleteEmployee(emp._id)}
                                                style={{ color: 'var(--danger)', padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.05)', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600' }}
                                            >
                                                Offboard
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(12px)', zIndex: 1000
                }}>
                    <div className="glass-card animate-fade" style={{ width: '550px' }}>
                        <h2 style={{ marginBottom: '2.5rem' }}>Add New Specialist</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                                <input required className="input-premium" placeholder="First Name" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                <input required className="input-premium" placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                            </div>

                            <input required type="email" className="input-premium" placeholder="Email Identity" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                                <select className="input-premium" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                    <option>Engineering</option>
                                    <option>Marketing</option>
                                    <option>Human Resources</option>
                                    <option>Success & Sales</option>
                                    <option>Design & Product</option>
                                </select>
                                <input required className="input-premium" placeholder="Professional Title" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                            </div>

                            <input required type="number" className="input-premium" placeholder="Annual Compensation Identity" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />

                            <div className="flex gap-4" style={{ marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline" style={{ flex: 1 }}>Discard</button>
                                <button type="submit" className="btn-premium" style={{ flex: 1, justifyContent: 'center' }}>Finalize Admission</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
