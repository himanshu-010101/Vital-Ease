require('dotenv').config();
const express = require('express');
const connectDB = require('./db/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRoutes = require('./routes/user.routes')
const contactRoutes = require('./routes/contact.routes')
const serv_progRoutes = require('./routes/serv_prog.routes')
const doctorRoutes = require('./routes/doctor.routes')
// const authRoutes = require('./routes/auth.routes')
const adminRoutes = require('./routes/admin.routes')
const departmentRoutes = require('./routes/department.routes')
const appointmentRoutes = require('./routes/appointment.routes')
const approvedDoctorsRoutes = require('./routes/approvedDoctors.routes')
const analyticsRoutes = require('./routes/analytics.routes')
const visitorModel = require('./models/visitor.model')
const app = express();

async function trackVisitors(req, res, next) {
    try {
        const today = new Date().toISOString().split('T')[0];
        if (!req.cookies.hasVisited) {
            await visitorModel.findOneAndUpdate(
                { date: today },
                { $inc: { count: 1 } },
                { upsert: true, new: true }
            );
            res.cookie('hasVisited', 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        }
    } catch (err) {
        console.error("Visitor tracking error:", err);
    }
    next();
}

async function callDb() {
    try {
        await connectDB();
    }
    catch (err) {
        console.log("Database error:", err)
    }
}
callDb();


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(trackVisitors);

app.use("/user", userRoutes);
app.use("/contact", contactRoutes);
app.use("/serv_prog", serv_progRoutes)
app.use("/doctor", doctorRoutes)
// app.use("/get-me", authRoutes)
app.use("/admin", adminRoutes)
app.use("/department", departmentRoutes)
app.use("/appoint", appointmentRoutes)
app.use("/approved-doctors", approvedDoctorsRoutes)
app.use("/analytics", analyticsRoutes)
app.get("/", (req, res) => {
    res.send("Backend is running");
});

module.exports = app;