import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useContact } from "../hooks/useContact"
import { useServProg } from "../hooks/useServProg"
import BrandedLoader from '../components/BrandedLoader'
import { ThreeDots } from 'react-loader-spinner'

// Static data removed to fetch from backend

const successStories = [
    {
        name: "Carol",
        img: "/picture21.jpg",
        text: "Scheduling an appointment was quick, I received a confirmation email.",
    },
    {
        name: "Jhon",
        img: "/picture22.jpg",
        text: "I used Vital Ease's website to schedule appointment and I was impressed.",
    },
    {
        name: "Alex",
        img: "/picture23.jpg",
        text: "I could quickly find the department I needed and read about doctors.",
    },
    {
        name: "Sophia",
        img: "/picture19.jpg",
        text: "This website is very clean, easy to navigate and user friendly.",
    },
];


export default function Services() {
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessge] = useState("")
    const [error, setError] = useState("")

    const [pageLoading, setPageLoading] = useState(true);


    const { loading, handleCreateContact } = useContact();
    const { handleGetAllServProg, servProg = [] } = useServProg();

    useEffect(() => {
        const fetchContent = async () => {
            await handleGetAllServProg();
        };
        fetchContent();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await handleCreateContact({ fname, lname, phone, email, message })
        if (result && result.error) {
            setError(result.error)
        }
    }

    if (pageLoading) {
        return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
    }

    return (
        <div>

            {/* HERO SECTION */}
            <section>
                <div className="bg-[url('/background-contact.jpg')] bg-cover bg-center">
                    {/* NAVBAR */}
                    <Navbar />
                    <div className="flex justify-center items-center py-8 px-4 ">

                        <div className="w-full max-w-3xl backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-xl p-8 text-teal-800">

                            <h1 className="text-3xl font-semibold text-center mb-8 text-red-700">
                                Contact Us
                            </h1>

                            {/* FORM */}
                            <form className="space-y-6" onSubmit={handleSubmit} >

                                {/* NAME ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="eg:- Hello"
                                            onChange={(e) => { setFname(e.target.value) }}
                                            className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">
                                            Second Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="eg:- User"
                                            onChange={(e) => { setLname(e.target.value) }}
                                            className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none"
                                        />
                                    </div>

                                </div>

                                {/* CONTACT ROW */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    <div>
                                        <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">
                                            Phone Number
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="eg:- 96594 24723"
                                            onChange={(e) => { setPhone(e.target.value) }}
                                            className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="eg:- hello@gmail.com"
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none"
                                        />
                                    </div>

                                </div>

                                {/* MESSAGE */}
                                <div className="text-center">
                                    <label className="border font-semibold border-teal-600 rounded-full px-4 py-1">
                                        Type message here...
                                    </label>
                                </div>

                                <div className="flex justify-center">
                                    <textarea
                                        onChange={(e) => { setMessge(e.target.value) }}
                                        className="w-full max-w-md h-28 p-3 rounded-3xl bg-transparent border border-teal-600 outline-none resize-none"
                                        placeholder="Write your message..."
                                    />
                                </div>
                                <div className="h-1">
                                    {error && (
                                        <div className=" text-red-400 text-center ">{error}</div>
                                    )}
                                </div>
                                {/* BUTTON */}
                                <div className="flex justify-center">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center justify-center w-40 h-10 bg-white text-gray-800 font-semibold rounded-full transition duration-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-black enabled:hover:text-white"

                                    >
                                        {loading ? (
                                            <ThreeDots
                                                height="30"
                                                width="30"
                                                radius="9"
                                                color="#ff2f00"
                                                ariaLabel="three-dots-loading"
                                                visible={true}
                                            />
                                        ) : (
                                            "Submit"
                                        )}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section className="bg-indigo-100 py-8">
                <h2 className="text-3xl md:text-4xl px-6 md:ml-15 font-semibold text-left text-blue-900 mb-12 font-heading">
                    Our Services...
                </h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 px-6">
                    {servProg.filter(item => item.type === 'service').map((service, index) => (
                        <div
                            key={index}
                            className="group bg-indigo-200 my-2 rounded-2xl shadow-[10px_10px_25px] shadow-indigo-300 border-2 border-indigo-300 text-center py-6 transition"
                        >
                            <div className="flex justify-center -mt-14">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-300">
                                    <img
                                        src={service.image}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                                    />
                                </div>
                            </div>
                            <h3 className="font-bold text-xl text-blue-900">
                                {service.title}
                            </h3>
                            <p className="text-blue-950 mt-2 text-[15px] px-3">
                                {service.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROGRAM SECTION */}
            <section className="bg-linear-to-t from-[#F9B299AA] to-[#F5D0C1AA] py-8">
                <h2 className="text-3xl md:text-4xl px-6 md:ml-15 font-semibold text-left text-orange-600 mb-12 font-heading">
                    Our Other Programmes...
                </h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
                    {servProg.filter(item => item.type === 'programme').map((program, index) => (
                        <div
                            key={index}
                            className="text-center group flex flex-col justify-center items-center"
                        >
                            <div className="w-44 h-44 mx-auto rounded-full overflow-hidden border border-orange-500  shadow-[0px_0px_20px] shadow-[#F7A283B4]">
                                <img
                                    src={program.image}
                                    className="w-full h-full object-cover group-hover:scale-110  transition-transform duration-500"
                                />
                            </div>
                            <div className="w-20 flex flex-row justify-center">
                                <h3 className="mt-2 text-center mb-3 font-heading text-2xl font-bold text-orange-500 ">
                                    {program.title}
                                </h3>
                            </div>
                            <button className="mt-2 px-4 py-1 rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-[0px_0px_10px] shadow-orange-500 bg-[#f9a88ab5] w-28 hover:scale-115 transition">
                                Enroll Now
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* SUCCESS STORY SECTION */}
            <section className="bg-gray-200/70 py-8">
                <h2 className="text-3xl md:text-4xl px-6 md:ml-15 font-semibold text-gray-600 mb-10 font-heading">
                    Our Success Stories...
                </h2>

                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 px-6">
                    {successStories.map((story, index) => (
                        <div
                            key={index}
                            className="group h-40 flex items-center rounded-full bg-linear-to-r from-[#fa75449b] via-[#f5a4869b] to-[#f5c3b19b] shadow-xl overflow-hidden border border-orange-200"
                        >
                            {/* Image */}

                            <div className="w-110 h-43 rounded-tr-full rounded-br-full  overflow-hidden border-r-4 border-orange-500">
                                <img
                                    src={story.img}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115"
                                />
                            </div>

                            {/* Text */}

                            <div className="px-4">
                                <h3 className="text-lg font-bold text-orange-600">
                                    {story.name}
                                </h3>

                                <p className="text-sm text-orange-700">
                                    "{story.text}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FOOTER */}
            <Footer />
        </div >
    );
}