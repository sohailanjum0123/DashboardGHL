import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <nav className="h-screen bg-yellow-500 w-60 px-5 py-5">
      <div className="bg-white rounded-sm">
        <h3 className="text-red font-bold p-2">My App</h3>
      </div>
      <ul>
        <li>
          <Link to="/dashboard">
            Dashboard Home
          </Link>
        </li>

        {/* Only show Users link for admin */}
        {role === "admin" && (
          <li>
            <Link to="/dashboard/users">
              Users
            </Link>
          </li>
        )}

        {/* Only show Products link for normal users */}
        {role === "user" && (
          <li>
            <Link to="/dashboard/products">
              Products
            </Link>
          </li>
        )}

        <li>
          <Link to="/dashboard/settings">
            Settings
          </Link>
        </li>
        <li>
          <Link to="/dashboard/reports">
            Reports
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
