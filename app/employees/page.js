"use client";
import { useState, useEffect } from 'react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        gender: '',
        dob: '',
        address: '',
        emergencyContact: '',
        bloodGroup: '',
        department: '',
        position: '',
        salary: '',
    });

    const [departments, setDepartments] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    async function fetchEmployees() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const deptFilter = urlParams.get('department');

            const res = await fetch('/api/employees');
            const data = await res.json();
            if (data.success) {
                let filtered = data.data;
                if (deptFilter && deptFilter !== 'all') {
                    filtered = filtered.filter(e => e.department === deptFilter);
                }
                setEmployees(filtered);
            }
        } finally {
            setLoading(false);
        }
    }

    async function fetchDepartments() {
        try {
            const res = await fetch('/api/departments');
            const data = await res.json();
            if (data.success) {
                setDepartments(data.data);
                if (data.data.length > 0 && !formData.department) {
                    setFormData(prev => ({ ...prev, department: data.data[0].name }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch departments');
        }
    }

    const resetForm = () => {
        setFormData({
            firstName: '', lastName: '', email: '', phone: '', gender: '', dob: '',
            address: '', emergencyContact: '', bloodGroup: '', department: departments[0]?.name || '',
            position: '', salary: ''
        });
        setEditingEmployee(null);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        // Basic Validation
        if (!formData.email.includes('@')) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const method = editingEmployee ? 'PUT' : 'POST';
            const url = editingEmployee ? `/api/employees/${editingEmployee._id}` : '/api/employees';

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setShowModal(false);
                resetForm();
                fetchEmployees();
            } else {
                alert(data.error || 'Operation failed');
            }
        } catch (error) {
            console.error('Failed to process employee', error);
        }
    }

    function handleEdit(emp) {
        setEditingEmployee(emp);
        setFormData({
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            phone: emp.phone || '',
            gender: emp.gender || '',
            dob: emp.dob ? new Date(emp.dob).toISOString().split('T')[0] : '',
            address: emp.address || '',
            emergencyContact: emp.emergencyContact || '',
            bloodGroup: emp.bloodGroup || '',
            department: emp.department || '',
            position: emp.position || '',
            salary: emp.salary || '',
        });
        setShowModal(true);
    }

    async function deleteEmployee(id) {
        if (!confirm('Delete this record permanently?')) return;
        await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        fetchEmployees();
    }

    return (
        <div className="flex flex-col gap-12">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-indigo-400">Employee Management</h3>
                    <h1 className="text-white">Staff Directory</h1>
                    <p className="max-w-md">View and manage all employee records and departmental assignments.</p>
                </div>
                <button className="btn-action btn-primary" onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}>+ Add New Employee</button>
            </header>

            <div className="bento-card overflow-hidden p-0 border-white/5 bg-black/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Employee</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Role & Dept</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Contact</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-24 text-center text-xl font-black opacity-30 tracking-widest animate-pulse text-white">LOADING DATA...</td></tr>
                            ) : employees.length === 0 ? (
                                <tr><td colSpan="4" className="p-24 text-center text-xl font-black opacity-30 tracking-widest text-white">NO EMPLOYEES FOUND</td></tr>
                            ) : (
                                employees.filter(emp => emp.role !== 'Admin').map((emp) => (
                                    <tr key={emp._id} className="border-b border-white/5 hover:bg-white/5 transition-all group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-xl shadow-inner border border-indigo-600/30">
                                                    {emp.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-lg leading-none mb-1 uppercase tracking-tight">{emp.firstName} {emp.lastName}</p>
                                                    <p className="text-xs font-bold text-gray-500 tracking-wider lowercase font-mono">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-black text-white text-sm uppercase tracking-widest mb-1">{emp.position}</p>
                                            <span className="badge-premium bg-indigo-600/10 text-indigo-400 border border-indigo-600/20">{emp.department}</span>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-bold text-gray-300 mb-1">{emp.phone || 'N/A'}</p>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{emp.gender || 'N/A'}</span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex gap-3 justify-end opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                                <button onClick={() => handleEdit(emp)} className="btn-action bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs">EDIT</button>
                                                <button onClick={() => deleteEmployee(emp._id)} className="btn-action bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl text-xs">DELETE</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-3xl z-[99999] flex items-center justify-center p-8 animate-fade-in">
                    <div className="bento-card w-full max-w-5xl max-h-[90vh] overflow-y-auto border-white/10 ring-1 ring-white/5 shadow-2xl shadow-indigo-600/10">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-indigo-400">Employee Details</h3>
                                <h1 className="text-4xl mb-0 text-white">{editingEmployee ? 'Edit Profile' : 'New Employee'}</h1>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-white border border-white/10">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {/* Personal Info Section */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
                                        <h2 className="text-xl font-black mb-0 uppercase tracking-widest leading-none text-white">Personal Info</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">First Name</label>
                                            <input required className="glass-input text-white" placeholder="John" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Last Name</label>
                                            <input required className="glass-input text-white" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Email Address</label>
                                        <input required type="email" className="glass-input text-white" placeholder="email@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Phone Number</label>
                                            <input className="glass-input text-white" placeholder="+1 234 567 890" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Gender</label>
                                            <select className="glass-input text-white" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                                <option value="" className="bg-black">Select Gender</option>
                                                <option value="Male" className="bg-black">Male</option>
                                                <option value="Female" className="bg-black">Female</option>
                                                <option value="Other" className="bg-black">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Date of Birth</label>
                                        <input type="date" className="glass-input text-white" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                                    </div>
                                </div>

                                {/* Professional & Emergency Section */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-1 h-8 bg-cyan-400 rounded-full"></div>
                                        <h2 className="text-xl font-black mb-0 uppercase tracking-widest leading-none text-white">Employment Details</h2>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Department</label>
                                            <select required className="glass-input text-white" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                                <option value="" disabled className="bg-black">Select Department</option>
                                                {departments.map(dept => (
                                                    <option key={dept._id} value={dept.name} className="bg-black">{dept.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Job Title</label>
                                            <input required className="glass-input text-white" placeholder="e.g. Senior Manager" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Salary (Annual)</label>
                                        <input required type="number" className="glass-input text-white" placeholder="0.00" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Emergency Contact</label>
                                            <input className="glass-input text-white" placeholder="Contact Person" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Blood Group</label>
                                            <input className="glass-input text-white" placeholder="e.g. O+" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-4">Home Address</label>
                                        <textarea className="glass-input text-white" placeholder="Full Address" style={{ minHeight: '120px', resize: 'vertical' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-6 pt-12 border-t border-white/10">
                                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-action btn-ghost flex-1 text-white">Cancel</button>
                                <button type="submit" className="btn-action btn-primary flex-[2]">
                                    {editingEmployee ? 'Update Profile' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
