import React from "react";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import BrandedLoader from "../components/BrandedLoader";
import { useState, useEffect } from "react";

const About = () => {
  const [pageLoading, setPageLoading] = useState(true);


  if (pageLoading) {
    return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
  }

  return (

    
    <div
      className="bg-cover bg-no-repeat "
      style={{ backgroundImage: "url('/back2.png')" }}
    >

        {/* NaAVBAR */}
        <Navbar/>
      <div className="max-w-7xl mt-10 md:mt-20 mx-auto px-6 pb-20">

        {/* ABOUT IMAGE + TEXT */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20">

          {/* Image */}
          <div className="flex justify-center w-full md:w-1/2">
            <div
              className="w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px] rounded-full bg-cover bg-center shadow-2xl shadow-gray-400"
              style={{ backgroundImage: "url('/doctor5.png')" }}
            ></div>
          </div>

          {/* Text */}
          <div className="text-center md:text-left w-full md:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold text-black mb-6 font-heading">
              About Our Medical
            </h2>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed font-body">
              At Vital Ease, we believe in the transformative power of optimal
              health and well-being. Our mission is to empower individuals to
              lead healthier, happier lives by providing comprehensive and
              reliable medical information, resources, and support. Whether
              you're navigating a specific health concern, seeking preventive
              care advice, or looking to enhance your overall well-being,
              Vital Ease is here for you every step of the way.
            </p>
          </div>
        </div>

        {/* INFO BLOCKS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">

          {/* Block 1 */}
          <div className="bg-sky-400 p-8 text-white rounded-2xl shadow-lg">
            <h3 className="text-4xl font-bold font-heading">01</h3>

            <h4 className="text-2xl font-bold font-heading border-b font-heading border-white pb-2 mt-2">
              Our Commitment
            </h4>

            <p className="mt-4 text-base md:text-lg text-justify font-body">
              Vital Ease is more than just a medical website; it's a community
              dedicated to fostering a culture of health consciousness. We are
              committed to delivering accurate, up-to-date, and accessible
              information to empower you to make informed decisions about your
              health.
            </p>
          </div>

          {/* Block 2 */}
          <div className="bg-purple-100 p-8 text-black rounded-2xl shadow-lg">
            <h3 className="text-4xl font-bold font-heading">02</h3>

            <h4 className="text-2xl font-bold font-heading border-b border-blue-900 pb-2 mt-2">
              Our Vision
            </h4>

            <p className="mt-4 text-base md:text-lg font-body text-justify">
              Our vision at Vital Ease is to create a world where everyone has
              the tools and knowledge to prioritize their health and lead
              fulfilling lives. We envision a community that actively engages
              in conversations about health and supports one another on the
              journey to well-being.
            </p>
          </div>

          {/* Block 3 */}
          <div className="bg-gray-600 p-8 text-white rounded-2xl shadow-lg">
            <h3 className="text-4xl font-bold font-heading">03</h3>

            <h4 className="text-2xl font-bold font-heading border-b border-white pb-2 mt-2">
              Vital Ease Community
            </h4>

            <p className="mt-4 text-base md:text-lg font-body text-justify">
              Whether you are a seasoned health enthusiast or just beginning
              your wellness journey, Vital Ease invites you to join our
              community. Explore our articles, engage in discussions, and
              discover the wealth of information waiting for you.
            </p>
          </div>

        </div>
      </div>

      {/* NAVBAR */}
      <Footer/>


    </div>
  );
};

export default About;