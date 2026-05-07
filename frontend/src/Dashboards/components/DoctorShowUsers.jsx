import React, { useState, useEffect, useContext } from 'react'
import logo from '../../assets/logo.png'
import {
    LayoutDashboard, UserRoundCheck, LogOut, Users,
    CalendarCheck, CheckCircle2, XCircle, Clock, Search, Filter,
    Phone, Mail, Award, Edit3, ArrowLeft, MoreVertical, Activity,
    ChevronLeft, Trash2, MessageSquare, History, Briefcase, PlusCircle
} from 'lucide-react';
import { DoctorAuthContext } from '../../context/create.context';
import { useDoctorAuth } from '../../hooks/useDoctorAuth'
import BrandedLoader from '../../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import {
    getDoctorAppointments,
    getDoctorStats,
    updateDoctorAppointmentStatus,
    doctorEditAppointment,
    doctorDeleteAppointment
} from '../../services/appointment.api';

const DoctorShowUsers = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('My Patients');
    const { doctor } = useContext(DoctorAuthContext);
    const { handleDoctorLogout } = useDoctorAuth()
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState('processed'); // 'processed' or 'history'
    const [searchQuery, setSearchQuery] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

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
            toast.success(`Patient status updated to ${status}`);
            fetchData();
        } else {
            toast.error(res.error || "Failed to update status");
        }
        setActionLoading(null);
    }

    const handleReschedule = async () => {
        if (!newDate || !newTime) {
            return toast.error("Select both date and time");
        }
        setActionLoading(editingAppointment._id);
        const res = await doctorEditAppointment(editingAppointment._id, newDate, newTime);
        if (res.success) {
            toast.success("Consultation Rescheduled");
            setIsEditModalOpen(false);
            fetchData();
        } else {
            toast.error(res.error || "Failed to reschedule");
        }
        setActionLoading(null);
    }

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this specific clinical record?")) {
            setActionLoading(id);
            const res = await doctorDeleteAppointment(id);
            if (res.success) {
                toast.success("Record deleted");
                fetchData();
            } else {
                toast.error(res.error || "Failed to delete");
            }
            setActionLoading(null);
        }
    }

    const handleLogout = async () => {
        await handleDoctorLogout()
        navigate('/login')
    }

    // CRM LOGIC: Group Appointments into Unique Patients
    const patientsMap = appointments.reduce((acc, appt) => {
        if (!appt.userId) return acc;
        const uid = appt.userId._id;

        if (!acc[uid]) {
            acc[uid] = {
                user: appt.userId,
                appointments: [],
                totalVisits: 0,
                isProcessed: false,
                latestAppointment: appt
            };
        }

        acc[uid].appointments.push(appt);
        acc[uid].totalVisits += 1;

        // A patient is "Processed" if they have an active session
        if (['forwarded', 'confirmed'].includes(appt.status)) {
            acc[uid].isProcessed = true;
        }

        // Keep the most recent appointment as the "Latest"
        if (new Date(appt.appointmentDate) > new Date(acc[uid].latestAppointment.appointmentDate)) {
            acc[uid].latestAppointment = appt;
        }

        return acc;
    }, {});

    const patientList = Object.values(patientsMap);

    const filteredPatients = patientList.filter(p => {
        const matchesSearch = p.user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'processed' ? p.isProcessed : !p.isProcessed;
        return matchesSearch && matchesTab;
    });

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dash-doctor' },
        { name: 'Appointments', icon: <CalendarCheck size={18} />, path: '/dash-doctor/appointments' },
        { name: 'My Patients', icon: <UserRoundCheck size={18} />, path: '/dash-doctor/users' },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'forwarded': return 'bg-orange-100 text-orange-600';
            case 'confirmed': return 'bg-blue-100 text-blue-600';
            case 'completed': return 'bg-green-100 text-green-600';
            case 'rejected': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans flex transition-all">
            <Toaster position="top-right" />

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
                <div className="h-10"></div>

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
                <nav className="h-16 bg-white flex items-center px-4 md:px-8 sticky top-0 z-[900] justify-between border-b border-slate-100">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-4 md:mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-lg md:text-xl text-gray-800 truncate">CRM</h2>
                    </div>

                    <div className="flex items-center gap-4">
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

                <main className="p-8 bg-slate-200 min-h-screen rounded-tl-2xl">
                    <div className='p-4 bg-gray-50 rounded-2xl shadow-inner min-h-[calc(100vh-120px)]'>

                        {/* CRM NAV & SEARCH */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                            <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                                <button
                                    onClick={() => setActiveTab('processed')}
                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'processed' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    In Process
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Medical History
                                </button>
                            </div>

                            <div className="relative group w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by patient name..."
                                    className="pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all w-full shadow-sm placeholder:text-slate-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* CRM DATA TABLE */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                            {loading ? (
                                <div className="py-20">
                                    <BrandedLoader text="Synchronizing Patient Records..." />
                                </div>
                            ) : filteredPatients.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient Details</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Status</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ongoing Session</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Contact Information</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredPatients.map((p) => (
                                                <tr key={p.user._id} className="group hover:bg-slate-50/40 transition-colors">
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden">
                                                                {p.user.photo ? <img src={p.user.photo} className="w-full h-full object-cover" /> : <span className="text-xs font-black text-slate-400 uppercase">{p.user.fullName?.[0]}</span>}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-black text-slate-900 capitalize tracking-tight">{p.user.fullName}</span>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-[10px] font-bold text-blue-500 uppercase">ID: {p.user._id.slice(-6)}</span>
                                                                    <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                                    <span className="text-[10px] font-medium text-slate-400">{p.totalVisits} Consultations</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col items-start gap-1">
                                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusStyles(p.latestAppointment.status)}`}>
                                                                {p.latestAppointment.status}
                                                            </span>
                                                            {p.latestAppointment.symptoms && (
                                                                <div className="group/note relative mt-1">
                                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded-md text-slate-400 group-hover/note:text-blue-500 cursor-help transition-colors">
                                                                        <MessageSquare size={10} />
                                                                        <span className="text-[9px] font-bold uppercase">View Symptoms</span>
                                                                    </div>
                                                                    <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-[10px] rounded-2xl opacity-0 group-hover/note:opacity-100 transition-all z-50 pointer-events-none shadow-2xl border border-slate-800">
                                                                        <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-2">
                                                                            <Activity size={12} className="text-blue-400" />
                                                                            <span className="font-black text-blue-400 uppercase tracking-widest">Patient Report</span>
                                                                        </div>
                                                                        <p className="font-medium italic text-slate-300 leading-relaxed">"{p.latestAppointment.symptoms}"</p>
                                                                        <div className="absolute top-full left-4 border-8 border-transparent border-t-slate-900"></div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                                                                <CalendarCheck size={12} className="text-slate-300" />
                                                                {new Date(p.latestAppointment.appointmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                                                                <Clock size={12} className="text-slate-300" />
                                                                {p.latestAppointment.timeSlot}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <a href={`mailto:${p.user.email}`} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-500 transition-colors">
                                                                <Mail size={12} className="text-slate-300" /> {p.user.email}
                                                            </a>
                                                            <a href={`tel:${p.user.phone}`} className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-500 transition-colors">
                                                                <Phone size={12} className="text-slate-300" /> {p.user.phone}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <button
                                                            onClick={() => handleDelete(p.latestAppointment._id)}
                                                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all border border-red-100 shadow-sm mx-auto flex items-center justify-center"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="py-32 flex flex-col items-center justify-center text-center">
                                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 border border-white shadow-inner mb-4">
                                        <Users size={40} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                        {activeTab === 'processed' ? 'Inbox Zero' : 'Archived records'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-[200px] mt-2 leading-relaxed">
                                        {activeTab === 'processed' ? 'You have no active patient sessions currently in process.' : 'You haven\'t archived any medical history yet.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* RESCHEDULE MODAL */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-white animate-in zoom-in-95 duration-300">
                            <div className="bg-slate-900 p-8 text-white relative">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="absolute top-6 right-6 text-slate-400 hover:text-white p-2 rounded-xl transition-colors"
                                >
                                    <XCircle size={20} />
                                </button>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Rescheduling Portal</span>
                                <h3 className="text-2xl font-black tracking-tight mt-1">Clinical Session Update</h3>
                                <p className="text-slate-400 text-xs font-medium mt-2 leading-relaxed">Adjusting medical appointment for <span className="text-white font-bold">{editingAppointment?.userId?.fullName}</span></p>
                            </div>

                            <div className="p-8 space-y-6 bg-gray-50/50">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Consultation Date</label>
                                        <div className="relative group">
                                            <CalendarCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            <input
                                                type="date"
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer shadow-sm"
                                                value={newDate}
                                                onChange={(e) => setNewDate(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Selected Slot</label>
                                        <div className="relative group">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                            <select
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer appearance-none shadow-sm"
                                                value={newTime}
                                                onChange={(e) => setNewTime(e.target.value)}
                                            >
                                                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                                                <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                                                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                                                <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                                                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="flex-1 py-4 bg-white text-slate-900 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                                    >
                                        Discard
                                    </button>
                                    <button
                                        onClick={handleReschedule}
                                        disabled={actionLoading === editingAppointment?._id}
                                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                                    >
                                        {actionLoading === editingAppointment?._id ? "Processing..." : "Secure Update"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DoctorShowUsers;