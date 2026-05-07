import AppRoutes from './routes/AppRoutes'
import './index.css'
import { UserAuthProvider } from './context/userAuth.context.jsx'
import { DepartmentProvider } from './context/department.context.jsx'
import { AppointmentProvider } from './context/appointment.context.jsx'
import { DoctorAuthProvider } from './context/doctorAuth.context.jsx'
import { ContactProvider } from './context/contact.context.jsx'
import { AdminProvider } from './context/admin.context.jsx'
import { ServProgProvider } from './context/serProg.context.jsx'
import { ApprovedDoctorsProvider } from './context/approvedDoctors.jsx'
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="h-dvh w-full">
      <AdminProvider>
        <UserAuthProvider>
          <DoctorAuthProvider>
            <ApprovedDoctorsProvider>
              <ServProgProvider>
                <DepartmentProvider>
                  <ContactProvider>
                    <AppointmentProvider>
                      <AppRoutes />
                      <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                        toastOptions={{ duration: 4000 }}
                      />
                    </AppointmentProvider>
                  </ContactProvider>
                </DepartmentProvider>
              </ServProgProvider>
            </ApprovedDoctorsProvider>
          </DoctorAuthProvider>
        </UserAuthProvider>
      </AdminProvider>
    </div>
  )
}

export default App
