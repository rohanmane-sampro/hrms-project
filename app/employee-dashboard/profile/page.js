"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch('/api/auth/me');
            const data = await res.json();
            if (data.success) {
                // Fetch full details from employees API
                const empRes = await fetch(`/api/employees`);
                const empData = await empRes.json();
                const fullInfo = empData.data.find(e => e._id === data.user.id);
                setUser(fullInfo || data.user);
                setLoading(false);
            } else {
                router.push('/login');
            }
        }
        fetchProfile();
    }, [router]);

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <h2 className="text-2xl font-black animate-pulse opacity-50 uppercase tracking-widest">Identifying Subject...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-12 animate-fade-in">
            <header>
                <h3 className="text-indigo-400">Identity Matrix</h3>
                <h1>Personal Profile</h1>
                <p className="max-w-md">Comprehensive professional signatures and workspace authorization details.</p>
            </header>

            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Left Profile Card */}
                <div className="col-span-12 lg:col-span-4 bento-card flex flex-col items-center text-center group">
                    <div className="relative mb-12">
                        <div className="w-32 h-32 rounded-[3.5rem] bg-indigo-600 text-white flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-600/40 transform -rotate-6 group-hover:rotate-0 transition-all duration-700 ring-4 ring-white/5">
                            {user.firstName[0]}
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-emerald-500 border-4 border-bg-main flex items-center justify-center text-xs shadow-lg shadow-emerald-500/20">
                            ✓
                        </div>
                    </div>

                    <h1 className="text-4xl font-black mb-1 p-0 leading-none group-hover:text-indigo-400 transition-colors">{user.firstName} {user.lastName}</h1>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">{user.position} | {user.department}</p>

                    <div className="flex flex-wrap gap-3 justify-center">
                        <span className="badge-premium bg-emerald-600/20 text-emerald-400 border border-emerald-600/10">Active Member</span>
                        <span className="badge-premium bg-indigo-600/10 text-indigo-400 border border-indigo-600/10">Verified Unit</span>
                    </div>
                </div>

                {/* Right Details Card */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    <div className="bento-card">
                        <h2 className="text-2xl font-black mb-12 flex items-center gap-4">
                            <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                            WORKSPACE SIGNATURES
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            <InfoRow label="Email Identity" value={user.email} />
                            <InfoRow label="Business Cluster" value={user.department} />
                            <InfoRow label="Strategic Role" value={user.position} />
                            <InfoRow label="Initialize Date" value={new Date(user.joiningDate || user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                            <InfoRow label="Resource Value" value={user.salary ? `${(user.salary / 100000).toFixed(1)}L PA` : 'CLASSIFIED'} />
                            <InfoRow label="Auth Status" value="LEVEL-4 CLUSTER" />
                        </div>
                    </div>

                    <div className="bento-card border-white/5 bg-gradient-to-r from-indigo-600/5 to-transparent">
                        <h2 className="text-2xl font-black mb-8">SECURE BIOMETRICS</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">BLOOD GROUP</p>
                                <p className="text-xl font-black text-white">{user.bloodGroup || 'O+'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">GENDER SIGN</p>
                                <p className="text-xl font-black text-white uppercase">{user.gender || 'BIPED'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">SYNC PHONE</p>
                                <p className="text-xl font-black text-white">{user.phone || 'HIDDEN'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">BIO DATE</p>
                                <p className="text-xl font-black text-white">{user.dob ? new Date(user.dob).toLocaleDateString() : 'UNKNOWN'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 pb-6 border-b border-white/5 hover:border-indigo-600/20 transition-all">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">{label}</span>
            <span className="text-lg font-black text-white uppercase tracking-tight">{value}</span>
        </div>
    );
}
