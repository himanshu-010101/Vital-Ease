import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Doctors from "../pages/Doctors";
import Login from "../pages/Login";
import UserRegister from "../pages/UserRegister"
import DoctorRegister from "../pages/DoctorRegister";
import UserDashboard from "../Dashboards/UserDashboard";
import AdminDashboard from "../Dashboards/AdminDashboard";
import UserProtected from "../components/UserProtected";
import AdminProtected from "../components/AdminProtected";
import DoctorProtected from "../components/DoctorProtected";
import Appointment from "../Dashboards/components/Appointment"
import UserShowAppointments from "../Dashboards/components/UserShowAppointments";
import UserShowDoctors from "../Dashboards/components/UserShowDoctors";
import Service from "../Dashboards/components/Service"
import ShowContacts from "../Dashboards/components/ShowContacts";
import ShowAllUser from "../Dashboards/components/ShowAllUser";
import ApprovedDoctors from "../Dashboards/components/Doctors";
import AdminShowAppointments from "../Dashboards/components/AdminShowAppointments";
import DoctorDashboard from "../Dashboards/DoctorDashboard";
import DoctorShowAppointments from "../Dashboards/components/DoctorShowAppointments";
import DoctorShowUsers from "../Dashboards/components/DoctorShowUsers";

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services/>} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-reg" element={<UserRegister />} />
        <Route path="/doct-reg" element={<DoctorRegister/>} />

        {/* User Routes */}
        <Route path="/dash-user" element={<UserProtected><UserDashboard /></UserProtected>} />
        <Route path="/dash-user/appoint" element={<UserProtected><Appointment /></UserProtected>} />
        <Route path="/dash-user/all-appointments" element={<UserProtected><UserShowAppointments/></UserProtected>}/>
        <Route path="/dash-user/all-doctors" element={<UserProtected><UserShowDoctors/></UserProtected>}/>

        {/* Doctor Routes */}
        <Route path="/dash-doctor" element={<DoctorProtected><DoctorDashboard /></DoctorProtected>} />
        <Route path="/dash-doctor/appointments" element={<DoctorProtected><DoctorShowAppointments/></DoctorProtected>}/>
        <Route path="/dash-doctor/users" element={<DoctorProtected><DoctorShowUsers/></DoctorProtected>}/>

        {/* Admin Routes */}
        <Route path="/dash-admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
        <Route path="/dash-admin/serv_prog" element={<AdminProtected><Service/></AdminProtected>}/>
        <Route path="/dash-admin/allContacts" element={<AdminProtected><ShowContacts/></AdminProtected>}/>
        <Route path="/dash-admin/allUsers" element={<AdminProtected><ShowAllUser/></AdminProtected>}/>
        <Route path="/dash-admin/doctors" element={<AdminProtected><ApprovedDoctors/></AdminProtected>}/> 
        <Route path="/dash-admin/all-appointments" element={<AdminProtected><AdminShowAppointments/></AdminProtected>}/>
      </Routes>
    </>
  );
}

export default AppRoutes;