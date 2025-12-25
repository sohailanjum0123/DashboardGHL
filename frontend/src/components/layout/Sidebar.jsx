import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <nav className="bg-yellow-500 w-60 px-5 py-5">
      <ul>
        <li>
          <Link to="/dashboard">
            Dashboard Home
          </Link>
        </li>
        {role === "admin" && (
          <li>
            <Link to="/dashboard/users">
              Users
            </Link>
          </li>
        )}
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
