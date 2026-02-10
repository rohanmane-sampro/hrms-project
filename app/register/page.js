"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Admin',
        department: 'Management',
        position: 'Admin',
        salary: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (data.success) {
                alert('Welcome! Your admin account is ready.');
                router.push('/login');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-8 relative overflow-hidden">
            <div className="bento-card w-full max-w-xl p-12 relative animate-fade-in border-white/5">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-600/40 transform rotate-3">
                        <span className="text-3xl">🛡️</span>
                    </div>
                    <h3 className="text-indigo-400">Admin Registration</h3>
                    <h1 className="text-4xl mb-2 tracking-tighter text-white">Create Account</h1>
                    <p className="font-bold opacity-50 uppercase tracking-widest text-[10px]">Sign up for an administrator account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest text-center animate-pulse">
                        ⚠️ Registration failed: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-6">First Name</label>
                            <input className="glass-input py-4 px-6 text-white" required onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-6">Last Name</label>
                            <input className="glass-input py-4 px-6 text-white" required onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-6">Email Address</label>
                        <input type="email" className="glass-input py-4 px-6 text-white" required onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@company.com" />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-6">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min 6 characters"
                                className="glass-input py-4 px-6 pr-16 text-white"
                                required
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-xl opacity-40 hover:opacity-100 transition-opacity"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn-action btn-primary w-full py-6 text-sm mt-4 tracking-[0.2em]">
                        {loading ? 'REGISTERING...' : 'REGISTER ACCOUNT'}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Already have an account? <a href="/login" className="text-indigo-400 hover:text-white transition-all ml-2">Login Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
