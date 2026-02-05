import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function POST(request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();

        // 1. Find user
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // 2. Check password
        if (!employee.password) {
            return NextResponse.json({
                success: false,
                error: 'Account missing password. Please delete and recreate this employee.'
            }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // 3. Generate Token
        const token = jwt.sign(
            { id: employee._id, email: employee.email, role: employee.role, name: employee.firstName },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 4. Set Cookie
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        const response = NextResponse.json({
            success: true,
            user: {
                id: employee._id,
                name: employee.firstName,
                role: employee.role
            }
        });

        response.headers.set('Set-Cookie', cookie);

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
