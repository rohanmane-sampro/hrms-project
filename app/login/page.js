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
        <div className="min-h-screen w-full flex items-center justify-center p-8 relative overflow-hidden bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-12 relative animate-fade-in border border-gray-100">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200 transform -rotate-3">
                        <span className="text-3xl text-white font-bold">P</span>
                    </div>
                    <h3 className="text-gray-500 font-medium mb-1 uppercase tracking-wide text-xs">Employee Portal</h3>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Please sign in to your account</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 text-xs font-bold uppercase tracking-wide text-center">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Email Address</label>
                        <input
                            type="email"
                            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 w-full"
                            placeholder="name@company.com"
                            required
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400 w-full pr-12"
                                placeholder="Enter your password"
                                required
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 border border-transparent w-full py-3.5 rounded-xl font-bold text-sm mt-2 transition-all active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-10 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs font-medium text-gray-400">
                        Secure Pro HR Management System
                    </p>
                </div>
            </div>
        </div>
    );
}
