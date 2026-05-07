import React, { useState, useEffect } from 'react'
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Link, useNavigate } from 'react-router-dom'
import { useUserAuth } from '../hooks/useUserAuth'
import BrandedLoader from '../components/BrandedLoader'
import { ThreeDots } from 'react-loader-spinner'

const UserRegister = () => {

  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [dob, setDob] = useState("")
  const [address, setAddress] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { loading, handleUserRegister } = useUserAuth();
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate()


  if (pageLoading) {
    return <BrandedLoader fullScreen={true} onFinished={() => setPageLoading(false)} />;
  }

  const handleSumbit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handleUserRegister({ fname, lname, email, phone, age, gender, dob, address, userName, password });
    if (result && result.success) {
      navigate('/dash-user');
    } else if (result && result.error) {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-[url('/background-userRegister.jpg')] bg-cover bg-no-repeat font-sans">

      {/* Navbar */}
      <Navbar />

      {/* Form Section */}
      <div className="flex justify-center items-center py-8 px-4">
        <div className="w-full max-w-3xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-4 sm:p-8 text-sky-900">
          <div className=" w-full flex flex-col justify-center items-center mb-6 text-center">
            <div>
              <span className="text-2xl md:text-4xl font-semibold font-heading text-heading text-gray-600 mb-2">Register for Free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">as</span>
              <span className="text-xl text-gray-600"><span className="font-bold">Patient</span> or <span className="text-gray-600 font-bold">User</span></span>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSumbit}>
            {/* Row 1 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">First Name</label>
                <input
                  type="text"
                  placeholder="Hello"
                  onChange={(e) => { setFname(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Second Name</label>
                <input
                  type="text"
                  placeholder="User"
                  onChange={(e) => { setLname(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Email</label>
                <input
                  type="email"
                  onChange={(e) => { setEmail(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                  placeholder="hello@gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Phone Number</label>
                <input
                  type="number"
                  placeholder="9658436484"
                  onChange={(e) => { setPhone(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                  required
                />
              </div>
            </div>


            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Age</label>
                <input
                  type="number"
                  placeholder="26"
                  onChange={(e) => { setAge(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Gender</label>
                <div className="flex flex-wrap gap-4 md:gap-14 items-center border pl-3 py-3 font-semibold border-sky-700 rounded-full">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      onChange={(e) => { setGender(e.target.value) }}
                      className="accent-sky-700"
                      required
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      onChange={(e) => { setGender(e.target.value) }}
                      className="accent-sky-700"
                    />
                    Female
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      onChange={(e) => { setGender(e.target.value) }}
                      className="accent-sky-700"
                    />
                    Other
                  </label>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Date of Birth</label>
                <input
                  type="date"
                  placeholder="hello"
                  onChange={(e) => { setDob(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Address</label>
                <input
                  type="text"
                  placeholder="Lucknow"
                  onChange={(e) => { setAddress(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Username</label>
                <input
                  type="text"
                  placeholder="hello_user"
                  onChange={(e) => { setUserName(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 border font-semibold border-sky-700 rounded-full px-4 py-1 w-fit">Password</label>
                <input
                  type="password"
                  placeholder="hello@123"
                  onChange={(e) => { setPassword(e.target.value) }}
                  className="w-full p-3 rounded-full border border-sky-700 bg-transparent outline-none"
                  required
                />
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center justify-center text-sm text-center">
              <input type="checkbox" className="mr-2" required />
              <span>
                I hereby declare that the above information provided is true and correct
              </span>
            </div>

            {/* Submit */}
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
              <div className="h-1">
                {error && (
                  <div className=" text-red-400 text-center ">{error}</div>
                )}
              </div>
            </div>
            <div className="mt-4 text-center  text-black">Aleardy have an Account?
              <Link to="/login" className="text-blue-900 hover:underline text-sm"> Login</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default UserRegister