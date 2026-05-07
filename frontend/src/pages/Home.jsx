import React from "react";
import { useEffect, useRef } from "react";
import hero from "../assets/hero-bg.jpg";
import { FaSyringe } from "react-icons/fa";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from "react-router-dom";
import BrandedLoader from "../components/BrandedLoader";

const Home = () => {
  const [pageLoading, setPageLoading] = React.useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;


    const interval = setInterval(() => {
      if (slider) {
        slider.scrollLeft += 1;

        // reset when end reached
        if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
          slider.scrollLeft = 0;
        }
      }
    }, 20); // speed

    return () => clearInterval(interval);
  }, []);

  if (pageLoading) {
    return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
  }

  return (
    <div className="overflow-x-hidden">
      <div className="w-full">
        {/* HERO SECTION */}
        <section
          className="min-h-screen h-dvh bg-fixed text-left bg-cover bg-center flex flex-col justify-start items-start"
          style={{ backgroundImage: `url(${hero})` }}
        >
          {/* NAVBAR */}
          <Navbar />
          <div className="grow flex flex-col justify-center px-6 md:px-18">
            <h1 className="text-white font-heading text-4xl md:text-5xl md:mt-10 md:ml-9 font-bold">
              <span className="block border-b-4 pt-6 border-orange-500 pb-2 w-fit">
                Your Health,
              </span>

              <span className="block border-b-4 border-orange-500 pb-2 w-fit mt-2">
                Our Priority
              </span>
            </h1>

            <p className="text-sky-500 text-2xl md:text-3xl md:ml-18 mt-4 font-body">
              Better healthcare<br /> for better tomorrow...
            </p>
          </div>
          <div className="w-full flex flex-row justify-center items-center pb-12">
            <Link to="/login"> <button className="bg-[#000080] font-body text-white px-8 py-3 w-fit rounded-full text-xl hover:bg-white hover:text-[#000080] transition animate-heartbeat">
              Get Started
            </button></Link>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section className="gap-10 px-6 py-12 md:px-10 md:py-16 flex flex-col md:flex-row justify-evenly h-fit items-center overflow-hidden">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Why Choose Our Medical Services?
            </h2>

            <p className="text-lg font-body text-gray-700 leading-relaxed">
              Our medical services stand out for their specialized focus on the
              healthcare industry, ensuring compliance with regulations and
              improving patient engagement. We provide online appointment
              scheduling, patient portals, and comprehensive medical solutions.
            </p>
          </div>

          <div className="flex justify-center md:justify-end md:mr-15">
            <img
              src="/doctor2.jpg"
              alt="doctor"
              className="rounded-full h-64 w-64 md:h-100 md:w-100 object-cover shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
            />
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-gray-200 pb-15 py-8 px-6 md:px-20 lg:px-15">
          <div className="text-center">
            <h2 className="text-center text-4xl font-bold border-b-3 border-orange-500 inline-block mb-12">
              Key <span className="text-[#000080] ">Features</span>
            </h2>
          </div>


          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 min-h-45 rounded-xl shadow-[10px_10px_20px] shadow-slate-300 flex flex-col sm:flex-row justify-start transition-all hover:shadow-2xl">
              <div className="flex flex-row sm:flex-col justify-center items-center border-b-2 sm:border-b-0 sm:border-r-2 w-full sm:w-36 border-orange-500 pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-xl md:text-2xl sm:-rotate-90 whitespace-nowrap font-bold text-blue-900 font-heading">
                  Safety and <br/> Security
                </h3>
              </div>
              <div className="font-body flex flex-col justify-center p-4 sm:pl-8">
                <ul className="list-disc ml-4 text-base md:text-lg">
                  <li>Patient and staff safety protocols</li>
                  <li>Emergency response plans</li>
                  <li>Infection control measures</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 min-h-45 rounded-xl shadow-[-10px_10px_20px] shadow-slate-300 flex flex-col sm:flex-row justify-start transition-all hover:shadow-2xl">
              <div className="flex flex-row sm:flex-col justify-center items-center border-b-2 sm:border-b-0 sm:border-r-2 w-full sm:w-36 border-orange-500 pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-xl md:text-2xl sm:-rotate-90 whitespace-nowrap font-bold text-blue-900 font-heading">
                  Efficient <br/>Operations
                </h3>
              </div>
              <div className="font-body flex flex-col justify-center p-4 sm:pl-8">
                <ul className="list-disc ml-4 text-base md:text-lg">
                  <li>Streamlined admission process</li>
                  <li>Patient flow management</li>
                  <li>Inventory management</li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-6 min-h-45 rounded-xl shadow-[10px_-10px_20px] shadow-slate-300 flex flex-col sm:flex-row justify-start transition-all hover:shadow-2xl">
              <div className="flex flex-row sm:flex-col justify-center items-center border-b-2 sm:border-b-0 sm:border-r-2 w-full sm:w-36 border-orange-500 pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-xl md:text-2xl sm:-rotate-90 whitespace-nowrap font-bold text-blue-900 font-heading">
                  Financial <br/>Transparency
                </h3>
              </div>
              <div className="font-body flex flex-col justify-center p-4 sm:pl-8">
                <ul className="list-disc ml-4 text-base md:text-lg">
                  <li>Transparent billing policies</li>
                  <li>Patient assistance programs</li>
                  <li>Financial counseling services</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 min-h-45 rounded-xl shadow-[-10px_-10px_20px] shadow-slate-300 flex flex-col sm:flex-row justify-start transition-all hover:shadow-2xl w-full">
              <div className="flex flex-row sm:flex-col justify-center items-center border-b-2 sm:border-b-0 sm:border-r-2 w-full sm:w-36 border-orange-500 pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-xl md:text-2xl sm:-rotate-90 whitespace-nowrap font-bold text-blue-900 font-heading">
                  Patient <br/>Satisfaction
                </h3>
              </div>
              <div className="font-body flex flex-col justify-center p-4 sm:pl-8">
                <ul className="list-disc ml-4 text-base md:text-lg">
                  <li>Regular feedback mechanisms</li>
                  <li>Patient satisfaction surveys</li>
                  <li>Continuous improvements</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PLANS */}
        <section className="py-8 bg-linear-to-br from-gray-400 via-white to-pink-200 text-center">
          <h2 className="text-4xl font-bold border-b-3 border-orange-500 inline-block mb-4 font-heading">
            Choose the Perfect <span className="text-[#000080]">Plan</span>
          </h2>

          <p className="mb-10 text-lg font-body px-6 max-w-2xl mx-auto">
            Unlock the full potential of your online presence with our flexible pricing options tailored for your needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-10 max-w-7xl mx-auto items-center">
            {/* FREE */}
            <div className="bg-radial from-indigo-200 via-indigo-150 via-indigo-50 to-indigo-50 min-h-112.5 p-8 rounded-2xl border border-[#000080] shadow-sm flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300 w-full max-w-sm mx-auto">
              <h3 className="text-3xl font-bold text-strt font-heading">FREE</h3>
              <p className="text-5xl font-bold mt-4 text-sart"><span className="text-3xl font-semibold">₹</span>0</p>
              <div className="w-20 h-8 border-b-4 border-[#000080]"></div>
              <ul className="mt-6 space-y-2 text-center text-gray-900 "><br /><br />
                <li>Patient Registration</li>
                <li>Appointment Scheduling</li>
                <li>User Authentication</li>
                <li>Reports</li>
              </ul>
              <br />
              <button className="mt-6 border border-[#000080] px-6 py-2 rounded-full hover:scale-105 transition">
                Continue with Free
              </button>
            </div>

            {/* PRO */}
            <div className="bg-radial from-gray-300 via-gray-150 via-white to-white p-8 rounded-2xl min-h-125 border border-blue-900 shadow-xl lg:scale-105 flex flex-col justify-center items-center hover:shadow-2xl transition-all duration-300 w-full max-w-sm mx-auto relative z-10">
              <h3 className="text-2xl font-bold">PRO</h3>
              <p className="text-5xl font-bold mt-4"><span className="text-3xl font-semibold">₹</span>5000</p>
              <div className="w-20 h-8 border-b-4 border-orange-500"></div>
              <ul className="mt-6 space-y-2 text-center"><br />
                <li>Comprehensive Patient Records</li>
                <li>Customer Support</li>
                <li>Advanced Security</li>
                <li>Lab Integration</li>
                <li>Advanced Analytics</li>
                <li>Billing & Invoicing</li>
              </ul>
              <br />
              <button className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-full hover:scale-105 transition">
                Try Pro Plan
              </button>
            </div>

            {/* BASIC */}
            <div className="bg-radial from-indigo-200 via-indigo-150 via-indigo-50 to-indigo-50 min-h-112.5 p-8 rounded-2xl border border-blue-900 shadow-sm flex flex-col justify-center items-center hover:shadow-xl transition-all duration-300 w-full max-w-sm mx-auto">
              <h3 className="text-2xl font-bold">BASIC</h3>
              <p className="text-5xl font-bold mt-4"><span className="text-3xl font-semibold">₹</span>1000</p>
              <div className="w-20 h-8 border-b-4 border-[#000080]"></div>
              <ul className="mt-6 space-y-2 text-center"><br /><br />
                <li>Enhanced Patient Registration</li>
                <li>Billing & Invoicing</li>
                <li>Electronic Health Records</li>
                <li>Inventory Management</li>
              </ul>
              <br />
              <button className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-full hover:scale-105 transition font-heading">
                Try Basic Plan
              </button>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section className="bg-[#FFD7DE] py-8 text-center">
          <h2 className="text-4xl font-bold border-b-3 border-orange-500 inline-block mb-10">
            Our <span className="text-[#000080]">Gallery</span>
          </h2>

          <div className="relative overflow-hidden w-full px-8">
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-60 h-48 bg-cover bg-center rounded-lg shadow-lg hover:scale-105 transition duration-300 inline-block"
                  style={{ backgroundImage: `url('/hos-img/hos${i + 1}.jpg')` }}
                />
              ))}
              {/* Duplicate for infinite effect */}
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={"dup-" + i}
                  className="min-w-60 h-48 bg-cover bg-center rounded-lg shadow-lg opacity-70 transition duration-300 inline-block"
                  style={{ backgroundImage: `url('/hos-img/hos${i + 1}.jpg')` }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* REPORT CTA */}
        <section className="bg-black text-white text-center py-16">
          <h2 className="text-4xl mb-4 font-heading">
            Enhance Your Medical Reports
          </h2>

          <p className="mb-8 font-body">
            Discover the benefits of better healthcare with us
          </p>

          <button className="bg-blue-900 px-8 py-3 rounded-full text-lg hover:bg-pink-200 duration-500 transition hover:text-black">
            Learn More
          </button>
        </section>

        {/* FAQ */}
        <section className="bg-[#ffdab9] py-8 px-10">
          <div className="grid md:grid-cols-4 gap-10  ">
            <div className="flex flex-col justify-center border-r-3 border-orange-500">
              <h2 className="text-4xl font-bold text-amber-950">
                Common <br />questions
              </h2>

              <p className="mt-4 text-lg font-Helvetica text-amber-800">
                Here are some of the most common questions that we get.
              </p>
            </div>

            <div className="md:col-span-3 ">
              <div>
                <span className="flex items-start gap-2 font-semibold font-heading text-xl text-amber-950">
                  <FaSyringe className="mt-1 size-5" />What are the recommended guidelines for a healthy diet?
                </span>
                <p className="font-body text-[16px] ml-7 text-justify text-amber-900">
                  A healthy diet should include a variety of fruits, vegetables, whole grains, lean proteins, and limited amounts of saturated fats, cholesterol, salt, and added sugars.<br /><br />
                </p>
                <span className="flex items-start gap-2 font-semibold font-heading text-xl text-amber-950">
                  <FaSyringe className="mt-1 size-5" />How can I manage stress for better overall health?
                </span>
                <p className="font-body text-[16px] ml-7 text-justify text-amber-900">
                  Stress management techniques include regular exercise, mindfulness meditation, deep breathing exercises, adequate sleep, and maintaining a healthy work-life balance.<br /><br />
                </p>
                <span className="flex items-start gap-2 font-semibold font-heading text-xl text-amber-950">
                  <FaSyringe className="mt-1 size-5" />What is the purpose of a routine medical check-up?
                </span>
                <p className="font-body text-[16px] ml-7 text-justify text-amber-900">
                  A routine medical check-up helps assess overall health, detect potential health issues early, and establish a baseline for future comparisons.<br /><br />
                </p>
                <span className="flex items-start gap-2 font-semibold font-heading text-xl text-amber-950">
                  <FaSyringe className="mt-1 size-5" />What are common symptoms of a heart attack?
                </span>
                <p className="font-body text-[16px] ml-7 text-justify text-amber-900">
                  Common symptoms of a heart attack include chest pain or discomfort, shortness of breath, nausea, lightheadedness, and pain or discomfort in the arms, back, neck, jaw, or stomach.<br /><br />
                </p>
                <span className="flex items-start gap-2 font-semibold font-heading text-xl text-amber-950">
                  <FaSyringe className="mt-1 size-5" />How can I prevent the spread of infectious diseases?
                </span>
                <p className="flex items-start gap-2 ml-7 font-body text-[16px] text-justify text-amber-900">
                  Practice good hygiene, such as frequent handwashing, covering your mouth and nose when coughing or sneezing, staying up to date on vaccinations, and avoiding close contact with sick individuals.<br />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <div>
          <Footer />
        </div>
      </div>
    </div>
  )
}

export default Home