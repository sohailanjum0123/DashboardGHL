import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login";
import SignUp from "./pages/Signup";
import AdminDashboard from "../src/pages/adminDashboard";
import USers from "../src/pages/Users";
import EditUser from "../src/pages/EditUser";
import ProductsDashboard from "../src/pages/ProductsDashboard";
import ForgotPassword from "../src/pages/ForgotPassword";
import ResetPassword from "../src/pages/ResetPassword";
import { Home } from "./pages/Home";


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard/users" element={<USers />} />
        <Route path="/users/edit/:id" element={<EditUser />} />
        <Route path="/dashboard/products/*" element={<ProductsDashboard />} />
      </Routes>
    </Router>
  );
}
