import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';
import {
    LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus,
    UserRoundCheck, LogOut, Trash2, CheckCircle, XCircle, Eye, EyeOff, Search,
    Mail, Phone, Calendar
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useApprovedDoctors } from '../../hooks/useApprovedDoctors';
import { useDoctorAuth } from '../../hooks/useDoctorAuth';
import { useDepartments } from '../../hooks/useDepartments';
import BrandedLoader from '../../components/BrandedLoader';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Doctors = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [approvedDoctors, setApprovedDoctors] = useState([]);
    const [activeMenu, setActiveMenu] = useState('Doctors');
    const [availableDepartments, setAvailableDepartments] = useState([]);
    const [filterDept, setFilterDept] = useState('All');

    const { handleDeletePendingDoctor, handleGetAllPendingDoctors } = useDoctorAuth();
    const { handleGetAllDepartments } = useDepartments();
    const { handleAdminLogout } = useAdminAuth();
    const {
        loading,
        handleApproveDoctor,
        handleGetApprovedDoctors,
        handleToggleDoctorDisplay,
        handleDeleteApprovedDoctor
    } = useApprovedDoctors();

    const navigate = useNavigate();

    const fetchAllData = async () => {
        try {
            const doctorsRes = await handleGetAllPendingDoctors();
            if (doctorsRes?.success) setPendingDoctors(doctorsRes.doctors || []);

            const deptsRes = await handleGetAllDepartments();
            if (deptsRes?.success) setAvailableDepartments(deptsRes.departments || []);

            const approvedDoctRes = await handleGetApprovedDoctors();
            if (approvedDoctRes?.success) {
                setApprovedDoctors(approvedDoctRes.doctors || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to sync data");
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    const onApprove = async (id) => {
        if (window.confirm("Approve this doctor for public display?")) {
            const res = await handleApproveDoctor(id);
            if (res.success) {
                fetchAllData();
            }
        }
    };

    const onReject = async (id) => {
        if (window.confirm("Reject and delete this registration?")) {
            const res = await handleDeletePendingDoctor(id);
            if (res.success) {
                fetchAllData();
            }
        }
    };

    const onDeleteApproved = async (id) => {
        if (window.confirm("Delete this verified doctor?")) {
            const res = await handleDeleteApprovedDoctor(id);
            if (res.success) {
                fetchAllData();
            }
        }
    };

    const onToggleVisibility = async (id) => {
        const res = await handleToggleDoctorDisplay(id);
        if (res.success) {
            fetchAllData();
        }
    };

    const handleLogout = async () => {
        await handleAdminLogout()
        navigate('/login')
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
                className="relative transition-all duration-300 grow bg-gray-50 min-h-screen"
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
                        <h2 className="font-bold text-xl text-gray-800">Doctors Management</h2>
                    </div>
                    <div>

                    </div>
                </nav>

                <main className="p-6 ">
                    <div className="p-8 max-w-7xl mx-auto rounded-2xl bg-gray-100">
                        {/* Pending Section */}
                        {pendingDoctors.length > 0 && (
                            <div className="mb-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold flex items-center gap-2 text-orange-600">
                                        <Calendar size={20} /> Pending Approvals
                                    </h2>
                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                                        {pendingDoctors.length} New Requests
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {pendingDoctors.map((doc) => (
                                        <div key={doc._id} className="bg-white rounded-2xl p-5 shadow-sm border-gray-600 hover:shadow-md transition-all">
                                            <div className="flex items-center gap-4 mb-4">
                                                <img
                                                    src={doc.photo || 'https://via.placeholder.com/150'}
                                                    alt="doctor"
                                                    className="w-14 h-14 rounded-full object-cover border-2 border-orange-100"
                                                />
                                                <div className="overflow-hidden">
                                                    <h3 className="font-bold text-gray-800 truncate capitalize">
                                                        Dr. {String(doc.fname || '').replace(/"/g, '')} {String(doc.lname || '').replace(/"/g, '')}
                                                    </h3>
                                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                                                        {doc.specialization?.name || 'General Physician'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 mb-6 text-xs text-gray-500">
                                                <div className="flex items-center gap-2 truncate">
                                                    <Mail size={14} className="text-gray-400 shrink-0" />
                                                    {String(doc.email || '').replace(/"/g, '')}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-gray-400 shrink-0" />
                                                    {doc.phone || 'N/A'}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t border-gray-300">
                                                <button onClick={() => onApprove(doc._id)} className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-full text-xs font-bold hover:bg-green-700 active:scale-95 transition-all">
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button onClick={() => onReject(doc._id)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-full text-xs font-bold hover:bg-red-100 active:scale-95 transition-all">
                                                    <XCircle size={14} /> Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <hr className="mb-12 border-gray-200" />

                        {/* Verified Table Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-blue-800">
                                <UserRoundCheck size={20} /> Verified Medical Staff
                            </h2>

                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                                <Search size={18} className="text-gray-400" />
                                <select
                                    className="bg-transparent outline-none text-sm text-gray-600 font-semibold cursor-pointer pr-4"
                                    value={filterDept}
                                    onChange={(e) => setFilterDept(e.target.value)}
                                >
                                    <option value="All">All Departments</option>
                                    {availableDepartments.map((dept) => (
                                        <option key={dept._id} value={dept.name}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-lg border-gray-900 overflow-hidden">
                            {loading ? (
                                <div className="py-20 text-center">
                                    <BrandedLoader size="md" />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/50 border-b">
                                            <tr>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Doctor</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Department</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {approvedDoctors
                                                .filter(doc => {
                                                    if (filterDept === 'All') return true;
                                                    return doc.specialization?.name === filterDept;
                                                })
                                                .map((doc) => {
                                                    const deptName = doc.specialization?.name || 'General Physician';

                                                    return (
                                                        <tr key={doc._id} className="hover:bg-blue-50/30 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={doc.photo || 'https://via.placeholder.com/150'}
                                                                        className="w-10 h-10 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
                                                                        alt="dr"
                                                                    />
                                                                    <div className="text-sm font-bold text-gray-800">
                                                                        Dr. {String(doc.fname || '').replace(/"/g, '')} {String(doc.lname || '').replace(/"/g, '')}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4">
                                                                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase">
                                                                    {deptName}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                                {String(doc.email || '').replace(/"/g, '')}
                                                            </td>

                                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                                {doc.phone || 'N/A'}
                                                            </td>

                                                            {/* Visibility Toggle Button */}
                                                            <td className="px-6 py-4">
                                                                <button
                                                                    onClick={() => onToggleVisibility(doc._id)}
                                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all ${doc.isDisplay !== false ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                                >
                                                                    {doc.isDisplay !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                                                                    {doc.isDisplay !== false ? 'Visible' : 'Hidden'}
                                                                </button>
                                                            </td>

                                                            <td className="px-6 py-4 text-center">
                                                                <button
                                                                    onClick={() => onDeleteApproved(doc._id)}
                                                                    className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all flex items-center justify-center shadow-sm border border-red-100 mx-auto"
                                                                >
                                                                    <Trash2 size={18} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            {(approvedDoctors.length === 0 && !loading) && (
                                <div className="p-20 text-center flex flex-col items-center gap-3">
                                    <div className="p-4 bg-gray-50 rounded-full text-gray-300">
                                        <UserRoundCheck size={40} />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">No verified medical staff found in this department.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </section>
        </div>
    )
}

export default Doctors