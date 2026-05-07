import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import {
    LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus,
    UserRoundCheck, LogOut, Trash2, User, Mail, Phone, Calendar, MapPin, Users
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useUserAuth } from '../../hooks/useUserAuth'
import BrandedLoader from '../../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';

const ShowAllUser = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Users');
    const { handleAdminLogout } = useAdminAuth()
    const { isDataLoading, allUsers, handleGetAllUsers, handleDeleteUser } = useUserAuth()

    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            await handleGetAllUsers();
        }
        fetchData();
    }, []);

    const handleLogout = async () => {
        await handleAdminLogout()
        navigate('/login')
    }

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            await handleDeleteUser(id);
        }
    }

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dash-admin' },
        { name: 'Appointments', icon: <PieChart size={20} />, path: '/dash-admin/all-appointments' },
        { name: 'Contacts', icon: <NotebookTabs size={20} />, path: '/dash-admin/allContacts' },
        { name: 'Doctors', icon: <Microscope size={20} />, path: '/dash-admin/doctors' },
        { name: 'Services', icon: <ShieldPlus size={20} />, path: '/dash-admin/serv_prog' },
        { name: 'Users', icon: <UserRoundCheck size={20} />, path: '/dash-admin/allUsers' },
    ];

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
                className="relative transition-all duration-300 grow  min-h-screen"
                style={{
                    marginLeft: isSidebarHide ? 80 : 208,
                    width: `calc(100% - ${isSidebarHide ? 80 : 208}px)`
                }}
            >
                {/* Navbar */}
                <nav className="h-14 bg-white flex items-center px-6 sticky flex-row justify-between top-0 z-1000">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800">User Management</h2>
                    </div>
                    <div>

                    </div>
                </nav>

                <main className="p-6 bg-slate-200 rounded-tl-2xl min-h-screen" >
                    <div className='bg-gray-50 p-4 rounded-2xl'>
                        {/* Stats Block */}
                        <div className="flex justify-end mb-5">
                            <div className="flex items-center gap-4">
                                {/* Total Users Card */}
                                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                                    <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center">
                                        <Users size={18} className="text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Users</span>
                                        <span className="text-2xl font-extrabold text-slate-900 leading-tight">{allUsers?.length ?? 0}</span>
                                    </div>
                                </div>
                                {/* Male Card */}
                                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <User size={18} className="text-blue-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Male</span>
                                        <span className="text-2xl font-extrabold text-blue-700 leading-tight">
                                            {allUsers?.filter(u => u.gender === 'Male').length ?? 0}
                                        </span>
                                    </div>
                                </div>
                                {/* Female Card */}
                                <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
                                    <div className="h-10 w-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                        <User size={18} className="text-pink-500" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Female</span>
                                        <span className="text-2xl font-extrabold text-pink-600 leading-tight">
                                            {allUsers?.filter(u => u.gender === 'Female').length ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {isDataLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <BrandedLoader size="md" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Details</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Demographics</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {allUsers && allUsers.length > 0 ? (
                                                allUsers.map((user) => (
                                                    <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-gray-900 text-sm">{user.fullName}</span>
                                                                <span className="text-xs text-gray-400 font-mono">@{user.userName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center text-xs text-gray-600">
                                                                    <Mail size={14} className="mr-2 text-gray-400" />
                                                                    {user.email}
                                                                </div>
                                                                <div className="flex items-center text-xs text-gray-600">
                                                                    <Phone size={14} className="mr-2 text-gray-400" />
                                                                    {user.phone}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center text-xs text-gray-600">
                                                                    <User size={14} className="mr-2 text-gray-400" />
                                                                    {user.gender} ({user.age})
                                                                </div>
                                                                <div className="flex items-center text-xs text-gray-600">
                                                                    <Calendar size={14} className="mr-2 text-gray-400" />
                                                                    {new Date(user.dob).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-start text-xs text-gray-600 max-w-50">
                                                                <MapPin size={14} className="mr-2 mt-0.5 text-gray-400 shrink-0" />
                                                                <span className="line-clamp-2">{user.address}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => onDelete(user._id)}
                                                                className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all flex items-center justify-center shadow-sm border border-red-100 mx-auto"
                                                                title="Delete User"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">
                                                        No users found in the database.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </section>
        </div>
    )
}

export default ShowAllUser