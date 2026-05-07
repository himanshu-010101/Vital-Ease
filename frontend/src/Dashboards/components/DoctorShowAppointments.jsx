import React, { useState, useEffect, useContext } from 'react'
import logo from '../../assets/logo.png'
import {
  LayoutDashboard, UserRoundCheck, LogOut, Users,
  CalendarCheck, CheckCircle2, XCircle, Clock, Search, Filter,
  Phone, Mail, Award, Edit3, ArrowLeft, MoreVertical, Activity,
  ChevronLeft, Trash2
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

const DoctorShowAppointments = () => {
  const [isSidebarHide, setIsSidebarHide] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Appointments');
  const { doctor } = useContext(DoctorAuthContext);
  const { handleDoctorLogout } = useDoctorAuth()
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
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
      toast.success(`Updated to ${status}`);
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
      toast.success("Rescheduled");
      setIsEditModalOpen(false);
      fetchData();
    } else {
      toast.error(res.error || "Failed to reschedule");
    }
    setActionLoading(null);
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setActionLoading(id);
      const res = await doctorDeleteAppointment(id);
      if (res.success) {
        toast.success("Deleted successfully");
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

  const filteredAppointments = appointments
    .filter(appt => {
      const name = appt.userId?.fullName?.toLowerCase() || "";
      const matchesSearch = name.includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || appt.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

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

      {/* Main Content Area */}
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
            <h2 className="font-bold text-lg md:text-xl text-gray-800 truncate">Appointment Management</h2>
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

        <main className="p-8 bg-slate-200 rounded-tl-2xl">
          <div className='p-4 bg-gray-50 rounded-2xl'>
            {/* Compact Section for Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Today', value: stats?.today || 0, color: 'text-blue-600', icon: <Clock size={16} /> },
                { label: 'Forwarded', value: stats?.forwarded || 0, color: 'text-orange-600', icon: <ArrowLeft size={16} /> },
                { label: 'Confirmed', value: stats?.confirmed || 0, color: 'text-emerald-600', icon: <CheckCircle2 size={16} /> },
                { label: 'Complete', value: stats?.completed || 0, color: 'text-indigo-600', icon: <Award size={16} /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                    <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-slate-50 ${stat.color}`}>{stat.icon}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[70vh]">
              {/* Filters */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/30 flex flex-wrap items-center justify-between gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search patient..."
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Appointments</option>
                    <option value="forwarded">New (Forwarded)</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={fetchData} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
                    <Activity size={18} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Patient</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Workflow</th>
                      <th className="px-6 py-4 text-center">Reschedule</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="py-20">
                          <BrandedLoader text="Loading Appointments..." />
                        </td>
                      </tr>
                    ) : filteredAppointments.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-20 text-slate-400 font-medium">No appointments found.</td></tr>
                    ) : filteredAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-6 py-4 relative group/symptoms">
                          <div className="flex items-center gap-3 cursor-help">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-200">
                              {appt.userId?.photo ? <img src={appt.userId.photo} className="w-full h-full object-cover" /> : appt.userId?.fullName?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-none">{appt.userId?.fullName}</p>
                              <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-wider">{appt.userId?.gender} • {appt.userId?.age} yrs</p>
                            </div>
                          </div>

                          {/* Floating Tooltip for Symptoms */}
                          {appt.symptoms && (
                            <div className="absolute left-[80%] top-1/2 -translate-y-1/2 z-[100] w-64 p-4 bg-slate-900 text-white text-xs rounded-xl shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/symptoms:opacity-100 group-hover/symptoms:scale-100 transition-all duration-200 border border-slate-800">
                              <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold uppercase tracking-widest text-[10px]">
                                User Message
                              </div>
                              <p className="leading-relaxed text-slate-300 italic">"{appt.symptoms}"</p>
                              <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-slate-900"></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-slate-700">{appt.timeSlot}</p>
                          <p className="text-[11px] text-slate-400">{new Date(appt.appointmentDate).toDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyles(appt.status)}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {appt.status === 'forwarded' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(appt._id, 'confirmed')}
                                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                  <CheckCircle2 size={14} /> Confirm
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(appt._id, 'pending')}
                                  className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-lg text-xs font-bold hover:bg-orange-200 transition-all flex items-center gap-1.5"
                                  title="Forward back to Admin"
                                >
                                  <ArrowLeft size={14} /> Back to Admin
                                </button>
                              </>
                            )}

                            {appt.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(appt._id, 'completed')}
                                className="px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <Award size={14} /> Mark Complete
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {appt.status !== 'completed' && appt.status !== 'rejected' && (
                            <button
                              onClick={() => {
                                setEditingAppointment(appt);
                                setNewDate(new Date(appt.appointmentDate).toISOString().split('T')[0]);
                                setNewTime(appt.timeSlot);
                                setIsEditModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all mx-auto"
                              title="Reschedule"
                            >
                              <Edit3 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </section>

      {/* Simple Clean Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/50 p-4">
          <div className=" rounded-xl w-full max-w-md p-8 shadow-xl border bg-linear-to-br from-sky-100 via-sky-100 via-sky-300 to-sky-400 border-white">
            <div className='bg-white/10 backdrop-blur-sm border border-white/40 p-6 rounded-xl'>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Reschedule Appointment</h3>
                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1 border font-bold border-gray-500 rounded-full px-4 py-1 w-fit text-gray-900">Patient</label>
                  <p className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none text-gray-800 placeholder:text-gray-800/40">{editingAppointment?.userId?.fullName}</p>
                </div>

                <div>
                  <label className="block mb-1 border font-bold border-gray-500 rounded-full px-4 py-1 w-fit text-gray-900">New Date</label>
                  <input
                    type="date"
                    className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none text-gray-800 placeholder:text-gray-800/40"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block mb-1 border font-bold border-gray-500 rounded-full px-4 py-1 w-fit text-gray-900">New Time Slot</label>
                  <select
                    className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none text-gray-800 placeholder:text-gray-800/40"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                    <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                    <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                    <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 w-full flex justify-center">
                  <button onClick={handleReschedule} className="flex items-center justify-center w-50 h-10 bg-black text-white font-semibold rounded-full transition duration-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-white enabled:hover:text-black">
                    {actionLoading === editingAppointment?._id ? <BrandedLoader size="sm" text="" /> : "Update Schedule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorShowAppointments;