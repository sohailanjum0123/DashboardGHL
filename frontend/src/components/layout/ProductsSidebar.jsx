import React from "react";
import { Link } from "react-router-dom";

const ProductsSidebar = ({ userRole }) => {
  return (
    <nav className="h-screen bg-yellow-500 w-60 px-5 py-5">
      <div className="bg-white rounded-sm mb-4">
        <h3 className="text-red font-bold p-2">My App</h3>
      </div>
      <ul>
        <li><Link to="/dashboard/products">Products Home</Link></li>
        <li><Link to="/dashboard/products/orders">My Orders</Link></li>
        <li><Link to="/dashboard/products/settings">Settings</Link></li>
        <li><Link to="/dashboard/products/reports">Reports</Link></li>
      </ul>
    </nav>
  );
};

export default ProductsSidebar;
