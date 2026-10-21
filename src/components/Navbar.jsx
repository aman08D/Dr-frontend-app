import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-wide text-blue-400 whitespace-nowrap mr-4">
            DR Platform
          </Link>

          {/* Desktop Links - Used whitespace-nowrap so text never breaks into 2 lines */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="hover:text-blue-400 transition whitespace-nowrap">
              Home
            </Link>
            <Link to="/products?type=School" className="hover:text-blue-400 transition whitespace-nowrap">
              School Products
            </Link>
            <Link to="/products?type=Printing" className="hover:text-blue-400 transition whitespace-nowrap">
              Printing Services
            </Link>
            <Link to="/doctors" className="hover:text-blue-400 transition whitespace-nowrap">
              Doctors
            </Link>
            <Link to="/workers" className="hover:text-blue-400 transition whitespace-nowrap">
              Manpower
            </Link>
            <Link to="/venues" className="hover:text-blue-400 transition whitespace-nowrap">
              Venues
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {token ? (
              <>
                <Link 
                  to="/admin/products" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition"
                >
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-slate-800 px-4 pt-3 pb-4 space-y-2 text-sm">
          <Link to="/" onClick={() => setIsOpen(false)} className="block py-1.5 hover:text-blue-400">Home</Link>
          <Link to="/products?type=School" onClick={() => setIsOpen(false)} className="block py-1.5 hover:text-blue-400">School Products</Link>
          <Link to="/products?type=Printing" onClick={() => setIsOpen(false)} className="block py-1.5 hover:text-blue-400">Printing Services</Link>
          <Link to="/doctors" onClick={() => setIsOpen(false)} className="block py-1.5 hover:text-blue-400">Doctors</Link>
          <Link to="/workers" onClick={() => setIsOpen(false)} className="block py-1.5 hover:text-blue-400">Manpower</Link>
          <Link to="/venues" onClick={() => setIsOpen(false)} className="block py-1.5 hover:text-blue-400">Venues</Link>
          
          <div className="border-t border-gray-700 pt-2 flex space-x-2">
            {token ? (
              <>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="bg-blue-600 px-3 py-1.5 rounded text-xs text-white font-semibold">Admin Panel</Link>
                <button onClick={() => { setIsOpen(false); handleLogout(); }} className="bg-red-600 px-3 py-1.5 rounded text-xs text-white font-semibold">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-blue-600 px-3 py-1.5 rounded text-xs text-white font-semibold">Admin Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;