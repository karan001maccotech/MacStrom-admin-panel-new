import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
    // headers: {
    //     Authorization: 'Bearer API_KEY',
    // },
});
export default axiosInstance;        