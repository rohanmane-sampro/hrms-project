import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

export async function GET() {
    try {
        const cookieStore = await cookies(); // Next.js 15+ async cookies
        const token = cookieStore.get('auth_token');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const decoded = jwt.verify(token.value, JWT_SECRET);
        return NextResponse.json({ success: true, user: decoded });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }
}
