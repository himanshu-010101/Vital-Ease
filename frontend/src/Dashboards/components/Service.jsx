import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'
import { LayoutDashboard, PieChart, NotebookTabs, Microscope, ShieldPlus, UserRoundCheck, LogOut, Trash2 } from 'lucide-react';
import { useServProg } from '../../hooks/useServProg';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import BrandedLoader from '../../components/BrandedLoader'
import { useNavigate, Link } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner'

const Service = () => {

    const [isSidebarHide, setIsSidebarHide] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Services');
    const [user, setUser] = useState(null)
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [type, setType] = useState("")
    const [error, setError] = useState("")

    const { handleCreateServProg, handleGetAllServProg, handleDeleteServProg, servProg = [], loading } = useServProg();
    const { handleAdminLogout } = useAdminAuth()
    const navigate = useNavigate()

    useEffect(() => {
        async function fetchData() {
            try {
                if (handleGetAllServProg) await handleGetAllServProg();
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, []);

    const handleLogout = async () => {
        await handleAdminLogout()
        navigate('/login')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await handleCreateServProg({
            file,
            title,
            desc,
            type
        });
        if (result && result.error) {
            setError(result.error)
        } else {
            if (handleGetAllServProg) await handleGetAllServProg();
            setTitle("");
            setDesc("");
            setFile(null);
            setType("");
            setError("");
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

            <section
                className={`relative transition-all duration-300 grow`}
                style={{
                    marginLeft: isSidebarHide ? 100 : 230,
                    width: `calc(100% - ${isSidebarHide ? 60 : 280}px)`
                }}
            >
                <nav className="h-14 bg-white flex items-center px-6 sticky flex-row justify-between top-0 z-1000">
                    <div className='flex items-center'>
                        <button onClick={() => setIsSidebarHide(!isSidebarHide)} className="mr-6 p-2 hover:bg-gray-100 rounded-lg">
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
                            <div className="w-5 h-0.5 bg-gray-600"></div>
                        </button>
                        <h2 className="font-bold text-xl text-gray-800">Services Management</h2>
                    </div>
                </nav>

                <main className="p-8 rounded-tl-[20px] bg-[#eaecefaa] min-h-screen" >

                    <div className='w-full rounded-2xl h-fit py-6 flex justify-center bg-cover' style={{ backgroundImage: "url('/background-services.jpg')" }}>
                        <div className="w-full max-w-3xl mb-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-8 text-gray-800">
                            <div className=" w-full flex flex-col justify-center items-center mb-6">
                                <div>
                                    <span className="text-4xl font-semibold text-slate-700 text-center mb-6">Create</span>
                                </div>
                                <div><span className="text-xl text-slate-700 ml-3">a new</span></div>
                                <div>
                                    <span className="text-2xl text-slate-700 font-semibold">Service or Programme</span>
                                </div>
                            </div>

                            <form className="space-y-5" onSubmit={handleSubmit}>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 border font-semibold border-gray-500 rounded-full px-4 py-1 w-fit">Image</label>
                                        <input
                                            type="file"
                                            onChange={(e) => { setFile(e.target.files[0]) }}
                                            className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 border font-semibold border-gray-500 rounded-full px-4 py-1 w-fit">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            placeholder="Yoga"
                                            onChange={(e) => { setTitle(e.target.value) }}
                                            className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 border font-semibold border-gray-500 rounded-full px-4 py-1 w-fit">Description</label>
                                        <input
                                            type="text"
                                            value={desc}
                                            placeholder="Description here..."
                                            onChange={(e) => { setDesc(e.target.value) }}
                                            className="w-full p-3 rounded-full border border-gray-500 bg-transparent outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 border font-semibold border-gray-500 rounded-full px-4 py-1 w-fit">Type</label>
                                        <select
                                            required
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                            className="w-full h-12 px-4 rounded-full bg-transparent border border-gray-500 outline-none appearance-none"
                                        >
                                            <option value="">Choose a type</option>
                                            <option value="service">Service</option>
                                            <option value="programme">Programme</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        {error && <div className=" text-red-500 text-center font-medium">{error}</div>}
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center w-40 h-10 bg-white text-gray-800 font-semibold rounded-full transition duration-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-black enabled:hover:text-white"
                                    >
                                        {loading ? <ThreeDots
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
                    </div>

                    <div className="mt-12 space-y-12">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                                <ShieldPlus className="text-blue-500" /> Existing Services
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {servProg.filter(i => i.type === 'service').map((item) => (
                                    <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                                        <div className="w-full h-40 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteServProg(item._id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                                <Microscope className="text-purple-500" /> Existing Programmes
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {servProg.filter(i => i.type === 'programme').map((item) => (
                                    <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative">
                                        <div className="w-full h-40 overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-lg text-slate-800">{item.title}</h4>
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteServProg(item._id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </main>
            </section>
        </div>
    );
}

export default Service;