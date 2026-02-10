"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
            <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center z-[9999]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full animate-pulse"></div>
                <div className="flex flex-col items-center gap-12 relative">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl border-2 border-indigo-600/20 flex items-center justify-center animate-spin duration-[3000ms]">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 shadow-[0_0_30px_rgba(99,102,241,0.6)]"></div>
                        </div>
                        <div className="absolute inset-0 w-24 h-24 rounded-3xl border-2 border-cyan-400/20 animate-reverse-spin"></div>
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-black tracking-[0.4em] uppercase text-white mb-2 leading-none">Initializing Nexus</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 opacity-60">Synchronizing Neural Workspace...</p>
                    </div>
                </div>
                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .animate-reverse-spin { animation: spin 4s linear infinite reverse; }
                 `}</style>
            </div>
        );
    }

    return <AdminDashboard user={user} />;
}
