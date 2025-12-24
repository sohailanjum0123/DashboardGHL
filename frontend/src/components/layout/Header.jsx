import React from 'react';

const Header = () => {
  return (
    <header className="w-full bg-yellow-500 flex items-center justify-between px-6 py-4">
      
      <h1 className="text-xl font-semibold text-white">App Dashboard</h1>
      <button className="font-bold text-white">Logout</button>
    </header>
  );
};



export default Header;