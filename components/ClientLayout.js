"use client";
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        if (!isAuthPage) {
            fetch('/api/auth/me')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [pathname, isAuthPage]);

    if (loading) {
        return <div className="fixed inset-0 bg-[#0a0a0a]"></div>;
    }

    if (isAuthPage) {
        return (
            <div className="app-container flex items-center justify-center p-0">
                <main className="w-full">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="app-container">
            <Sidebar userRole={user?.role || 'Admin'} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
