import React, { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import { LayoutDashboard, PieChart, Users, User, NotebookPen, Stethoscope, MessageSquare, UserPlus, LogOut, ChevronRight, CalendarCheck, DollarSign } from 'lucide-react';
import { useUserAuth } from '../hooks/useUserAuth'
import { useAppointments } from '../hooks/useAppointments'
import BrandedLoader from '../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';
import Appointment from '../Dashboards/components/Appointment';

const UserDashboard = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Profile');
    const [bookAppointment, setBookAppointment] = useState(false)
    const { isDataLoading, detailedUser, handleGetUser, handleUserLogout } = useUserAuth()
    const { appointments, handleGetUserAppointments } = useAppointments()
    const navigate = useNavigate()
    const [pageLoading, setPageLoading] = useState(true);


    useEffect(() => {
        if (!detailedUser) {
            handleGetUser();
        }
        handleGetUserAppointments();
    }, []);

    const nextAppointment = appointments
        ? appointments
            .filter(app => app.status === 'confirmed' || app.status === 'completed')
            .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0]
        : null;

    const handleLogout = async () => {
        await handleUserLogout()
        navigate('/login')
    }

    const menuItems = [
        { name: 'Profile', icon: <User size={20} />, path: '/dash-user' },
        { name: 'Appointments', icon: <NotebookPen size={20} />, path: '/dash-user/all-appointments' },
        { name: 'Doctor', icon: <Stethoscope size={20} />, path: '/dash-user/all-doctors' },

    ];

    if (pageLoading) {
        return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
    }

    return (

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
                        <h2 className="font-bold text-xl text-gray-800">Dashboard</h2>
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
                    {bookAppointment ? (
                        <div className="relative">
                            <button
                                onClick={() => setBookAppointment(false)}
                                className="mb-4 text-sky-700 font-medium hover:underline flex items-center gap-1"
                            >
                                <ChevronRight className="rotate-180" size={18} /> Back to Dashboard
                            </button>
                            <Appointment />
                        </div>
                    ) : (
                        <div className="bg-slate-900 border shadow-xl rounded-xl p-8">
                            <h1 className="text-3xl font-bold text-white mb-6">Profile Overview</h1>
                            <div className="flex gap-8 flex-wrap">
                                {/* Profile Card */}
                                <div className="bg-white border rounded-lg p-6 flex flex-col items-start w-[320px]">
                                    <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                        {isDataLoading ? <BrandedLoader size="sm" text="" /> : (detailedUser?.gender === "Male" ? "Mr. " : "Ms. ")}
                                        {detailedUser?.fullName}
                                    </div>
                                    <div className="text-gray-700 text-sm mt-2">
                                        <span className='font-semibold'>Username: </span>
                                        <span className='text-blue-900'>{detailedUser?.userName}</span>
                                    </div>
                                    <div className="font-semibold mt-4 border-b border-slate-200 w-full pb-1 mb-2 text-slate-500 uppercase text-xs tracking-wider">Contact Details</div>
                                    <div className="text-gray-700 text-sm mb-1">
                                        <span className='font-semibold'>Email: </span> <span className='text-blue-900'>{detailedUser?.email}</span>
                                    </div>
                                    <div className="text-gray-700 text-sm mb-1">
                                        <span className='font-semibold'>Phone: </span> <span className='text-blue-900'>{detailedUser?.phone}</span>
                                    </div>
                                    <div className="text-gray-700 text-sm mb-1">
                                        <span className='font-semibold'>Address: </span> <span className='text-blue-900'>{detailedUser?.address}</span>
                                    </div>
                                </div>

                                {/* Overview Card */}
                                <div className="flex-1 bg-white border rounded-lg p-6 min-w-[320px]">
                                    <span className="font-bold text-xl block mb-4 border-b pb-2">Medical Overview</span>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Gender</div>
                                            <div className="font-semibold text-lg text-slate-800">{detailedUser?.gender || "N/A"}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Age</div>
                                            <div className="font-semibold text-lg text-slate-800">{detailedUser?.age || "N/A"}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">DOB</div>
                                            <div className="font-semibold text-lg text-slate-800">
                                                {detailedUser?.dob ? new Date(detailedUser.dob).toLocaleDateString("en-IN") : "N/A"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Next Visit</div>
                                            <div className="font-semibold text-lg text-slate-800">
                                                {nextAppointment ? new Date(nextAppointment.appointmentDate).toLocaleDateString("en-IN") : "No upcoming visits"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Doctor</div>
                                            <div className="font-semibold text-lg text-slate-800">
                                                {nextAppointment?.doctorId ? `Dr. ${nextAppointment.doctorId.fname} ${nextAppointment.doctorId.lname}` : "Not Assigned"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase">Department</div>
                                            <div className="font-semibold text-lg text-slate-800">
                                                {nextAppointment?.departmentId?.name || "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lower Section */}
                            <div className="flex gap-8 mt-8 flex-wrap">
                                <div className="bg-white border rounded-lg p-6 w-full md:w-1/3 min-w-10pe5">
                                    <div className="font-bold text-lg mb-4">Latest Lab Results</div>
                                    <div className="h-32 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400 italic">
                                        No recent files found
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    {['Appointments', 'Doctors', 'Treatment', 'Tests'].map((item) => (
                                        <div key={item} className="bg-white border rounded-lg p-6 flex items-center justify-center font-semibold text-blue-900 cursor-pointer shadow-sm hover:shadow-md hover:bg-blue-50 transition-all">
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </section>
        </div>
    );
};

export default UserDashboard;