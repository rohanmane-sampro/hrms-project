import dbConnect from '@/lib/db';
import Leave from '@/models/Leave';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const employeeId = searchParams.get('employeeId');

        let query = {};
        if (employeeId) query.employeeId = employeeId;

        const leaves = await Leave.find(query).populate('employeeId', 'firstName lastName').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: leaves });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const leave = await Leave.create(body);
        return NextResponse.json({ success: true, data: leave });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const { id, status } = await request.json();
        const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true });
        return NextResponse.json({ success: true, data: leave });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
