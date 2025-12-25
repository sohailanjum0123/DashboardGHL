import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import Header from "../components/layout/Header";
import ProductsSidebar from "../components/layout/ProductsSidebar";

export default function ProductsDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      alert("Logout failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onLogout={handleLogout} />
      <div className="flex flex-1 bg-bg">
        <div className="bg-white shadow-md">
          <ProductsSidebar userRole={user?.role} />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Welcome {user?.fullName || "User"}
          </h1>
          <h2 className="text-2xl text-gray-700">Products Dashboard</h2>
        </div>
      </div>
    </div>
  );
}
