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
// DELETE user by ID (admin only)
export const deleteUser = (id) => api.delete(`/user/${id}`);

// GET single user detail by ID
export const getUserDetail = (id) => api.get(`/user/${id}`);

// UPDATE user by ID
export const updateUser = (id, formData) =>
  api.put(`/user/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
// FORGOT PASSWORD - send reset link
export const requestPasswordReset = (email) =>
  api.post("/password/forgot", { email });

// RESET PASSWORD - set new password
export const resetPassword = (token, password) =>
  api.post(`/password/reset/${token}`, { password });