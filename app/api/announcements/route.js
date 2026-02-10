import dbConnect from '@/lib/db';
import Announcement from '@/models/Announcement';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: announcements });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const announcement = await Announcement.create(body);
        return NextResponse.json({ success: true, data: announcement });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
