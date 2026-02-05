"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.success) {
                // Fetch full details from employees API
                const empRes = await fetch(`/api/employees`);
                const empData = await empRes.json();
                const fullInfo = empData.data.find(e => e._id === data.user.id);
                setUser(fullInfo || data.user);
                setLoading(false);
            } else {
                router.push('/login');
            }
        }
        fetchProfile();
    }, [router]);

    if (loading) return <div style={{ textAlign: 'center', padding: '10rem' }}><h2>Loading Profile...</h2></div>;

    return (
        <div className="animate-fade">
            <div style={{ marginBottom: '3rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px' }}>Identity</span>
                <h1>My Personal Profile</h1>
                <p style={{ color: 'var(--text-muted)' }}>Your professional identity and workspace details</p>
            </div>

            <div className="grid grid-2" style={{ alignItems: 'start' }}>
                <div className="glass-card flex flex-col items-center" style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '30px',
                        background: 'var(--grad-primary)',
                        fontSize: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.5rem',
                        boxShadow: '0 20px 40px var(--primary-glow)'
                    }}>
                        {user.firstName[0]}
                    </div>
                    <h2>{user.firstName} {user.lastName}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{user.position} | {user.department}</p>

                    <div className="flex gap-4">
                        <span className="badge badge-success">Active Member</span>
                        <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>Verified Account</span>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 style={{ marginBottom: '2rem' }}>Workspace Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <InfoRow label="Email Identity" value={user.email} />
                        <InfoRow label="Business Unit" value={user.department} />
                        <InfoRow label="Current Role" value={user.position} />
                        <InfoRow label="Onboarding Date" value={new Date(user.joiningDate || user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                        <InfoRow label="Compensation Tier" value={`$${user.salary?.toLocaleString() || '---'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex justify-between items-center" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{label}</span>
            <span style={{ fontWeight: '600' }}>{value}</span>
        </div>
    );
}
