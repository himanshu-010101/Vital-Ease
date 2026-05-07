import { useState, useEffect } from 'react';
import { useAppointments } from '../../hooks/useAppointments';
import { useDepartments } from '../../hooks/useDepartments';
import BrandedLoader from '../../components/BrandedLoader';
import { ThreeDots } from 'react-loader-spinner'

const Appointment = () => {
    const { handleCreateAppointments } = useAppointments();
    const { departments, handleGetAllDepartments, loading } = useDepartments();

    const [department, setDepartment] = useState("");
    const [appointmentType, setAppointmentType] = useState("New Checkup");
    const [date, setDate] = useState("");
    const [timeSlot, setTimeSlot] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [error, setError] = useState("")


    useEffect(() => {
        handleGetAllDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let result = await handleCreateAppointments({
            departmentId: department,
            appointmentDate: date,
            visitType: appointmentType,
            timeSlot,
            symptoms
        });

        if (result && !result.error) {
            setDepartment("")
            setAppointmentType("New Checkup")
            setDate("")
            setTimeSlot("")
            setSymptoms("")
        }
        if (result && result.error) {
            setError(result.error);
        }
    };

    return (
        <div className="flex justify-center items-center py-8 px-4 bg-cover bg-bottom-left rounded-2xl " style={{ backgroundImage: "url('/background-appointment.jpg')" }}>
            <div className="w-full max-w-3xl backdrop-blur-md bg-white/6 border border-white/20 shadow-lg rounded-xl p-8 text-teal-800">

                <h1 className="text-3xl font-semibold text-center mb-8 text-teal-700">
                    Book Appointment
                </h1>

                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* DEPT & AGE ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">Date</label>
                            <input
                                type="date"
                                required
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">Preferred Time</label>
                            <select
                                required
                                onChange={(e) => setTimeSlot(e.target.value)}
                                className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none appearance-none"
                            >
                                <option value="">Choose a slot</option>
                                <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                                <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                                <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                                <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                                <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                                <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                                <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                            </select>
                        </div>
                    </div>

                    {/* VISIT TYPE & DATE ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-1 border font-semibold border-teal-600 rounded-full px-4 py-1 w-fit">Visit Type</label>
                            <select
                                value={appointmentType}
                                onChange={(e) => setAppointmentType(e.target.value)}
                                className="w-full h-10 px-4 rounded-full bg-transparent border border-teal-600 outline-none appearance-none"
                            >
                                <option value="default">Choose a visit type</option>
                                <option value="New Checkup">New Checkup</option>
                                <option value="Follow-up">Follow-up</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-1 border font-semibold border-teal-500 rounded-full px-4 py-1 w-fit">Department</label>
                            <select
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full h-10 px-4 rounded-full border border-teal-500 bg-transparent outline-none appearance-none"
                            >
                                <option value="" disabled>Select Department</option>
                                {Array.isArray(departments) && departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* SYMPTOMS */}
                    <div className="space-y-3 flex flex-col justify-center items-center">
                        <div className="flex justify-center">
                            <label className="border font-semibold border-teal-600 rounded-full px-6 py-1">Symptoms / Notes</label>
                        </div>
                        <textarea
                            required
                            placeholder="Please describe your symptoms..."
                            onChange={(e) => setSymptoms(e.target.value)}
                            className="w-100 h-32 p-4 rounded-3xl bg-transparent border border-teal-600 outline-none resize-none"
                        />
                        <div className='h-2'>
                            {error && <p className="text-red-500 mb-2">{error}</p>}

                        </div>
                    </div>

                    {/* BUTTONS & MESSAGES */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-teal-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-800 transition-all flex items-center justify-center min-w-40"
                        >
                            {loading ? <ThreeDots
                                height="30"
                                width="30"
                                radius="9"
                                color="#ff2f00"
                                ariaLabel="three-dots-loading"
                                visible={true}
                            /> : "Confirm Appointment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Appointment;