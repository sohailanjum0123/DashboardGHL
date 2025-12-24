import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1/users", // backend
  withCredentials: true, // ✅ required for cookies
});


export const registerUser = (formData) => api.post("/register", formData);
export const loginUser = (data) => api.post("/login", data);
export const logoutUser = () => api.post("/logout");
export const refreshAccessToken = () => api.post("/access-token");
export const searchUser = (keyword) => api.get(`/search?keyword=${keyword}`);
export const getAllUsers = () => api.get("/users");
