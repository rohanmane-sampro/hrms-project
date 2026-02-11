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

    // Updated menu with simple terms
    const adminMenu = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Employees', path: '/employees', icon: '👥' },
        { name: 'Departments', path: '/departments', icon: '🏢' },
        { name: 'Attendance', path: '/attendance', icon: '📅' },
        { name: 'Leaves', path: '/leaves', icon: '✉️' },
        { name: 'Announcements', path: '/announcements', icon: '📢' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    const employeeMenu = [
        { name: 'Dashboard', path: '/employee-dashboard', icon: '🏠' },
        { name: 'Attendance', path: '/employee-dashboard/attendance', icon: '📅' },
        { name: 'Leave Requests', path: '/employee-dashboard/leaves', icon: '✉️' },
        { name: 'My Profile', path: '/employee-dashboard/profile', icon: '👤' },
    ];

    const menuItems = userRole === 'Admin' ? adminMenu : employeeMenu;

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 flex flex-col shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 h-16 border-b border-gray-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 text-white font-bold text-lg">
                    P
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-none tracking-tight">PRO HR</h2>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
                <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2 mt-2">Menu</p>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`group px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 ${pathname === item.path
                            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}`}
                    >
                        <span className={`text-base transition-transform ${pathname === item.path ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`}>{item.icon}</span>
                        {item.name}
                    </Link>
                ))}

                <button
                    onClick={handleLogout}
                    className="group px-3 py-2.5 mt-8 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 text-red-600 hover:bg-red-50 hover:text-red-700 border border-transparent w-full text-left"
                >
                    <span className="text-base opacity-70 group-hover:opacity-100">🚪</span>
                    Log Out
                </button>
            </nav>

            {/* User Profile Mini - simplified without versions */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold text-sm uppercase">
                        {userRole[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{userRole}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-medium text-emerald-600">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
