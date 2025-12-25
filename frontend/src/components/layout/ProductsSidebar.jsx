import React from "react";
import { Link } from "react-router-dom";

const ProductsSidebar = ({ userRole }) => {
  return (
    <aside className="h-full bg-yellow-500 w-60 px-5 py-5">
      <nav className="">
        <div className="bg-white rounded-sm mb-4"></div>
        <ul>
          <li>
            <Link to="/dashboard/products">Products Home</Link>
          </li>
          <li>
            <Link to="/dashboard/products/orders">My Orders</Link>
          </li>
          <li>
            <Link to="/dashboard/products/settings">Settings</Link>
          </li>
          <li>
            <Link to="/dashboard/products/reports">Reports</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default ProductsSidebar;
