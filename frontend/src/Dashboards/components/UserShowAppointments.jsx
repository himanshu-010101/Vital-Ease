import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import { LayoutDashboard, PieChart, Users, User, NotebookPen, Stethoscope, MessageSquare, UserPlus, LogOut, ChevronRight, CalendarCheck, DollarSign, Trash2 } from 'lucide-react';
import { useUserAuth } from '../../hooks/useUserAuth'
import { useAppointments } from '../../hooks/useAppointments';
import BrandedLoader from '../../components/BrandedLoader';
import { useNavigate, Link } from 'react-router-dom';
import Appointment from './Appointment';

const UserShowAppointments = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Appointments');
    const [appointments, setAppointments] = useState([])
    const [bookAppointment, setBookAppointment] = useState(false)
    const { loading, handleUserLogout } = useUserAuth()
    const { handleGetUserAppointments, handleDeleteAppointment, handleUserDeleteAppointment } = useAppointments()
    const navigate = useNavigate()


    useEffect(() => {
        async function fetchData() {
            try {
                const res = await handleGetUserAppointments();

                if (res && res.success) {
                    setAppointments(res.appointments);
                }
            } catch (error) {
            }
        }

        if (!bookAppointment) {
            fetchData();
        }
    }, []);

    const handleLogout = async () => {
        await handleUserLogout()
        navigate('/login')
    }

    const onCancelAppointment = async (id) => {
        if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
            const res = await handleUserDeleteAppointment(id);
            if (res && res.success) {
                setAppointments(prev => prev.filter(app => app._id !== id));
            }
        }
    }

    const menuItems = [
        { name: 'Profile', icon: <User size={20} />, path: '/dash-user' },
        { name: 'Appointments', icon: <NotebookPen size={20} />, path: '/dash-user/all-appointments' },
        { name: 'Doctor', icon: <Stethoscope size={20} />, path: '/dash-user/all-doctors' },
    ];

    return (
        <div>
            <div className="min-h-screen bg-white font-sans flex transition-all">
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
                            <h2 className="font-bold text-xl text-gray-800">Appointment Management</h2>
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

                    {/* Conditional Rendering Logic */}
                    <main className="pt-8 px-8 bg-slate-200 min-h-screen  rounded-tl-2xl">
                        <div className='p-4 bg-gray-50 rounded-xl'>
                            {bookAppointment ? (
                                <div className="relative mb-4">
                                    <button onClick={() => setBookAppointment(false)} className="flex flex-row p-1">
                                        <ChevronRight className="rotate-180" size={18} /> Back
                                    </button>
                                    <Appointment />
                                </div>
                            ) : (
                                <div className="min-h-125">
                                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Appointments</h2>
                                    {loading && <div className="flex justify-center py-10"><BrandedLoader text="Retrieving Records..." /></div>}

                                    {appointments && appointments.length > 0 ? (
                                        <div className="grid gap-4">
                                            {appointments.map((app) => {
                                                const statusStyles = {
                                                    pending: "bg-orange-100 text-orange-600",
                                                    confirmed: "bg-blue-100 text-blue-600",
                                                    completed: "bg-green-100 text-green-600",
                                                    rejected: "bg-red-100 text-red-600",
                                                };

                                                return (
                                                    <div
                                                        key={app._id}
                                                        className="bg-white p-6  rounded-xl shadow-sm border border-gray-100 flex  justify-between items-start hover:shadow-md transition-shadow mb-4"
                                                    >
                                                        <div className="space-y-2">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-slate-900">
                                                                    {app.departmentId?.name || "General Checkup"}
                                                                </h3>
                                                                <p className="text-sm font-medium text-gray-700">
                                                                    Doctor: <span className={app.doctorId ? "text-gray-900" : "text-gray-400 italic"}>
                                                                        {app.doctorId?.name || "Not Assigned"}
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            {/* Date & Time */}
                                                            <div className=" gap-4 text-sm text-gray-600">
                                                                <p>Appointment Date: {new Date(app.appointmentDate).toLocaleDateString()}</p>
                                                                <p>Appointment Time: {app.timeSlot}</p>
                                                            </div>

                                                            {/* Symptoms */}
                                                            {app.symptoms && (
                                                                <p className="text-sm italic text-gray-500 bg-gray-50 p-2 rounded-md border-l-4 border-teal-500">
                                                                    "{app.symptoms}"
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col items-end justify-between h-full">
                                                            {/* Dynamic Status Badge */}
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusStyles[app.status] || 'bg-gray-100 text-gray-600'}`}>
                                                                {app.status}
                                                            </span>

                                                            <button
                                                                onClick={() => onCancelAppointment(app._id)}
                                                                className='mt-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-wider'
                                                            >
                                                                <Trash2 size={14} /> Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-gray-500">
                                            <CalendarCheck size={48} className="mx-auto mb-4 opacity-20" />
                                            <p>No appointments found. Book one to get started!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </main>
                </section>
            </div>
        </div>
    );
};

export default UserShowAppointments;