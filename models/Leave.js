import mongoose from 'mongoose';

const LeaveSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    type: { type: String, enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Other'], default: 'Annual' },
    reason: { type: String },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model('Leave', LeaveSchema);
