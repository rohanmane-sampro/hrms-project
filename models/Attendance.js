import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    date: { type: Date, required: true }, // Store as midnight timestamp for easy querying
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Half-Day'], default: 'Present' },
    checkIn: { type: Date },
    checkOut: { type: Date },
}, { timestamps: true });

// Prevent duplicate attendance records for the same employee on the same day
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
