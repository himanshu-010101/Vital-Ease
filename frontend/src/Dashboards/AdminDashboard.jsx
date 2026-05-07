import React, { useState, useEffect, useContext } from 'react'
import logo from '../assets/logo.png'
import {
    LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus,
    UserRoundCheck, LogOut, Users, Stethoscope, CalendarCheck, TrendingUp,
    PlusCircle, Trash2, List, ArrowLeft
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth'
import { AdminContext, DepartmentContext } from '../context/create.context';
import BrandedLoader from '../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, LineChart, Line
} from 'recharts';
import { ThreeDots } from 'react-loader-spinner'

const AdminDashboard = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const { analyticsData, handleFetchAnalytics, admin } = useContext(AdminContext);
    const { handleAdminLogout } = useAdminAuth()
    const navigate = useNavigate()

    const { departments, handleCreateDepartment, handleDeleteDepartment } = useContext(DepartmentContext);
    const [showDeptList, setShowDeptList] = useState(false);
    const [deptName, setDeptName] = useState("");
    const [deptLoading, setDeptLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);


    useEffect(() => {
        handleFetchAnalytics();
    }, []);

    const handleLogout = async () => {
        await handleAdminLogout()
        navigate('/login')
    }

    const onDeptSubmit = async (e) => {
        e.preventDefault();
        if (!deptName.trim()) return;

        setDeptLoading(true);

        const res = await handleCreateDepartment(deptName);
        if (res.success) {
            setDeptName("");
        }
        setDeptLoading(false);
    }

    const onDeptDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this department?")) return;

        setDeptLoading(true);
        const res = await handleDeleteDepartment(id);
        if (res.success) {
            toast.success("Department deleted successfully");
        } else {
            toast.error(res.message || "Failed to delete department");
        }
        setDeptLoading(false);
    }


    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dash-admin' },
        { name: 'Appointments', icon: <PieChart size={20} />, path: '/dash-admin/all-appointments' },
        { name: 'Contacts', icon: <NotebookTabs size={20} />, path: '/dash-admin/allContacts' },
        { name: 'Doctors', icon: <Microscope size={20} />, path: '/dash-admin/doctors' },
        { name: 'Services', icon: <ShieldPlus size={20} />, path: '/dash-admin/serv_prog' },
        { name: 'Users', icon: <UserRoundCheck size={20} />, path: '/dash-admin/allUsers' },
    ];

    const statsBlocks = [
        {
            title: 'Total Visitors',
            value: analyticsData?.totals?.visitors || 0,
            icon: <Users className="text-blue-600" />,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-100'
        },
        {
            title: 'Total Doctors',
            value: analyticsData?.totals?.doctors || 0,
            icon: <Stethoscope className="text-emerald-600" />,
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-100'
        },
        {
            title: 'Pending Appointments',
            value: analyticsData?.totals?.pendingAppointments || 0,
            icon: <CalendarCheck className="text-orange-600" />,
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-100'
        },
        {
            title: 'Total Patients',
            value: analyticsData?.totals?.users || 0,
            icon: <UserRoundCheck className="text-purple-600" />,
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-100'
        },
        {
            title: 'Total Departments',
            value: analyticsData?.totals?.departments || 0,
            icon: <ShieldPlus className="text-indigo-600" />,
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-100'
        },
    ];

    if (pageLoading) {
        return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
    }

    return (

        <div className="min-h-screen bg-white font-sans flex transition-all">
            {/* SIDEBAR */}
            <section
                className={`fixed top-0 left-0 h-full bg-white shadow-2xl z-[1000] flex flex-col justify-start transition-all duration-300
                            ${isSidebarHide ? '-translate-x-full md:translate-x-0 md:w-20' : 'translate-x-0 w-64 md:w-52'}`}
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

            {/* MOBILE OVERLAY */}
            {!isSidebarHide && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[950] md:hidden"
                    onClick={() => setIsSidebarHide(true)}
                ></div>
            )}

            {/* MAIN CONTENT AREA */}
            <section
                className={`relative transition-all duration-300 grow bg-[#f8fafc] w-full
                            ${isSidebarHide ? 'ml-0 md:ml-20' : 'ml-0 md:ml-52'}`}
            >
                {/* Navbar */}
                <nav className="h-14 bg-white flex items-center px-6 sticky flex-row justify-between top-0 z-1000">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mb-1">System Admin</p>
                            <p className="text-sm font-black text-slate-900 leading-none">{admin?.name || "ADMIN"}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
                            {admin?.name?.[0] || 'A'}
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="p-6 bg-slate-200 rounded-tl-2xl">
                    <div className="bg-white p-4 rounded-2xl">
                        <header className="mb-4">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                Vital Ease <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-blue-600">Analytics</span>
                            </h1>
                            <p className="text-gray-400 font-semibold tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live platform metrics and performance trends
                            </p>
                        </header>

                        {/* Stats Blocks Row */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-8">
                            {statsBlocks.map((block, index) => (
                                <div key={index} className={`bg-white p-6 py-8 rounded-[25px] border ${block.borderColor} shadow-xl shadow-gray-100/50 flex flex-col shadow-[0px_0px_5px_1px] shadow-slate-300 items-center justify-center gap-4 group hover:-translate-y-1 transition-all duration-300`}>
                                    <div className={`h-14 w-14 rounded-2xl ${block.bgColor} flex-shrink-0 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                                        {React.cloneElement(block.icon, { size: 28, strokeWidth: 2.5 })}
                                    </div>
                                    <div className="flex flex-col gap-1 items-center justify-center text-center">
                                        <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                            {analyticsData ? block.value : "..."}
                                        </span>
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] max-w-[80px] leading-tight">
                                            {block.title}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Analytics Row: Chart + Register Dept */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                            {/* 1. Chart Section (2/3 width) */}
                            <div className="lg:col-span-2 bg-white rounded-[22px] border border-gray-100 shadow-[0px_0px_10px_2px] shadow-slate-300 h-[450px] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-blue-100/50">
                                <div className="p-6 border-b border-gray-50 bg-white flex-shrink-0">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Activity Analysis</h3>
                                            <p className="text-[10px] font-bold text-gray-400 gap-1 flex items-center uppercase tracking-widest mt-1">Growth trends for the last 7 days</p>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-xl">
                                            <TrendingUp className="h-4 w-4 text-blue-600" />
                                            <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider">Trending Up</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-4 min-h-0 relative min-w-0">
                                    <div className="absolute inset-0 p-4 h-full w-full">
                                        {analyticsData?.chartData ? (
                                            <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                                <LineChart
                                                    data={analyticsData.chartData}
                                                    margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                                                >
                                                    <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                                                    <XAxis
                                                        dataKey="date"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                                        dy={10}
                                                        tickFormatter={(value) => {
                                                            const date = new Date(value);
                                                            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                                                        }}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }}
                                                        domain={[0, 'auto']}
                                                        allowDataOverflow={false}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            borderRadius: '16px',
                                                            border: 'none',
                                                            boxShadow: '0 20px 40px -8px rgb(0 0 0 / 0.1)',
                                                            padding: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: 800
                                                        }}
                                                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="visitors"
                                                        stroke="#2563eb"
                                                        strokeWidth={3}
                                                        dot={{ fill: "#2563eb", strokeWidth: 2, r: 3, stroke: "#fff" }}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                        name="Daily Visitors"
                                                        animationDuration={2000}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="users"
                                                        stroke="#818cf8"
                                                        strokeWidth={3}
                                                        dot={{ fill: "#818cf8", strokeWidth: 2, r: 3, stroke: "#fff" }}
                                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                                        name="New Registrations"
                                                        animationDuration={2500}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex flex-col justify-center items-center h-full gap-4">
                                                <BrandedLoader size="md" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. Register Department Section (1/3 width) */}
                            <div className='w-full rounded-2xl h-[450px] flex justify-center bg-cover bg-center overflow-hidden border border-gray-100 shadow-[0px_0px_10px_2px] shadow-slate-300 transition-all duration-300' style={{ backgroundImage: "url('/background-services.jpg')" }}>
                                <div className="w-full h-full p-8 text-gray-800 flex flex-col relative">

                                    {/* Toggle Button */}
                                    <button
                                        onClick={() => setShowDeptList(!showDeptList)}
                                        className="absolute top-4 right-4 p-2 rounded-xl transition-all duration-300 text-slate-800 bg-white/80 backdrop-blur-md"
                                        title={showDeptList ? "Back to Form" : "View All Departments"}
                                    >
                                        {showDeptList ? <ArrowLeft size={18} /> : <List size={18} />}
                                    </button>

                                    {!showDeptList ? (
                                        <div className="flex flex-col h-full mt-10 items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl">
                                            <div className=" w-full flex flex-col justify-center items-center mb-6 ">
                                                <div>
                                                    <span className="text-4xl font-semibold text-slate-700 text-center mb-6">Create</span>
                                                </div>
                                                <div><span className="text-xl text-slate-700 ml-3">a new</span></div>
                                                <div>
                                                    <span className="text-2xl text-slate-700 font-semibold">Department</span>
                                                </div>
                                            </div>

                                            <form className="space-y-5" onSubmit={onDeptSubmit}>
                                                <div>
                                                    <div>
                                                        <label className="block mb-1 border font-bold border-gray-500 rounded-full px-4 py-1 w-fit text-gray-900">Department Name</label>
                                                        <input
                                                            type="text"
                                                            value={deptName}
                                                            placeholder="Cardiology"
                                                            onChange={(e) => { setDeptName(e.target.value) }}
                                                            className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none text-gray-800 placeholder:text-gray-800/40"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <button
                                                        type="submit"
                                                        disabled={deptLoading}
                                                        className="flex items-center justify-center w-40 h-10 bg-white text-gray-800 font-semibold rounded-full transition duration-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-black enabled:hover:text-white"
                                                    >
                                                        {deptLoading ? <ThreeDots
                                                            height="30"
                                                            width="30"
                                                            radius="9"
                                                            color="#ff2f00"
                                                            ariaLabel="three-dots-loading"
                                                            visible={true}
                                                        /> : "Submit"}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col h-full ">
                                            <div className="mb-6 flex flex-col p-2 pr-8 rounded-xl w-fit bg-white/80 backdrop-blur-md">
                                                <span className="text-2xl font-black text-slate-700 uppercase tracking-tighter leading-none">Departments</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-1">Existing Services</span>
                                            </div>

                                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-none " >
                                                {departments && departments.filter(d => d.isActive).length > 0 ? (
                                                    <div className="space-y-3">
                                                        {departments.filter(d => d.isActive).map((dept) => (
                                                            <div key={dept._id} className="flex items-center justify-between p-4 bg-white/20 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm hover:shadow-md transition-all duration-300 group">
                                                                <span className="font-bold text-slate-800 truncate pr-2">{dept.name}</span>
                                                                <button
                                                                    onClick={() => onDeptDelete(dept._id)}
                                                                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all flex items-center justify-center shadow-sm border border-red-100 opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full opacity-40">
                                                        <PieChart size={40} />
                                                        <span className="text-[10px] font-black uppercase tracking-widest mt-2">No active departments</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
}

export default AdminDashboard