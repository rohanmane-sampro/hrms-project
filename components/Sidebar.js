"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Sidebar({ userRole }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const adminMenu = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Employees', path: '/employees', icon: '👥' },
        { name: 'Departments', path: '/departments', icon: '🏢' },
        { name: 'Attendance', path: '/attendance', icon: '📅' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    const employeeMenu = [
        { name: 'My Portal', path: '/employee-dashboard', icon: '🏠' },
        { name: 'My Attendance', path: '/employee-dashboard/attendance', icon: '📅' },
        { name: 'Leave Application', path: '/employee-dashboard/leaves', icon: '✉️' },
        { name: 'My Profile', path: '/employee-dashboard/profile', icon: '👤' },
    ];

    const menuItems = userRole === 'Admin' ? adminMenu : employeeMenu;

    return (
        <aside className="sidebar-premium">
            <div className="sidebar-logo">
                <span style={{ fontSize: '1.5rem' }}>💠</span>
                <span style={{ letterSpacing: '-0.01em' }}>Pro HRMS</span>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`nav-link-premium ${pathname === item.path ? 'active' : ''}`}
                    >
                        <span style={{ fontSize: '1.1rem', opacity: 0.8 }}>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                <button onClick={handleLogout} className="nav-link-premium" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', opacity: 0.8 }}>
                    <span>🚪</span>
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
