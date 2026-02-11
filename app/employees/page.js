"use client";
import { useState, useEffect } from 'react';

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);
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
        setStep(1);
    };

    async function handleSubmit(e) {
        if (e) e.preventDefault();

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
        setStep(1);
        setShowModal(true);
    }

    async function deleteEmployee(id) {
        if (!confirm('Delete this record permanently?')) return;
        await fetch(`/api/employees/${id}`, { method: 'DELETE' });
        fetchEmployees();
    }

    const handleNext = () => {
        // Simple validation for step 1
        if (!formData.firstName || !formData.lastName || !formData.email) {
            alert('Please fill in the required fields (First Name, Last Name, Email)');
            return;
        }
        setStep(2);
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="flex justify-between items-end">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-1">Employee Management</h3>
                    <h1 className="text-3xl font-bold text-gray-900">Staff Directory</h1>
                    <p className="text-gray-600 max-w-md">View and manage all employee records and departmental assignments.</p>
                </div>
                <button className="btn-action btn-primary" onClick={() => {
                    resetForm();
                    setShowModal(true);
                }}>+ Add New Employee</button>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Employee</th>
                                <th className="p-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Role & Dept</th>
                                <th className="p-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Contact</th>
                                <th className="p-6 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="4" className="p-12 text-center text-lg font-medium text-gray-400 animate-pulse">Loading data...</td></tr>
                            ) : employees.length === 0 ? (
                                <tr><td colSpan="4" className="p-12 text-center text-lg font-medium text-gray-400">No employees found.</td></tr>
                            ) : (
                                employees.filter(emp => emp.role !== 'Admin').map((emp) => (
                                    <tr key={emp._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                                                    {emp.firstName[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 text-base leading-tight mb-0.5">{emp.firstName} {emp.lastName}</p>
                                                    <p className="text-xs text-gray-500 font-medium lowercase font-mono">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <p className="font-semibold text-gray-800 text-sm mb-1">{emp.position}</p>
                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">{emp.department}</span>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-sm font-medium text-gray-700 mb-1">{emp.phone || 'N/A'}</p>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{emp.gender || 'N/A'}</span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(emp)} className="btn-action bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 px-3 py-1.5 rounded-lg text-xs shadow-sm">Edit</button>
                                                <button onClick={() => deleteEmployee(emp._id)} className="btn-action bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 px-3 py-1.5 rounded-lg text-xs shadow-sm">Delete</button>
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
                <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 pb-4 pt-24 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col relative overflow-hidden">
                        <div className="bg-white border-b border-gray-100 p-6 flex justify-between items-center sticky top-0 z-10">
                            <div>
                                <h3 className="text-indigo-600 text-xs font-bold uppercase tracking-wide">
                                    Step {step} of 2: {step === 1 ? 'Personal Info' : 'Employment Details'}
                                </h3>
                                <h1 className="text-xl font-bold text-gray-900 mt-1">{editingEmployee ? 'Edit Profile' : 'New Employee'}</h1>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400 text-lg">✕</button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <form id="employeeForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {step === 1 && (
                                    <div className="flex flex-col gap-5 animate-slide-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">First Name</label>
                                                <input required className="glass-input w-full" placeholder="John" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Last Name</label>
                                                <input required className="glass-input w-full" placeholder="Doe" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Email Address</label>
                                            <input required type="email" className="glass-input w-full" placeholder="email@company.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Phone Number</label>
                                                <input className="glass-input w-full" placeholder="+1 234 567 890" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Gender</label>
                                                <select className="glass-input w-full" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Date of Birth</label>
                                            <input type="date" className="glass-input w-full" value={formData.dob} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Home Address</label>
                                            <textarea className="glass-input w-full" placeholder="Full Address" style={{ minHeight: '80px', resize: 'vertical' }} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="flex flex-col gap-5 animate-slide-in">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Department</label>
                                                <select required className="glass-input w-full" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })}>
                                                    <option value="" disabled>Select Department</option>
                                                    {departments.map(dept => (
                                                        <option key={dept._id} value={dept.name}>{dept.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Job Title</label>
                                                <input required className="glass-input w-full" placeholder="e.g. Senior Manager" value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Salary (Annual)</label>
                                            <input required type="number" className="glass-input w-full" placeholder="0.00" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Emergency Contact</label>
                                                <input className="glass-input w-full" placeholder="Contact Person" value={formData.emergencyContact} onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })} />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 px-1">Blood Group</label>
                                                <input className="glass-input w-full" placeholder="e.g. O+" value={formData.bloodGroup} onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="bg-gray-50 border-t border-gray-100 p-6 flex gap-3 sticky bottom-0 z-10">
                            {step === 1 ? (
                                <>
                                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-action bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex-1 py-3 text-sm">Cancel</button>
                                    <button type="button" onClick={handleNext} className="btn-action btn-primary flex-[2] py-3 text-sm shadow-md hover:shadow-lg">Next Step →</button>
                                </>
                            ) : (
                                <>
                                    <button type="button" onClick={() => setStep(1)} className="btn-action bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 flex-1 py-3 text-sm">← Back</button>
                                    <button type="button" onClick={handleSubmit} className="btn-action btn-primary flex-[2] py-3 text-sm shadow-md hover:shadow-lg">
                                        {editingEmployee ? 'Update Profile' : 'Create Account'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
