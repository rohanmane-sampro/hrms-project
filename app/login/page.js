"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.success) {
                if (data.user.role === 'Admin') {
                    router.push('/');
                } else {
                    router.push('/employee-dashboard');
                }
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection failed. Please check your internet.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, #0f172a 100%)'
        }}>
            <div className="glass-card animate-fade" style={{ width: '420px', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'var(--grad-primary)',
                        borderRadius: '15px',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                    }}>
                        ⚡
                    </div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Pro HRMS</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to manage your workspace</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: 'var(--danger)',
                        padding: '1rem',
                        borderRadius: '1rem',
                        marginBottom: '1.5rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Email Address</label>
                        <input
                            type="email"
                            className="input-premium"
                            placeholder="name@company.com"
                            required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-premium"
                                placeholder="••••••••"
                                required
                                value={form.password}
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

                    <button
                        type="submit"
                        className="btn-premium"
                        disabled={loading}
                        style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
                    >
                        {loading ? 'Authenticating...' : 'Sign In Now'}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        New Administrator? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create Account</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
