import dbConnect from '@/lib/db';
import Department from '@/models/Department';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { id } = params;
        const body = await request.json();
        const department = await Department.findByIdAndUpdate(id, body, { new: true });
        if (!department) return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: department });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = params; // This is actually an array/object in Next.js 13+ route handlers sometimes? 
        // Actually params is now a Promise in newer Next.js or direct object in older app dir.
        // In Next.js 13/14 App Router, context.params is what we access.
        // But let's check standard usage. context.params.id should work if folder is [id].

        // Note: Check if employees are assigned to this department first? (Optional logic)
        // For now simple delete.

        const department = await Department.findByIdAndDelete(id);
        if (!department) return NextResponse.json({ success: false, error: 'Department not found' }, { status: 404 });

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
