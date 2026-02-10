import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    address: { type: String },
    emergencyContact: { type: String },
    bloodGroup: { type: String },
    role: { type: String, enum: ['Admin', 'Employee'], default: 'Employee' },
    department: { type: String, required: true },
    position: { type: String, required: true },
    status: { type: String, default: 'Active' },
    joiningDate: { type: Date, default: Date.now },
    salary: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
