import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

export default function adminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Optional: fetch logged in user from API or localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }
    setUser(storedUser);

    // Role-based redirect
    if (storedUser.role === "user") {
      navigate("/dashboard/products", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      navigate("/", { replace: true }); 
    } catch (error) {
      console.error(error);
      alert("Logout failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={handleLogout} />
      <div className="flex flex-1 bg-bg">
        <Sidebar role={user?.role} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome {user?.fullName}
          </h1>
        </div>
      </div>
    </div>
  );
}
