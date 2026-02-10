"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.success) {
                if (data.user.role === 'Admin') {
                    router.push('/');
                } else {
                    router.push('/employee-dashboard');
                }
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Connection failed. Please check your internet.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-8 relative overflow-hidden">
            <div className="bento-card w-full max-w-lg p-12 relative animate-fade-in border-white/5">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-600/40 transform -rotate-3">
                        <span className="text-3xl">💠</span>
                    </div>
                    <h3 className="text-indigo-400">User Login</h3>
                    <h1 className="text-4xl mb-2 tracking-tighter text-white">Welcome Back</h1>
                    <p className="font-bold opacity-50 uppercase tracking-widest text-[10px]">Please sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest text-center animate-pulse">
                        ⚠️ Login failed: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-6">Email Address</label>
                        <input
                            type="email"
                            className="glass-input py-6 text-white"
                            placeholder="name@company.com"
                            required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-6">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="glass-input pr-16 py-6 text-white"
                                placeholder="Enter your password"
                                required
                                value={form.password}
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

                    <button
                        type="submit"
                        className="btn-action btn-primary w-full py-6 text-sm mt-4 tracking-[0.2em]"
                        disabled={loading}
                    >
                        {loading ? 'LOGGING IN...' : 'SIGN IN'}
                    </button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        New Admin? <a href="/register" className="text-indigo-400 hover:text-white transition-all ml-2">Register Here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
