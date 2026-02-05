"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import the Admin Dashboard UI components (we'll keep them here for now or move to a component)
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();

                if (data.success) {
                    if (data.user.role === 'Employee') {
                        router.push('/employee-dashboard');
                    } else {
                        setUser(data.user);
                        setLoading(false);
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            }
        }
        checkAuth();
    }, [router]);

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-main)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1.5rem'
                    }}></div>
                    <h2 style={{ color: 'var(--text-muted)' }}>Verifying Session...</h2>
                    <style>{`
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
                </div>
            </div>
        );
    }

    return <AdminDashboard user={user} />;
}
