import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/users", // Base URL for users route
  withCredentials: true,
});

export default axiosInstance;
