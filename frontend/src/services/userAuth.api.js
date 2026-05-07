import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

/**
 * @fuction userRegister
 * @route /user/register
 * @description to register a new user
 * @access public
 */
export async function userRegister({ fname, lname, email, phone, age, gender, dob, address, userName, password }) {
    try {
        const res = await api.post("/user/register", {
            fname, lname, email, phone, age, gender, dob, address, userName, password
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

/**
 * @fuction userLogout
 * @route /user/logout
 * @description to logout a user
 * @access public
 */
export async function userLogout() {
    try {
        const res = await api.get("/user/logout")
        return res.data
    }
    catch (err) {
    }
}


/**
 * @fuction getUser
 * @route /user/getUser
 * @description give the gull information about the user
 * @access public
 */
export async function getUser() {
    try {
        const res = await api.get("/user/getUser")
        return res.data
    } catch (err) {
    }
}
/**
 * @function userLogin
 * @route /user/login
 * @description to login a user
 * @access public
 */
export async function userLogin({ userName, password }) {
    try {
        const res = await api.post("/user/login", { userName, password });
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

export async function deleteUser(id) {
    try {
        const res = await api.delete(`/user/delete/${id}`);
        return res.data;
    } catch (err) {
        let message = "Failed to delete user. Please try again.";
        if (err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
        } else if (err.message) {
            message = err.message;
        }
        return { error: message };
    }
}

export async function getAllUsers() {
    try {
        const res = await api.get("/user/getAllUsers");
        return res.data;
    } catch (err) {
        let message = "Failed to fetch users. Please try again.";
        if (err.response && err.response.data && err.response.data.message) {
            message = err.response.data.message;
        } else if (err.message) {
            message = err.message;
        }
        return { error: message };
    }
}