import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true
})


// api.interceptors.response.use(
//     (response) => response,
//     (error) =>{
//         if (error.response && error.response.status === 401) {
//             localStorage.removeItem("token");
//             // Handle unauthorized access, e.g., redirect to login
//             console.error("Unauthorized access - perhaps redirect to login?");
//         }
//         return Promise.reject(error);
//     }
// )