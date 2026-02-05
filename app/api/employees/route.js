import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        const employees = await Employee.find({}, '-password').sort({ createdAt: -1 }); // Exclude password
        return NextResponse.json({ success: true, data: employees });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Hash password (default to '123456' if not provided)
        const salt = await bcrypt.genSalt(10);
        const password = body.password || '123456';
        const hashedPassword = await bcrypt.hash(password, salt);

        const employee = await Employee.create({
            ...body,
            password: hashedPassword,
            role: body.role || 'Employee'
        });

        return NextResponse.json({ success: true, data: employee }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
