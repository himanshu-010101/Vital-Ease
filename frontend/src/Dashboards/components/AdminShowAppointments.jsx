import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import { LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus, UserRoundCheck, LogOut, Send, Trash2 } from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useAppointments } from '../../hooks/useAppointments';
import { useDepartments } from '../../hooks/useDepartments';
import { useApprovedDoctors } from '../../hooks/useApprovedDoctors';
import BrandedLoader from '../../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';

const AdminShowAppointments = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Appointments');
    const [selectedDoctorId, setSelectedDoctorId] = useState({});
    const [filterStatus, setFilterStatus] = useState('all');

    const { handleAdminLogout } = useAdminAuth()
    const { handleGetAllDepartments } = useDepartments()
    const { appointments, loading, handleGetAllAppointments, handleAssignDoctor, handleDeleteAppointment } = useAppointments()
    const { approvedDoctors, handleGetApprovedDoctors } = useApprovedDoctors()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllData = async () => {
            await Promise.all([
                handleGetAllDepartments(),
                handleGetAllAppointments(),
                handleGetApprovedDoctors()
            ]);
        };
        fetchAllData();
    }, []);

    const handleLogout = async () => {
        await handleAdminLogout()
        navigate('/login')
    }

    const filteredAppointments = appointments.filter(app =>
        filterStatus === 'all' || app.status === filterStatus
    );

    const onAssignClick = async (appointmentId) => {
        const doctorId = selectedDoctorId[appointmentId];
        if (!doctorId) {
            alert("Please select a doctor first");
            return;
        }
        await handleAssignDoctor(appointmentId, doctorId);
    };

    const onDeptDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
            await handleDeleteAppointment(id);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'forwarded': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'completed': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

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
                className="relative transition-all duration-300 grow"
                style={{
                    marginLeft: isSidebarHide ? 100 : 200,
                    width: `calc(100% - ${isSidebarHide ? 70 : 200}px)`
                }}
            >
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800">Appointment Management</h2>
                    </div>
                </header>

                <main className="p-8 bg-slate-200 rounded-tl-2xl">
                    <div className='p-4 bg-gray-50 rounded-3xl'>
                        {loading ? (
                            <div className="flex justify-center items-center h-64"><BrandedLoader size="md" /></div>
                        ) : (
                            <div className="space-y-4">
                                {/* Filter Section Above Table */}
                                <div className="flex justify-end pr-2">
                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Show Status:</span>
                                        <select
                                            className="bg-transparent text-gray-700 text-xs font-bold outline-none cursor-pointer pr-4"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Appointments</option>
                                            <option value="pending">Pending</option>
                                            <option value="forwarded">Forwarded</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold">
                                            <tr>
                                                <th className="px-6 py-4">Patient</th>
                                                <th className="px-6 py-4">Department</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Assign Doctor</th>
                                                <th className="px-6 py-4 text-center">Action</th>
                                                <th className="px-6 py-4 text-center">Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm text-gray-600 divide-y divide-gray-50">
                                            {filteredAppointments.map((app) => {
                                                const departmentDoctors = approvedDoctors.filter(doc =>
                                                    doc.specialization?._id === app.departmentId?._id ||
                                                    doc.specialization === app.departmentId?._id
                                                );

                                                return (
                                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-900 mx-auto relative group/symptoms">
                                                            <div className="flex flex-col cursor-help">
                                                                <span>{app.userId?.fullName || 'N/A'}</span>
                                                                <span className="text-xs text-gray-400">{app.userId?.email}</span>
                                                            </div>

                                                            {/* Floating Tooltip for Symptoms */}
                                                            {app.symptoms && (
                                                                <div className="absolute left-[80%] top-1/2 -translate-y-1/2 z-[100] w-64 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/symptoms:opacity-100 group-hover/symptoms:scale-100 transition-all duration-200 border border-slate-800">
                                                                    <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                                                                        User Message
                                                                    </div>
                                                                    <p className="leading-relaxed text-slate-300 italic">"{app.symptoms}"</p>
                                                                    <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-slate-900"></div>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-medium text-slate-700">{app.departmentId?.name || 'N/A'}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {app.status === 'pending' ? (
                                                                <select
                                                                    className="bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-full block w-full p-2 outline-none focus:ring-1 focus:ring-blue-500"
                                                                    onChange={(e) => setSelectedDoctorId({ ...selectedDoctorId, [app._id]: e.target.value })}
                                                                    value={selectedDoctorId[app._id] || ""}
                                                                >
                                                                    <option value="">Select Dr. ({departmentDoctors.length} available)</option>
                                                                    {departmentDoctors.map(doc => (
                                                                        <option key={doc._id} value={doc._id}>
                                                                            Dr. {doc.fname} {doc.lname}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                                                        {app.doctorId?.fname?.[0]}{app.doctorId?.lname?.[0]}
                                                                    </div>
                                                                    <span className="text-gray-700 font-medium">
                                                                        {app.doctorId ? `Dr. ${app.doctorId.fname} ${app.doctorId.lname}` : 'N/A'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {app.status === 'pending' && (
                                                                <button
                                                                    onClick={() => onAssignClick(app._id)}
                                                                    className="px-4 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all flex items-center justify-center mx-auto gap-2 shadow-sm"
                                                                >
                                                                    <Send size={14} />
                                                                    <span className="text-xs font-semibold">Forward</span>
                                                                </button>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button
                                                                onClick={() => onDeptDelete(app._id)}
                                                                className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all flex items-center justify-center shadow-sm border border-red-100 mx-auto"
                                                                title="Delete Appointment"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    {filteredAppointments.length === 0 && (
                                        <div className="p-12 text-center text-gray-400 font-medium">
                                            No appointments found for the selected filter.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </section>
        </div>
    )
}

export default AdminShowAppointments;