import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import {
    LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus,
    UserRoundCheck, LogOut, MessageSquare, Clock, User, Mail, Phone,
    Trash2, CheckCircle2, Search, Archive, FolderCheck, ArrowLeftRight
} from 'lucide-react';
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { useContact } from '../../hooks/useContact';
import BrandedLoader from '../../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';

const ShowContacts = () => {
    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Contacts');
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'resolved'
    const [searchQuery, setSearchQuery] = useState('');

    const { loading: authLoading, handleAdminLogout } = useAdminAuth()
    const { contacts, loading, handleGetContacts, handleDeleteContact, handleUpdateContact } = useContact()
    const navigate = useNavigate()

    useEffect(() => {
        handleGetContacts();
    }, []);

    const handleLogout = async () => {
        await handleAdminLogout()
        navigate('/login')
    }

    const onUpdateStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'contacted' : 'pending';
        await handleUpdateContact(id, { status: newStatus });
    }

    const onDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this contact?")) {
            await handleDeleteContact(id);
        }
    }

    const filteredContacts = contacts.filter(c => {
        const isCorrectTab = activeTab === 'active'
            ? (c.status === 'pending' || !c.status)
            : (c.status === 'contacted');

        const fullName = `${c.fname} ${c.lname}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase());

        return isCorrectTab && matchesSearch;
    });

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
                className="relative transition-all duration-300 grow min-h-screen"
                style={{
                    marginLeft: isSidebarHide ? 80 : 208,
                    width: `calc(100% - ${isSidebarHide ? 80 : 208}px)`
                }}
            >
                {/* Navbar */}
                <nav className="h-14 bg-white flex items-center px-8 sticky justify-between top-0 z-[1000] border-b border-slate-50">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800">Contact Management</h2>
                    </div>
                </nav>

                <main className="p-6 bg-slate-200 rounded-tl-2xl min-h-screen">
                    <div className='bg-gray-50 p-6 rounded-2xl shadow-inner min-h-[calc(100vh-120px)]'>

                        {/* STATS HEADER */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-blue-500 uppercase">Active</span>
                                        <span className="text-xl font-black text-slate-900">{contacts.filter(c => !c.status || c.status === 'pending').length}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Resolved</span>
                                        <span className="text-xl font-bold text-slate-400">{contacts.filter(c => c.status === 'contacted').length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 bg-white p-1 rounded-full shadow-sm border border-slate-100">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'active' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Active Inquiries
                                </button>
                                <button
                                    onClick={() => setActiveTab('resolved')}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'resolved' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    History
                                </button>
                            </div>
                        </div>

                        {/* SEARCH & FILTERS */}
                        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by lead name or email..."
                                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full">
                                {filteredContacts.length} Leads Found
                            </div>
                        </div>

                        {/* DATA TABLE */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            {loading ? (
                                <div className="py-20">
                                    <BrandedLoader text="Synchronizing Data..." />
                                </div>
                            ) : filteredContacts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-50">
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lead Information</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Details</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Message Segment</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Workflow</th>
                                                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredContacts.map((contact) => (
                                                <tr key={contact._id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200 uppercase text-xs">
                                                                {contact.fname?.[0]}{contact.lname?.[0]}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-slate-900 capitalize leading-tight">{contact.fname} {contact.lname}</span>
                                                                <span className="text-[10px] font-medium text-slate-400 mt-0.5">{new Date(contact.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1">
                                                            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                                                <Mail size={12} className="text-slate-300" /> {contact.email}
                                                            </a>
                                                            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                                                <Phone size={12} className="text-slate-300" /> {contact.phone}
                                                            </a>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs">
                                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                                            <p className="text-[11px] text-slate-500 leading-relaxed italic line-clamp-2">
                                                                "{contact.message}"
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => onUpdateStatus(contact._id, contact.status)}
                                                            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-2 mx-auto ${activeTab === 'active'
                                                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-100'
                                                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                                                }`}
                                                        >
                                                            {activeTab === 'active' ? (
                                                                <><CheckCircle2 size={12} /> Mark Done</>
                                                            ) : (
                                                                <><ArrowLeftRight size={12} /> Restore</>
                                                            )}
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => onDelete(contact._id)}
                                                            className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all flex items-center justify-center shadow-sm border border-red-100 mx-auto"
                                                            title="Delete Inquiry"
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
                                <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
                                    <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 border border-slate-100">
                                        {activeTab === 'active' ? <Archive size={40} /> : <FolderCheck size={40} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                            {activeTab === 'active' ? 'No New Inquiries' : 'No Archive Data'}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs uppercase leading-relaxed tracking-widest">
                                            {activeTab === 'active' ? 'You have cleared all pending leads. Enjoy your inbox zero!' : 'You haven\'t resolved any inquiries yet.'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </section>
        </div>
    )
}

export default ShowContacts;