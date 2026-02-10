"use client";
import { useState, useEffect } from 'react';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newDept, setNewDept] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    async function fetchDepartments() {
        try {
            const res = await fetch('/api/departments');
            const data = await res.json();
            if (data.success) setDepartments(data.data);
        } finally {
            setLoading(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!newDept.trim()) return;

        const res = await fetch('/api/departments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newDept })
        });
        const data = await res.json();

        if (data.success) {
            setNewDept('');
            setShowModal(false);
            fetchDepartments();
        } else {
            alert(data.error || 'Failed to create department');
        }
    }

    async function handleDelete(id) {
        if (!confirm('Are you sure you want to dismantle this department? This action cannot be undone.')) return;

        const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            fetchDepartments();
        } else {
            alert(data.error || 'Failed to delete department');
        }
    }

    return (
        <div className="flex flex-col gap-12 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Organizational Topography</h3>
                    <h1>Operation Clusters</h1>
                    <p className="max-w-md">Structural overview of corporate divisions and unit density.</p>
                </div>
                <button className="btn-action btn-primary" onClick={() => setShowModal(true)}>
                    + INITIALIZE CLUSTER
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-24 text-center">
                        <h2 className="text-xl font-black opacity-30 tracking-[0.3em] animate-pulse uppercase">Mapping Structural Vectors...</h2>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="col-span-full bento-card py-24 text-center border-dashed opacity-40">
                        <h2 className="text-2xl font-black mb-4 uppercase">NO CLUSTERS ESTABLISHED</h2>
                        <p className="mb-8">The organization lacks defined operational spheres.</p>
                        <button className="btn-action btn-ghost mx-auto" onClick={() => setShowModal(true)}>Deploy First Sphere</button>
                    </div>
                ) : (
                    departments.map((dept, index) => (
                        <div key={dept._id || index} className="bento-card relative group overflow-hidden bg-gradient-to-br from-white/5 to-transparent border-white/10">
                            {/* Decorative accent */}
                            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600 group-hover:bg-cyan-400 transition-colors duration-500"></div>

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h3 className="text-2xl font-black text-white mb-2 leading-none uppercase tracking-tighter group-hover:text-cyan-400 transition-all">{dept.name}</h3>
                                    <span className="badge-premium bg-white/5 text-gray-500">SEGMENT-ID: {index + 101}</span>
                                </div>
                                <button onClick={() => handleDelete(dept._id)} className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
                                    🗑️
                                </button>
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-6xl font-black leading-none block text-white group-hover:animate-pulse">{dept.employeeCount || 0}</span>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-2 block">ACTIVE UNITS</span>
                                </div>
                                <button onClick={() => window.location.href = `/employees?department=${encodeURIComponent(dept.name)}`} className="btn-action btn-ghost px-4 py-2 text-xs border-indigo-600/20 group-hover:bg-indigo-600/10">RECON UNIT</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[99999] flex items-center justify-center p-8 animate-fade-in">
                    <div className="bento-card w-full max-w-lg border-white/10 ring-1 ring-white/5">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-indigo-400">System Command</h3>
                                <h1 className="text-4xl mb-0">New Cluster</h1>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">✕</button>
                        </div>
                        <form onSubmit={handleAdd} className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Cluster Designation</label>
                                <input
                                    className="glass-input"
                                    value={newDept}
                                    onChange={(e) => setNewDept(e.target.value)}
                                    placeholder="e.g. QUANTUM RESEARCH"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-action btn-ghost flex-1">ABORT</button>
                                <button type="submit" className="btn-action btn-primary flex-1">DEPLOY UNIT</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
