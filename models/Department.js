import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    code: { type: String, uppercase: true, trim: true }, // e.g. IT, HR
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
