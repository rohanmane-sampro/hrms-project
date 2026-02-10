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
        { name: 'Leaves', path: '/leaves', icon: '✉️' },
        { name: 'Announcements', path: '/announcements', icon: '📢' },
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
        <aside className="sidebar-container shadow-2xl shadow-black/40">
            <div className="flex items-center gap-4 px-4 mb-2">
                <div className="w-14 h-14 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-6">
                    <span className="text-3xl">💠</span>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter mb-0 leading-none">PRO HR</h2>
                    <p className="text-[9px] font-black tracking-[0.3em] uppercase text-indigo-500 mt-1">HR Management</p>
                </div>
            </div>

            <nav className="flex flex-col gap-1.5 mt-12">
                <div className="flex justify-between items-center px-6 mb-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-0">Main Menu</p>
                </div>

                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`nav-item group ${pathname === item.path ? 'nav-item-active' : ''}`}
                    >
                        <span className="text-xl transition-transform group-hover:scale-110">{item.icon}</span>
                        {item.name}
                    </Link>
                ))}

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-1.5">
                    <p className="px-6 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4">Account</p>
                    <button
                        onClick={handleLogout}
                        className="nav-item text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all border-none bg-transparent cursor-pointer w-full text-left"
                    >
                        <span className="text-xl">🚪</span>
                        Log Out
                    </button>
                </div>
            </nav>

            <div className="mt-auto">
                <div className="bento-card p-6 flex items-center gap-4 bg-indigo-500/5 border-transparent hover:translate-y-0 transition-none shadow-none rounded-3xl">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-500">
                        {userRole[0]}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{userRole} Account</p>
                        <p className="text-xs font-bold leading-none mt-1 uppercase text-gray-500">Status: Online</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
