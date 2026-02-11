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
        if (!confirm('Are you sure you want to delete this department? This action cannot be undone.')) return;

        const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
        const data = await res.json();

        if (data.success) {
            fetchDepartments();
        } else {
            alert(data.error || 'Failed to delete department');
        }
    }

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">Organization</h3>
                    <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
                    <p className="text-gray-600 max-w-md">Manage business units and view staff distribution.</p>
                </div>
                <button className="btn-action btn-primary" onClick={() => setShowModal(true)}>
                    + Add Department
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center">
                        <h2 className="text-lg font-medium text-gray-400 animate-pulse">Loading departments...</h2>
                    </div>
                ) : departments.length === 0 ? (
                    <div className="col-span-full bg-white border border-gray-200 rounded-xl py-12 text-center shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No Departments Found</h2>
                        <p className="text-gray-500 mb-6">Start by adding a new department.</p>
                        <button className="btn-action btn-primary mx-auto" onClick={() => setShowModal(true)}>Add First Department</button>
                    </div>
                ) : (
                    departments.map((dept, index) => (
                        <div key={dept._id || index} className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                            {/* Decorative accent */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors"></div>

                            <div className="flex justify-between items-start mb-8 pl-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 leading-snug group-hover:text-indigo-600 transition-colors">{dept.name}</h3>
                                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">ID: {index + 1}</span>
                                </div>
                                <button onClick={() => handleDelete(dept._id)} className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100">
                                    🗑️
                                </button>
                            </div>

                            <div className="flex justify-between items-end pl-4">
                                <div>
                                    <span className="text-4xl font-bold leading-none block text-gray-900">{dept.employeeCount || 0}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">Employees</span>
                                </div>
                                <button onClick={() => window.location.href = `/employees?department=${encodeURIComponent(dept.name)}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">View Staff →</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99999] flex items-center justify-center p-8 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-indigo-600 text-xs font-bold uppercase tracking-wide">Add New</h3>
                                <h1 className="text-2xl font-bold text-gray-900">Department</h1>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors">✕</button>
                        </div>
                        <form onSubmit={handleAdd} className="p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Department Name</label>
                                <input
                                    className="glass-input"
                                    value={newDept}
                                    onChange={(e) => setNewDept(e.target.value)}
                                    placeholder="e.g. Sales"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-action btn-ghost flex-1">Cancel</button>
                                <button type="submit" className="btn-action btn-primary flex-1">Create Department</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
