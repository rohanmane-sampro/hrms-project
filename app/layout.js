"use client";
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import "./globals.css";
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthPage = pathname === '/login' || pathname === '/register';

    useEffect(() => {
        // We only need to check identity if it's not an auth page
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

    return (
        <html lang="en">
            <head>
                <title>Pro HRMS | Advanced Team Management</title>
                <meta name="description" content="Next-generation HR management system for modern enterprises" />
            </head>
            <body>
                {loading ? (
                    <div style={{ height: '100vh', background: 'var(--bg-main)' }}></div>
                ) : isAuthPage ? (
                    <main>{children}</main>
                ) : (
                    <div className="app-container">
                        <Sidebar userRole={user?.role || 'Admin'} />
                        <main className="main-view">
                            {children}
                        </main>
                    </div>
                )}
            </body>
        </html>
    );
}
