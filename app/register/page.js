"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Admin',
        department: 'Management',
        position: 'Admin',
        salary: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                alert('Welcome! Your admin account is ready.');
                router.push('/login');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 10% 20%, #0f172a 0%, #1e1b4b 100%)'
        }}>
            <div className="glass-card animate-fade" style={{ width: '500px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create Admin</h2>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Setup your professional dashboard</p>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-2" style={{ gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First Name</label>
                            <input className="input-premium" required onChange={e => setForm({ ...form, firstName: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last Name</label>
                            <input className="input-premium" required onChange={e => setForm({ ...form, lastName: e.target.value })} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email Address</label>
                        <input type="email" className="input-premium" required onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 6 characters"
                                className="input-premium"
                                required
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                style={{ paddingRight: '3.5rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    opacity: 0.6,
                                    transition: 'opacity 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.opacity = 1}
                                onMouseLeave={(e) => e.target.style.opacity = 0.6}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-premium" style={{ justifyContent: 'center', padding: '1rem' }}>
                        {loading ? 'Creating Account...' : 'Finish Registration'}
                    </button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <a href="/login" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already registered? <span style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign In</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
