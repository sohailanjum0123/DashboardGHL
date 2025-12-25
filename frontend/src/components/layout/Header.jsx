import { useEffect,useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/api";

const Header = () => {
  const navigate = useNavigate();
   const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }
    setUser(storedUser);

    if (storedUser.role === "user") {
      navigate("/dashboard/products", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  const avatarUrl =
    user?.avatar && user.avatar.startsWith("http")
      ? user.avatar
      : "/default-avatar.png";

 return (
    <header className="w-full bg-yellow-500 flex items-center justify-between px-6 py-4">
      <h1 className="text-xl font-semibold text-white">App Dashboard</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 focus:outline-none"
        >
          <img
          src={avatarUrl}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border overflow-hidden z-50">
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-semibold">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Profile Settings
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
