"use client";
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthPage = pathname === '/login';

    useEffect(() => {
        if (!isAuthPage) {
            // Simplified fetch for demo/stability, assuming standardized user
            fetch('/api/auth/me')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                    }
                })
                .catch(() => console.log('Auth check skipped or failed'))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [pathname, isAuthPage]);

    if (loading) {
        return <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin"></div>
                <span className="text-sm font-bold text-gray-500 tracking-wide">Loading System...</span>
            </div>
        </div>;
    }

    if (isAuthPage) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <main className="w-full max-w-md">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-700">
            {/* Sidebar is fixed w-64 */}
            <Sidebar userRole={user?.role || 'Admin'} />

            {/* Validated Navbar only for Admins */}
            {user?.role === 'Admin' && <Navbar />}

            {/* Main content wrapper with margin matching sidebar width */}
            <div className={`transition-all duration-300 ${user?.role === 'Admin' ? 'ml-64' : 'ml-64'}`}>
                <main className={`p-8 max-w-7xl mx-auto w-full ${user?.role === 'Admin' ? 'pt-24' : 'pt-8'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
