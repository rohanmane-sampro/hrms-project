"use client";
import { useState, useEffect } from 'react';

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ title: '', content: '', type: 'Info' });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    async function fetchAnnouncements() {
        try {
            const res = await fetch('/api/announcements');
            const data = await res.json();
            if (data.success) setAnnouncements(data.data);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const res = await fetch('/api/announcements', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (data.success) {
            setForm({ title: '', content: '', type: 'Info' });
            fetchAnnouncements();
        }
    }

    return (
        <div className="flex flex-col gap-12 animate-fade-in">
            <header>
                <h3 className="text-indigo-400">Announcements</h3>
                <h1 className="text-white">Company Updates</h1>
                <p className="max-w-md">Post important news and updates for all employees to see.</p>
            </header>

            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Form Section */}
                <div className="col-span-12 lg:col-span-5 bento-card border-indigo-600/10 shadow-lg shadow-indigo-600/5">
                    <h2 className="text-2xl font-black mb-8 flex items-center gap-4 text-white">
                        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                        Post New Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Title</label>
                            <input className="glass-input text-white" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Office Holiday Notice" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Category</label>
                            <select className="glass-input text-white" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option className="bg-black">Info</option>
                                <option className="bg-black">Alert</option>
                                <option className="bg-black">Success</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Message Content</label>
                            <textarea className="glass-input text-white" required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your message here..." style={{ minHeight: '180px' }}></textarea>
                        </div>
                        <button type="submit" className="btn-action btn-primary mt-4">Post Announcement</button>
                    </form>
                </div>

                {/* List Section */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                    <h2 className="text-2xl font-black mb-2 flex items-center gap-4 text-white">
                        <div className="w-2 h-8 bg-cyan-400 rounded-full"></div>
                        Recent Announcements
                    </h2>
                    <div className="flex flex-col gap-6">
                        {loading ? (
                            <div className="bento-card py-24 text-center opacity-30 font-black animate-pulse tracking-widest uppercase text-white">Loading...</div>
                        ) : announcements.length === 0 ? (
                            <div className="bento-card py-24 text-center opacity-30 font-black tracking-widest uppercase border-dashed text-white">No announcements posted yet.</div>
                        ) : (
                            announcements.map(a => {
                                let themeColor = 'indigo-500';
                                if (a.type === 'Alert') themeColor = 'red-500';
                                if (a.type === 'Success') themeColor = 'emerald-400';

                                return (
                                    <div key={a._id} className={`bento-card p-8 bg-gradient-to-r from-white/5 to-transparent border-l-4 border-l-${themeColor} hover:translate-x-2`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-black text-white mb-0 uppercase tracking-tight leading-loose">{a.title}</h3>
                                            <span className={`badge-premium bg-${themeColor}/20 text-${themeColor === 'emerald-400' ? 'emerald-400' : themeColor} border border-${themeColor}/20`}>[{a.type.toUpperCase()}]</span>
                                        </div>
                                        <p className="text-gray-300 font-medium text-lg leading-relaxed mb-6">{a.content}</p>
                                        <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                            <div className={`w-1.5 h-1.5 rounded-full bg-${themeColor} shadow-[0_0_8px_rgba(99,102,241,0.5)]`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Posted on: {new Date(a.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
