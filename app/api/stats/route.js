import dbConnect from '@/lib/db';
import Employee from '@/models/Employee';
import Attendance from '@/models/Attendance';
import Leave from '@/models/Leave';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();

        // 1. Total Employees
        const totalEmployees = await Employee.countDocuments();

        // 2. Attendance Status for Today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const attendanceStats = await Attendance.aggregate([
            { $match: { date: { $gte: todayStart, $lte: todayEnd } } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const presentCount = attendanceStats.find(s => s._id === 'Present')?.count || 0;

        // 3. Approved Leaves for Today
        const leaveCount = await Leave.countDocuments({
            status: 'Approved',
            startDate: { $lte: todayEnd },
            endDate: { $gte: todayStart }
        });

        // 4. New Joinees (Last 30 Days for deeper stats)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newJoinees = await Employee.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // 5. Department Wise Stats
        const deptStats = await Employee.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } },
            { $project: { name: "$_id", count: 1, _id: 0 } }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                totalEmployees,
                present: presentCount,
                leaves: leaveCount,
                newJoinees,
                departmentStats: deptStats
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
