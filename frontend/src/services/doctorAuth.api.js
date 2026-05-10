import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})


export async function doctorRegister({fname, lname, email, phone, age, gender, file, specialization, userName, password}){
    try {
        const formData = new FormData();
        formData.append('fname', fname);
        formData.append('lname', lname);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('age', age);
        formData.append('gender', gender);
        formData.append('file', file);
        formData.append('specialization', specialization);
        formData.append('userName', userName);
        formData.append('password', password);
        const res = await api.post("/doctor/register", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.data;
    } catch (err) {
        let message = "Registration failed. Please try again.";
        if (err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
        } else if (err.message) {
            message = err.message;
        }
        return { error: message };
    }
}  


export async function doctorLogin({ userName, password }) {
    try {
        const res = await api.post("/doctor/login", { userName, password });
        return res.data;
    } catch (err) {
        let message = "Login failed. Please check your credentials.";
        if (err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
        } else if (err.message) {
            message = err.message;
        }
        return { error: message };
    }
}

export async function doctorLogout() {
    try {
        const res = await api.get("/doctor/logout")
        return res.data
    } catch (err) {
        console.error('Doctor logout error:', err);
    }
}

export async function getDoctor() {
    try {
        const res = await api.get("/doctor/get-doctor")
        return res.data
    } catch (err) {
        console.log(err)
        return null;
    }
}

/**
 * @function getAllPendingDoctors
 * @route /doctor/all-pending-doctors
 * @description to get all pending doctors
 * @access public
 */
export async function getAllPendingDoctors() {
    try {
        const res = await api.get("/doctor/all-pending-doctors")
        return res.data
    } catch (err) {
        console.log(err)
    }
}

/**
 * @function deletePendingDoctor
 * @route /doctor/delete-pending-doctor/:id
 * @description to delete a pending doctor
 * @access public
 */
export async function deletePendingDoctor(id) {
    try {
        const res = await api.delete(`/doctor/delete-pending-doctor/${id}`)
        return res.data
    } catch (err) {
        console.log(err)
    }
}
