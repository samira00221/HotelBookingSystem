import React, { useState, useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onContactClick, onAboutClick }) => {
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const location = useLocation();


























































  

  useEffect(() => {
    // Check token on mount and on route change
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location.pathname]);

  useEffect(() => {
    // Listen for storage changes (other tabs)
    const onStorage = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleNav = () => setNav(!nav);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className='flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
      <h1 className='text-3xl font-bold text-[#00df9a] cursor-pointer' onClick={() => navigate("/")}>TRAVELLA.</h1>
      <ul className='hidden md:flex space-x-6'>
        <li
          className='p-4 cursor-pointer hover:text-[#00df9a]'
          onClick={onAboutClick}
        >
          About
        </li>
        <li
          className='p-4 cursor-pointer hover:text-[#00df9a]'
          onClick={onContactClick}
        >
          Contact
        </li>
        {isLoggedIn ? (
          <>
            <li className='p-4 cursor-pointer hover:text-[#00df9a]'>
              <Link to="/account">Account</Link>
            </li>
            <li className='p-4 cursor-pointer hover:text-[#00df9a]'>
              <button onClick={handleLogout} className="bg-transparent border-none text-white hover:text-[#00df9a]">Logout</button>
            </li>
          </>
        ) : (
          <li className='p-4 cursor-pointer hover:text-[#00df9a]'>
            <Link to="/login">Sign In</Link>
          </li>
        )}
      </ul>
      <div onClick={handleNav} className='block md:hidden cursor-pointer'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>
      <div className={nav ? 'fixed left-0 top-0 w-[60%] border-r border-gray-900 bg-[#000300] ease-in-out duration-500 h-full z-50' : 'fixed left-[-100%]'}>
        <h1 className='text-3xl font-bold text-[#00df9a] m-4 cursor-pointer' onClick={() => { navigate("/"); setNav(false); }}>TRAVELLA.</h1>
        <ul className='pt-12 uppercase p-4'>
          <li
            className='p-4 border-b border-gray-600 cursor-pointer hover:text-[#00df9a]'
            onClick={() => { onAboutClick && onAboutClick(); setNav(false); }}
          >
            About
          </li>
          <li
            className='p-4 border-b border-gray-600 cursor-pointer hover:text-[#00df9a]'
            onClick={() => { onContactClick && onContactClick(); setNav(false); }}
          >
            Contact
          </li>
          {isLoggedIn ? (
            <>
              <li className='p-4 border-b border-gray-600 cursor-pointer hover:text-[#00df9a]'>
                <Link to="/account" onClick={() => setNav(false)}>Account</Link>
              </li>
              <li className='p-4 border-b border-gray-600 cursor-pointer hover:text-[#00df9a]'>
                <button onClick={() => { handleLogout(); setNav(false); }} className="bg-transparent border-none text-white hover:text-[#00df9a]">Logout</button>
              </li>
            </>
          ) : (
            <li className='p-4 border-b border-gray-600 cursor-pointer hover:text-[#00df9a]'>
              <Link to="/login" onClick={() => setNav(false)}>Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;