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
        <div className="flex flex-col gap-8 animate-fade-in">
            <header>
                <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Company News</h3>
                <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
                <p className="text-gray-600 max-w-md">Post important news and updates for all employees to see.</p>
            </header>

            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Form Section */}
                <div className="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                        New Announcement
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Title</label>
                            <input className="glass-input" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Office Holiday Notice" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Category</label>
                            <select className="glass-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option>Info</option>
                                <option>Alert</option>
                                <option>Success</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Message Content</label>
                            <textarea className="glass-input" required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your message here..." style={{ minHeight: '120px' }}></textarea>
                        </div>
                        <button type="submit" className="btn-action btn-primary mt-2">Post Announcement</button>
                    </form>
                </div>

                {/* List Section */}
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                        Recent Updates
                    </h2>
                    <div className="flex flex-col gap-4">
                        {loading ? (
                            <div className="bg-white border border-gray-200 rounded-xl py-12 text-center text-gray-400 animate-pulse font-medium">Loading updates...</div>
                        ) : announcements.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-xl py-12 text-center text-gray-400 font-medium">No announcements posted yet.</div>
                        ) : (
                            announcements.map(a => {
                                let badgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                                if (a.type === 'Alert') badgeClass = 'bg-red-50 text-red-700 border-red-100';
                                if (a.type === 'Success') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                                return (
                                    <div key={a._id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-gray-900 leading-snug">{a.title}</h3>
                                            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${badgeClass}`}>{a.type}</span>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed text-sm mb-4 border-b border-gray-50 pb-4">{a.content}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Posted on: {new Date(a.createdAt).toLocaleDateString()}</span>
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
