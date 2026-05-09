import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { HiOutlineHome, HiMenu, HiX } from "react-icons/hi";
import { RiTeamLine } from "react-icons/ri";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaStethoscope } from "react-icons/fa6";
import { CiLogin } from "react-icons/ci";
import { BiNotepad } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { FaUserDoctor } from "react-icons/fa6";

const Navbar = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const registerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (registerRef.current && !registerRef.current.contains(event.target)) {
        setIsRegisterOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full flex justify-center sticky top-0 z-50 transition-all duration-300 px-4 md:px-0">
      <nav className="w-full md:w-[90%] lg:w-[85%] bg-white/90 backdrop-blur-md rounded-full border-2 border-gray-200 md:rounded-full h-20 md:h-22 mt-4 shadow-[0px_0px_8px_1px] mt-5 shadow-slate-600 p-4 md:px-6 md:py-3 flex items-center justify-between relative transition-all duration-300">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img src={logo} alt="logo" className="h-14 md:h-18" />
          </Link>
        </div>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-8 text-xl">
          <li>
            <Link to="/" className="hover:border-b flex flex-row justify-center items-center font-heading font-semibold hover:border-[#000080] hover:font-bold transition-all">
              <HiOutlineHome size={22} color="#000080" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:border-b font-semibold flex flex-row justify-center items-center font-heading hover:border-[#000080] hover:font-bold">
              <RiTeamLine size={22} color="#000080" />
              About
            </Link>
          </li>
          <li>
            <Link to="/services" className="hover:border-b font-semibold font-heading flex flex-row justify-center items-center hover:border-[#000080] hover:font-bold">
              <MdOutlineMedicalServices size={22} color="#000080" />
              Services
            </Link>
          </li>
          <li>
            <Link to="/doctors" className="hover:border-b font-heading hover:border-[#000080] flex flex-row justify-center items-center hover:font-bold font-semibold transition-all">
              <FaStethoscope size={20} color="#000080" />
              Doctors
            </Link>
          </li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/login">
            <button className="border font-heading border-[#000080] flex flex-row justify-center items-center px-5 py-2 rounded-full hover:bg-blue-100 transition">
              <CiLogin size={20} color="#000080" />
              Login
            </button>
          </Link>

          {/* Register Button - Using State Toggling instead of CSS Hover for Mobile/Inspect mode compatibility */}
          <div className="relative inline-block" ref={registerRef}>
            <button
              onClick={() => setIsRegisterOpen(!isRegisterOpen)}
              className="flex items-center transition-colors bg-[#000080] font-heading flex-row justify-center w-28 text-white px-2 py-2 rounded-full"
            >
              <span>
                <BiNotepad size={20} color="white" />
              </span>
              Register
              <svg
                className={`w-4 h-4 ml-2 mt-1 transition-transform ${isRegisterOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Register Choices Dropdown */}
            <div className={`absolute top-full right-0 pt-2 w-44 z-50 transition-all transform origin-top ${isRegisterOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                <Link
                  to="/user-reg"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-5 py-3 text-gray-800 hover:bg-blue-50 hover:text-[#000080] transition-colors flex flex-row justify-start items-center gap-3 border-b border-slate-50"
                >
                  <FaRegUser size={18} color="#000080" />
                  User
                </Link>
                <Link
                  to="/doct-reg"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-5 py-3 text-gray-800 hover:bg-blue-50 hover:text-[#000080] transition-colors flex flex-row justify-start items-center gap-3"
                >
                  <FaUserDoctor size={18} color="#000080" />
                  Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-[#000080] focus:outline-none transition-transform active:scale-90"
          >
            {isMenuOpen ? <HiX size={32} /> : <HiMenu size={32} />}
          </button>

          {/* Mobile Dropdown Menu */}
          <div className={`absolute top-full left-0 right-0 mt-2 mx-auto w-[95%] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 origin-top transform ${isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
            <div className="flex flex-col p-4 gap-2">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#000080] rounded-xl transition-colors"
              >
                <HiOutlineHome size={24} color="#000080" />
                Home
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#000080] rounded-xl transition-colors"
              >
                <RiTeamLine size={24} color="#000080" />
                About
              </Link>
              <Link
                to="/services"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#000080] rounded-xl transition-colors"
              >
                <MdOutlineMedicalServices size={24} color="#000080" />
                Services
              </Link>
              <Link
                to="/doctors"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#000080] rounded-xl transition-colors"
              >
                <FaStethoscope size={24} color="#000080" />
                Doctors
              </Link>
              
              <hr className="my-2 border-slate-100" />
              
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-lg font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#000080] rounded-xl transition-colors"
              >
                <CiLogin size={24} color="#000080" />
                Login
              </Link>

              <div className="p-2 space-y-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider px-2">Register as:</p>
                <div className="flex gap-2">
                  <Link
                    to="/user-reg"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-blue-50 text-[#000080] rounded-2xl hover:bg-blue-100 transition-colors border border-blue-100"
                  >
                    <FaRegUser size={24} />
                    <span className="font-bold">User</span>
                  </Link>
                  <Link
                    to="/doct-reg"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 flex flex-col items-center justify-center gap-2 p-4 bg-[#000080] text-white rounded-2xl hover:bg-blue-900 transition-colors border border-[#000080]"
                  >
                    <FaUserDoctor size={24} />
                    <span className="font-bold">Doctor</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;