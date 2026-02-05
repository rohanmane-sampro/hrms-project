import dbConnect from '@/lib/db';
import Attendance from '@/models/Attendance';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const date = searchParams.get('date');
        const employeeId = searchParams.get('employeeId'); // Added ability to filter by employee

        let query = {};
        if (date) {
            const queryDate = new Date(date);
            queryDate.setHours(0, 0, 0, 0);
            query.date = queryDate;
        }
        if (employeeId) {
            query.employeeId = employeeId;
        }

        // Populate employee details to show names
        const records = await Attendance.find(query)
            .populate('employeeId', 'firstName lastName department position')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: records });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const { employeeId, status } = await request.json(); // Fixed: request.json() instead of body.json()

        // Normalize date to midnight for "Today"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if attendance already exists for this day
        // Using findOneAndUpdate with upsert: true
        const attendance = await Attendance.findOneAndUpdate(
            { employeeId, date: today },
            {
                status,
                // Only set checkIn if it's not already set
                $setOnInsert: { checkIn: new Date() }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: attendance });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
