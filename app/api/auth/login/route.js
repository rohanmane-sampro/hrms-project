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
        const normalizedEmail = email.toLowerCase().trim();

        // 0. Check for Super Admin (Env Variables)
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASSWORD;

        if (adminEmail && adminPass && normalizedEmail === adminEmail.toLowerCase() && password === adminPass) {
            const token = jwt.sign(
                { id: 'admin-static-id', email: adminEmail, role: 'Admin', name: 'Super Admin' },
                JWT_SECRET,
                { expiresIn: '1d' }
            );

            const cookie = serialize('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            const response = NextResponse.json({
                success: true,
                user: {
                    id: 'admin-static-id',
                    name: 'Super Admin',
                    role: 'Admin'
                }
            });

            response.headers.set('Set-Cookie', cookie);
            return response;
        }

        // 1. Find user in DB (Self-Healing typo check)
        let employee = await Employee.findOne({ email: normalizedEmail });

        // Robust check for the specific typo known to exist
        if (!employee && (normalizedEmail === 'rohanmane9841@gmail.com' || normalizedEmail === 'rohanamane9841@gmail.com')) {
            // Try the other one
            const alternate = normalizedEmail === 'rohanmane9841@gmail.com' ? 'rohanamane9841@gmail.com' : 'rohanmane9841@gmail.com';
            employee = await Employee.findOne({ email: alternate });
            if (employee) {
                // AUTO FIX: Self-heal the database record
                employee.email = 'rohanmane9841@gmail.com';
                await employee.save();
                console.log(`Self-healed employee record: ${alternate} -> rohanmane9841@gmail.com`);
            }
        }

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
