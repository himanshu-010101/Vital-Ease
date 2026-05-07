import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import BrandedLoader from "../components/BrandedLoader";
import { useState, useEffect } from "react";
import { useApprovedDoctors } from "../hooks/useApprovedDoctors";

// Static data removed to fetch from backend

// Helper to chunk array into pairs
function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export default function Doctors() {
    const [pageLoading, setPageLoading] = useState(true);

    const { handleGetApprovedDoctors, approvedDoctors = [] } = useApprovedDoctors();

    useEffect(() => {
        const fetchDoctors = async () => {
            await handleGetApprovedDoctors();
        };
        fetchDoctors();
    }, []);

    // Grouping doctors by their specialization name
    const dynamicDoctors = approvedDoctors.filter(doc => doc.isDisplay).reduce((acc, doc) => {
        const category = doc.specialization?.name || "General";
        const found = acc.find(item => item.category === category);
        const docInfo = {
            name: `Dr. ${doc.fname} ${doc.lname}`,
            img: doc.photo
        };

        if (found) {
            found.list.push(docInfo);
        } else {
            acc.push({ category, list: [docInfo] });
        }
        return acc;
    }, []);

    const doctorPairs = chunkArray(dynamicDoctors, 2);

    if (pageLoading) {
        return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
    }

    return (
        <div className="overflow-x-hidden">

            {/* HERO */}
            <div
                className="min-h-125 bg-cover bg-top w-full mb-5"
                style={{ backgroundImage: "url('/background-meetOurTeam.png')" }}
            >
                <Navbar />
            </div>

            {/* TITLE */}
            <div className="text-center py-6 bg-white">
                <h1 className="text-4xl font-heading font-semibold">
                    <span className="border-b-2 border-orange-500">
                        Meet The <span className="text-[#000080]">Doctors</span>
                    </span>
                </h1>
            </div>

            {/* DOCTORS */}
            <div className="flex flex-col gap-8 md:px-10 py-6">
                {doctorPairs.map((pair, rowIdx) => (

                    <div
                        key={rowIdx}
                        className="flex flex-col lg:flex-row justify-center items-stretch py-12 rounded-xl relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-cover bg-center gap-12 lg:gap-0"
                        style={{ backgroundImage: "url('/background-strip.png')" }}
                    >
                        {pair.map((section, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center px-6 md:px-10 lg:px-20">
                                <div className="border-b border-[#000080] mb-8 w-full max-w-2xl mx-auto text-left">
                                    {/* CATEGORY */}
                                    <h2 className="text-2xl md:text-3xl font-sans font-semibold px-2">
                                        {section.category}
                                    </h2>
                                </div>
                                {/* CARDS */}
                                <div className="flex flex-wrap justify-center gap-8 md:gap-10 items-center">
                                    {section.list.map((doc, index) => (

                                        <div
                                            key={index}
                                            className="w-50 bg-gray-200 rounded-full text-center shadow-lg shadow-gray-300 py-6 group flex flex-col justify-center items-center mx-auto"
                                        >
                                            {/* IMAGE */}
                                            <div className="w-38 h-38 rounded-full bg-white flex items-center justify-center shadow-lg shadow-gray-500">
                                                <div className="w-36 h-36 rounded-full overflow-hidden shadow-md">
                                                    <img
                                                        src={doc.img}
                                                        alt={doc.name}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>

                                            {/* NAME */}
                                            <div className="h-20 flex items-center">
                                                <h3 className="font-semibold font-serif text-lg text-center">
                                                    {doc.name.toUpperCase()}
                                                </h3>
                                            </div>

                                            {/* VERIFIED */}
                                            <img
                                                src="/verified.png"
                                                alt="verified"
                                                className="mt-2 w-28"
                                            />
                                        </div>

                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                ))}
            </div>

            {/* FOOT */}
            <div className="text-right pr-4 md:pr-10 py-6 bg-white">
                <span className="text-3xl text-[#000080]">
                    and many more...
                </span>
            </div>
            {/* FOOTER */}
            <Footer />
        </div>


    );
}