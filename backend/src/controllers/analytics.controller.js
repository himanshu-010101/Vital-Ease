const userModel = require('../models/user.model');
const approvedDoctorModel = require('../models/approvedDoctors.model');
const appointmentModel = require('../models/appointment.model');
const visitorModel = require('../models/visitor.model');
const departmentModel = require('../models/department.model');

async function getDashboardStats(req, res) {
    try {
        // 1. Get Totals
        const totalUsers = await userModel.countDocuments();
        const totalDoctors = await approvedDoctorModel.countDocuments();
        const totalAppointments = await appointmentModel.countDocuments();
        const pendingAppointments = await appointmentModel.countDocuments({ status: 'pending' });
        const totalDepartments = await departmentModel.countDocuments({ isActive: true });
        
        const visitorsData = await visitorModel.find();
        const totalVisitors = visitorsData.reduce((acc, curr) => acc + curr.count, 0);

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            last7Days.push(dateStr);
        }

        // Fetch user registrations per day
        const usersPerDay = await userModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Fetch visitors per day
        const visitorsPerDay = await visitorModel.find({
            date: { $in: last7Days }
        });

        // Format chart data
        const chartData = last7Days.map(date => {
            const userEntry = usersPerDay.find(u => u._id === date);
            const visitorEntry = visitorsPerDay.find(v => v.date === date);
            return {
                date,
                users: userEntry ? userEntry.count : 0,
                visitors: visitorEntry ? visitorEntry.count : 0
            };
        });

        res.status(200).json({
            success: true,
            totals: {
                users: totalUsers,
                doctors: totalDoctors,
                appointments: totalAppointments,
                pendingAppointments: pendingAppointments,
                departments: totalDepartments,
                visitors: totalVisitors
            },
            chartData
        });

    } catch (err) {
        console.error("Analytics Error:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = {
    getDashboardStats
};
