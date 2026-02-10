import dbConnect from '@/lib/db';
import Department from '@/models/Department';
import Employee from '@/models/Employee';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();

        // 1. Get all departments
        const departments = await Department.find({ isActive: true }).sort({ name: 1 });

        // 2. Get counts for each department from Employees
        // We can do an aggregation or just map over departments if list is small.
        // For efficiency with potentially many employees, aggregation is better.
        const employeeCounts = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);

        // 3. Merge data
        const data = departments.map(dept => {
            const stats = employeeCounts.find(s => s._id === dept.name);
            return {
                ...dept.toObject(),
                employeeCount: stats ? stats.count : 0
            };
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic validation
        if (!body.name) {
            return NextResponse.json({ success: false, error: "Department Name is required" }, { status: 400 });
        }

        const existing = await Department.findOne({ name: body.name });
        if (existing) {
            return NextResponse.json({ success: false, error: "Department already exists" }, { status: 400 });
        }

        const department = await Department.create(body);
        return NextResponse.json({ success: true, data: department });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
