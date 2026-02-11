"use client";
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-64 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-40 transition-all duration-300">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Dashboard</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 pl-6 border-l border-gray-100 h-8">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-sm">
                        A
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-bold text-gray-800 leading-none">Admin User</p>
                        <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide leading-none mt-1">Administrator</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}
