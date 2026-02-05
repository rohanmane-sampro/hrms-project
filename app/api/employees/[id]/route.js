import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params; // Awaiting params for Next.js 15+ if needed, safe practice
        const body = await request.json();

        const employee = await Employee.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: employee });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        const deletedEmployee = await Employee.deleteOne({ _id: id });

        if (!deletedEmployee) {
            return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
