import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link } from 'react-router-dom'
import { useUserAuth } from '../hooks/useUserAuth'
import { useDoctorAuth } from "../hooks/useDoctorAuth";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { ThreeDots } from 'react-loader-spinner'
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast'


function Login() {
  const { loading: userLoading, handleUserLogin } = useUserAuth();
  const { loading: adminLoading, handleAdminLogin } = useAdminAuth();
  const { loading: doctorLoading, handleDoctorLogin } = useDoctorAuth();
  const loading = userLoading || doctorLoading || adminLoading;
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [userName, password, role]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role (User or Doctor)");
      toast.error("Please select a role")
      return;
    }

    let result;

    if (role === "user") {
      result = await handleUserLogin({ userName, password });
      if (result && result.success) {
        navigate("/dash-user");
      }
    } else if (role === "doctor") {
      result = await handleDoctorLogin({ userName, password });
      if (result && result.success) {
        navigate("/dash-doctor");
      }
    } else if (role === "admin") {
      result = await handleAdminLogin({ userName, password });
      if (result && result.success) {
        navigate("/dash-admin");
      }
    }

    if (result && result.error) {
      setError(result.error);
    }
  };


  return (
    <div>
      <div className="min-h-screen bg-[url('/background-login.jpg')] bg-cover bg-start font-sans pb-5">
        {/* NAVBAR */}
        <Navbar />
        {/* LOGIN SECTION */}
        <div className="flex justify-center items-center pt-16 px-4">
          <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg rounded-xl p-4 sm:p-8 pt-4 text-white">
            {/* TITLE */}
            <h1 className="text-3xl font-semibold text-center ">
              Login<br /> <span className="text-xl font-semibold">as</span><br />
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="w-full text-center">
                <div className="flex flex-wrap gap-4 items-center mb-8 font-xl font-semibold justify-center px-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors">
                    <input type="radio" name="role" value="user" className="w-4 h-4" onChange={(e) => {
                      setRole(e.target.value)
                    }} />
                    User
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors">
                    <input type="radio" name="role" value="doctor" className="w-4 h-4" onChange={(e) => {
                      setRole(e.target.value)
                    }} />
                    Doctor
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-blue-200 transition-colors">
                    <input type="radio" name="role" value="admin" className="w-4 h-4" onChange={(e) => {
                      setRole(e.target.value)
                    }} />
                    Admin
                  </label>
                </div>
              </div>

              {/* FORM */}
              <div className="space-y-6">

                {/* EMAIL */}
                <div>
                  <label className="block mb-1 border font-semibold border-white/20 rounded-full px-4 py-1 w-fit">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="eg:- helloUser"
                    autoComplete="username"
                    onChange={(e) => {
                      setUserName(e.target.value)
                    }}
                    className="w-full h-11 px-4 rounded-full bg-transparent border border-white/20 outline-none placeholder-white"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block mb-1 border font-semibold border-white/20 rounded-full px-4 py-1 w-fit">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="eg:- Hello@123"
                    autoComplete="current-password"
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
                    className="w-full h-11 px-4 mb-2 rounded-full bg-transparent border border-white/20 outline-none placeholder-white" />
                  <div className="h-1">
                    {error && (
                      <div className=" text-red-400 text-center ">{error}</div>
                    )}
                  </div>

                </div>

                {/* BUTTON */}
                <div className="flex justify-center pt-4">

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
              </div>
            </form>
            <div className="mt-4 text-center  text-black">Don't have an account?
              <Link to="/user-reg" className="text-blue-900 hover:underline text-sm"> Register</Link>
            </div>
          </div>
        </div>

      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Login;