import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['Info', 'Alert', 'Success'], default: 'Info' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional link to creator
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
