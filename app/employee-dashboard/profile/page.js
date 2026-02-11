"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                if (data.success) {
                    const empRes = await fetch(`/api/employees`);
                    const empData = await empRes.json();
                    const fullInfo = empData.data.find(e => e._id === data.user.id);
                    setUser(fullInfo || data.user);
                    setLoading(false);
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        }
        fetchProfile();
    }, [router]);

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <h2 className="text-xl font-bold animate-pulse text-indigo-500">Loading Profile...</h2>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-24">
            <header className="flex justify-between items-end border-b border-gray-100 pb-6">
                <div>
                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wide mb-1">My Information</h3>
                    <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
                    <p className="text-gray-500 font-medium text-sm">Review your personal and detailed employment information.</p>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Left Profile Card */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full bg-indigo-50 border-4 border-white shadow-lg text-indigo-600 flex items-center justify-center text-5xl font-black mb-4">
                            {user.firstName[0]}
                        </div>
                        <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center text-white text-xs shadow-md">
                            ✓
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.firstName} {user.lastName}</h1>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-6">{user.position} | {user.department}</p>

                    <div className="flex gap-2 justify-center w-full">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-wide">Active</span>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase tracking-wide">Verified</span>
                    </div>
                </div>

                {/* Right Details Card */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                            Employment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <InfoRow label="Email Address" value={user.email} />
                            <InfoRow label="Department" value={user.department} />
                            <InfoRow label="Position" value={user.position} />
                            <InfoRow label="Joining Date" value={new Date(user.joiningDate || user.createdAt).toLocaleDateString()} />
                            <InfoRow label="Compensation" value={user.salary ? `₹${(user.salary).toLocaleString()}` : 'Confidential'} />
                            <InfoRow label="Role Access" value="Employee Level" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Blood Group</p>
                                <p className="text-base font-bold text-gray-900">{user.bloodGroup || 'O+'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Gender</p>
                                <p className="text-base font-bold text-gray-900 capitalize">{user.gender || 'Not Specified'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">Contact</p>
                                <p className="text-base font-bold text-gray-900">{user.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">DOB</p>
                                <p className="text-base font-bold text-gray-900">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</p>
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
        <div className="flex flex-col gap-1 pb-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors rounded px-2 -mx-2">
            <span className="text-xs font-bold uppercase tracking-wide text-gray-400">{label}</span>
            <span className="text-sm font-bold text-gray-900">{value}</span>
        </div>
    );
}
