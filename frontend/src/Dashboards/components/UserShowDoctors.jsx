import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import {
    LayoutDashboard, User, NotebookPen, Stethoscope, LogOut, ChevronRight,
    CalendarCheck, Clock, Mail, Phone, MapPin, Search, Filter, MoreVertical,
    Activity, Heart
} from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth'
import { useAppointments } from '../../hooks/useAppointments';
import BrandedLoader from '../../components/BrandedLoader';
import { useNavigate, Link } from 'react-router-dom';
import Appointment from './Appointment';
import { Toaster } from 'react-hot-toast';

const UserShowDoctors = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Doctor');
    const [doctors, setDoctors] = useState([]);
    const [bookAppointment, setBookAppointment] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { loading, handleUserLogout } = useUserAuth()
    const { handleGetUserAppointments, loading: appLoading } = useAppointments()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await handleGetUserAppointments();
                if (res && res.success) {
                    // Extract unique doctors from appointments
                    const uniqueDoctors = [];
                    const doctorIds = new Set();

                    res.appointments.forEach(app => {
                        if (app.doctorId && app.doctorId._id && !doctorIds.has(app.doctorId._id)) {
                            doctorIds.add(app.doctorId._id);
                            uniqueDoctors.push({
                                ...app.doctorId,
                                departmentName: app.departmentId?.name || "General Medicine"
                            });
                        }
                    });

                    setDoctors(uniqueDoctors);
                }
            } catch (error) {
                console.error("Failed to fetch assigned doctors:", error);
            }
        }

        if (!bookAppointment) {
            fetchData();
        }
    }, [bookAppointment]);

    const handleLogout = async () => {
        await handleUserLogout()
        navigate('/login')
    }

    const menuItems = [
        { name: 'Profile', icon: <User size={20} />, path: '/dash-user' },
        { name: 'Appointments', icon: <NotebookPen size={20} />, path: '/dash-user/all-appointments' },
        { name: 'Doctor', icon: <Stethoscope size={20} />, path: '/dash-user/all-doctors' },
    ];

    const filteredDoctors = doctors.filter(doc =>
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.departmentName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-white font-sans flex transition-all">
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

            {/* MAIN CONTENT AREA */}
            <section
                className="relative transition-all duration-300 grow"
                style={{
                    marginLeft: isSidebarHide ? 100 : 200,
                    width: `calc(100% - ${isSidebarHide ? 70 : 200}px)`
                }}
            >
                {/* Navbar */}
                <nav className="h-14 bg-white flex items-center px-6 sticky top-0 z-40 flex-row justify-between">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800">Doctor Management</h2>
                    </div>
                    <div>
                        <button
                            onClick={() => setBookAppointment(true)}
                            className='bg-orange-500 p-2 px-4 rounded-full text-white font-semibold hover:bg-orange-600 transition-all shadow-md active:scale-95'
                        >
                            Book an Appointment
                        </button>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="p-8 bg-slate-200 min-h-screen rounded-tl-2xl shadow-inner">
                    <div className='p-4 bg-gray-50 rounded-2xl'>
                        {bookAppointment ? (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                <button
                                    onClick={() => setBookAppointment(false)}
                                    className="mb-8 group text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 w-fit hover:bg-slate-900 hover:text-white transition-all"
                                >
                                    <ChevronRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                                    <span>Back to Directory</span>
                                </button>
                                <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
                                    <Appointment />
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-700">
                                <div className="flex items-center justify-between mb-10">
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">My Specialists</h1>
                                    </div>
                                </div>

                                {appLoading ? (
                                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                                        <BrandedLoader text="Syncing Directory..." />
                                    </div>
                                ) : filteredDoctors && filteredDoctors.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {filteredDoctors.map((doc) => (
                                            <div
                                                key={doc._id}
                                                className="bg-white rounded-[35px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group relative overflow-hidden"
                                            >
                                                {/* Top Banner Decoration */}
                                                <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10 group-hover:opacity-20 transition-opacity"></div>

                                                <div className="px-8 pb-8 -mt-12 text-center">
                                                    <div className="relative inline-block mb-6">
                                                        <div className="h-24 w-24 rounded-[30px] bg-white p-1 shadow-xl relative z-10 mx-auto group-hover:scale-105 transition-transform duration-500">
                                                            {doc.photo ? (
                                                                <img
                                                                    src={doc.photo}
                                                                    alt={doc.name}
                                                                    className="h-full w-full object-cover rounded-[28px]"
                                                                />
                                                            ) : (
                                                                <div className="h-full w-full rounded-[28px] bg-slate-900 flex items-center justify-center text-white">
                                                                    <User size={40} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="absolute top-0 right-0 h-6 w-6 bg-emerald-500 border-4 border-white rounded-full z-20"></div>
                                                    </div>

                                                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1 group-hover:text-indigo-600 transition-colors leading-none">
                                                        Dr. {doc.name || `${doc.fname} ${doc.lname}`}
                                                    </h3>

                                                    <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2 px-4 py-1.5 bg-blue-50 rounded-full inline-block">
                                                        {doc.departmentName || "Specialist"}
                                                    </p>

                                                    <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-bold tracking-tight mb-8">
                                                        <Mail size={12} className="text-blue-500" />
                                                        <span>{doc.email || "No email provided"}</span>
                                                    </div>

                                                    <div className="pt-6 border-t flex justify-center border-slate-50">
                                                        <button
                                                            onClick={() => setBookAppointment(true)}
                                                            className="h-12 w-fit px-6 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-gradient-to-r from-indigo-400 to-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                                        >
                                                            <CalendarCheck size={14} /> Schedule New Visit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-32 bg-white rounded-[50px] border border-slate-100 shadow-sm px-10">
                                        <div className="h-32 w-32 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 text-slate-200 transition-transform hover:scale-110">
                                            <Stethoscope size={64} strokeWidth={1} />
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No Specialists Found</h2>
                                        <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                                            {searchQuery
                                                ? `We couldn't find any specialists matching "${searchQuery}". Try a different search term.`
                                                : "You haven't been assigned any doctors yet. Please book an appointment to meet our experts."}
                                        </p>
                                        <button
                                            onClick={() => setBookAppointment(true)}
                                            className="bg-slate-900 text-white px-12 py-5 rounded-[25px] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 active:scale-95 flex items-center gap-3 mx-auto"
                                        >
                                            <CalendarCheck size={20} />
                                            Schedule Visit
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </section>
        </div>
    );
};

export default UserShowDoctors;