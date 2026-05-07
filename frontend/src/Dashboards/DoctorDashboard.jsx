import React, { useState, useEffect, useContext } from 'react'
import logo from '../assets/logo.png'
import {
    LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus,
    UserRoundCheck, LogOut, Users, Stethoscope, CalendarCheck, TrendingUp,
    CheckCircle2, XCircle, Clock, Search, Filter, Phone, Mail, Award
} from 'lucide-react';
import { DoctorAuthContext } from '../context/create.context';
import { useDoctorAuth } from '../hooks/useDoctorAuth'
import BrandedLoader from '../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { getDoctorAppointments, getDoctorStats, updateDoctorAppointmentStatus } from '../services/appointment.api';

const DoctorDashboard = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const { doctor } = useContext(DoctorAuthContext);
    const { handleDoctorLogout } = useDoctorAuth()
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);


    const getDeptName = (dept) => {
        if (!dept) return "General";
        if (typeof dept === 'object' && dept.name) return dept.name;
        return typeof dept === 'string' ? "Loading..." : "General";
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [apptsRes, statsRes] = await Promise.all([
            getDoctorAppointments(),
            getDoctorStats()
        ]);

        if (apptsRes.success) setAppointments(apptsRes.appointments);
        if (statsRes.success) setStats(statsRes.stats);
        setLoading(false);
    }

    const handleStatusUpdate = async (id, status) => {
        setActionLoading(id);
        const res = await updateDoctorAppointmentStatus(id, status);
        if (res.success) {
            toast.success(`Appointment ${status} successfully`);
            fetchData();
        } else {
            toast.error(res.error || "Failed to update status");
        }
        setActionLoading(null);
    }

    const handleLogout = async () => {
        await handleDoctorLogout()
        navigate('/login')
    }

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dash-doctor' },
        { name: 'Appointments', icon: <CalendarCheck size={20} />, path: '/dash-doctor/appointments' },
        { name: 'My Patients', icon: <UserRoundCheck size={20} />, path: '/dash-doctor/users' },
    ];

    const statsBlocks = [
        {
            title: "Today's Appointments",
            value: stats?.today || 0,
            icon: <Clock className="text-blue-600" />,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100',
            description: 'Appointments scheduled for today'
        },
        {
            title: 'New Requests',
            value: stats?.forwarded || 0,
            icon: <ShieldPlus className="text-orange-600" />,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-100',
            description: 'Forwarded from administration'
        },
        {
            title: 'Confirmed',
            value: stats?.confirmed || 0,
            icon: <CheckCircle2 className="text-emerald-600" />,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            description: 'Awaiting completion'
        },
        {
            title: 'Total Patients',
            value: stats?.total || 0,
            icon: <Users className="text-purple-600" />,
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100',
            description: 'Lifetime patient records'
        },
        {
            title: 'Completed',
            value: stats?.completed || 0,
            icon: <Award className="text-indigo-600" />,
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-100',
            description: 'Successfully served'
        },
    ];

    if (pageLoading) {
        return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
    }

    return (

        <div className="min-h-screen bg-slate-50 font-sans flex transition-all">
            <Toaster position="top-right" />

            {/* SIDEBAR */}
            <section
                className={`fixed top-0 left-0 h-full w-fit z-50 flex flex-col justify-start transition-all duration-300
                                  ${isSidebarHide ? 'w-16' : 'w-20'}`}
            >
                <div className="flex items-start justify-start h-12 px-4 mt-3">
                    <Link to={'/'}>
                        <img
                            src={logo}
                            alt="logo"
                            className={`transition-all duration-300 object-contain ${isSidebarHide ? 'h-10' : 'h-24 w-auto'}`}
                        />
                    </Link>
                </div>
                <div className="h-35"></div>

                <div className="mt-10">
                    <ul className="w-full bg-transparent">
                        {menuItems.map((item) => (
                            <li
                                key={item.name}
                                className={`h-12 mx-2 mb-2 relative transition-all duration-300 rounded-full 
                                                  ${activeMenu === item.name ? 'bg-slate-900 shadow-lg shadow-slate-400' : 'bg-transparent'}`}
                            >
                                <Link
                                    to={item.path}
                                    onClick={() => {
                                        setActiveMenu(item.name);
                                        setBookAppointment(false);
                                    }}
                                    className={`flex items-center h-full px-3 transition-colors duration-300
                                                      ${activeMenu === item.name ? 'text-[#00a6ff]' : 'text-[#342E37] hover:text-[#00a6ff]'}`}
                                >
                                    <span className="min-w-10 flex justify-center">{item.icon}</span>
                                    {!isSidebarHide && <span className="ml-2 text-sm font-medium">{item.name}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="absolute bottom-8 w-full">
                    <button onClick={handleLogout} className="flex items-center p-2 ml-2 text-[#f90800] hover:bg-red-100 rounded-full transition-colors">
                        <span className="min-w-10 flex justify-center"><LogOut size={20} /></span>
                        {!isSidebarHide && <span className="ml-2 text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section
                className="relative transition-all duration-300 grow bg-[#f8fafc]"
                style={{
                    marginLeft: isSidebarHide ? 100 : 208,
                    width: `calc(100% - ${isSidebarHide ? 80 : 208}px)`
                }}
            >
                {/* Navbar */}
                <nav className="h-12 flex items-center px-8 sticky top-0 z-[900] justify-between">
                    <div className='flex items-center mt-2'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800 ">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                        <div className="text-right">
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">ID: {doctor?._id}</p>
                            <p className="text-sm font-black text-slate-900 tracking-tight">Dr. {doctor?.fname} {doctor?.lname}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-white shadow-md flex items-center justify-center text-white font-bold overflow-hidden group/nav">
                            {doctor?.photo ? (
                                <img src={doctor.photo} alt="profile" className="w-full h-full object-cover transition-transform duration-500 group-hover/nav:scale-125" />
                            ) : (
                                <span>{doctor?.fname?.[0]}{doctor?.lname?.[0]}</span>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="p-6 bg-slate-200 rounded-tl-2xl mt-4">
                    <div className="bg-gray-50 p-4 rounded-3xl mb-4">
                        {/* Doctor Profile Header */}
                        <div className="bg-blue-50 rounded-3xl p-8 mt-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden ">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full -mr-32 -mt-32 z-0 opacity-50 "></div>

                            <div className="relative z-10 group/header ">
                                <div className="h-40 w-40 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-slate-200 border-4 border-slate-50 overflow-hidden cursor-pointer shadow-[0px_0px_10px_1px] shadow-slate-300">
                                    {doctor?.photo ? (
                                        <img src={doctor.photo} alt="profile" className="w-full h-full object-cover transition-transform duration-700 group-hover/header:scale-110 h" />
                                    ) : (
                                        <span>{doctor?.fname?.[0]}{doctor?.lname?.[0]}</span>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                                    <Stethoscope size={14} /> Profile
                                </div>
                                <h1 className="text-4xl font-black text-slate-900 font-sans font-bold tracking-tight mb-2">
                                    Good Day, <span className="text-[#000080]">Dr. {doctor?.fname} {doctor?.lname}</span>
                                </h1>
                                <p className="text-slate-500 font-medium mb-6 max-w-2xl leading-relaxed">
                                    Welcome back to your dashboard. You have <span className="text-slate-900 font-bold">{stats?.today || 0} appointments</span> scheduled for today and <span className="text-slate-900 font-bold">{stats?.forwarded || 0} new requests</span> awaiting your review.
                                </p>

                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-bold text-slate-600">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                                        <Award size={18} className="text-indigo-600" /> {getDeptName(doctor?.specialization)}
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                                        <Mail size={18} className="text-blue-600" /> {doctor?.email}
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                                        <Phone size={18} className="text-emerald-600" /> +91 {doctor?.phone}
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                                        <CalendarCheck size={18} className="text-orange-600" /> Joined: {new Date(doctor?.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl">
                                        <UserRoundCheck size={18} className="text-purple-600" /> {doctor?.gender} • {doctor?.age} Years
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
                            {statsBlocks.map((block, index) => (
                                <div key={index} className={`bg-white p-6 py-8 rounded-[25px] border ${block.borderColor} shadow-xl shadow-gray-100/50 flex flex-col shadow-[0px_0px_5px_1px] shadow-slate-300 items-center justify-center gap-4 group hover:-translate-y-1 transition-all duration-300`}>
                                    <div className={`h-14 w-14 rounded-2xl ${block.bgColor} flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                                        {React.cloneElement(block.icon, { size: 28, strokeWidth: 2.5 })}
                                    </div>
                                    <div className="flex flex-col gap-1 items-center justify-center text-center">
                                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                            {loading ? <BrandedLoader size="sm" text="" /> : block.value}
                                        </span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] max-w-[80px] leading-tight">
                                            {block.title}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
};

export default DoctorDashboard;