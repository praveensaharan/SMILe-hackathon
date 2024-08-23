import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaUserPlus,
  FaSignInAlt,
  FaWpforms,
} from "react-icons/fa";
import React, { useState } from "react";
// import Logo from "../assets/logo-no-background.png";
import Logo from "../../assets/logo-no-background.png";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <header className="fixed top-0 z-20 w-full py-2 shadow-md backdrop-blur-lg transition-all duration-500">
      <div className="mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex shrink-0 p-2 rounded-2xl border-2">
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-white"
            >
              <img src={Logo} alt="Logipredict" className="h-8 w-28" />
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:justify-center md:gap-5">
            <NavLink
              to="/admin/dashboard"
              label="Home"
              icon={<FaHome />}
              currentPath={currentPath}
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <SignedOut>
              <NavLink
                to="/signin"
                label="Signin"
                icon={<FaSignInAlt />}
                currentPath={currentPath}
              />
            </SignedOut>
            <SignedIn>
              <UserButton className="text-black bg-orange-500 hover:bg-orange-600 rounded-full px-4 py-2 transition duration-300 ease-in-out" />
            </SignedIn>
            <button
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-white"
              onClick={() => setToggleMenu(!toggleMenu)}
            >
              {toggleMenu ? (
                <FaTimes className="h-6 w-6 text-red-800" />
              ) : (
                <FaBars className="h-6 w-6 text-blue-800" />
              )}
            </button>
          </div>
        </div>
      </div>
      {toggleMenu && (
        <div className="md:hidden px-8 pt-2 pb-4 space-y-2  bg-opacity-90 rounded-b-lg">
          <NavLink
            to="/admin/dashboard"
            label="Home"
            icon={<FaHome />}
            currentPath={currentPath}
            onClick={() => setToggleMenu(false)}
          />
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label, icon, currentPath, onClick }) => (
  <Link
    to={to}
    className={`flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium transition-all duration-300 hover:text-white ${
      currentPath === to
        ? "bg-orange-500 bg-opacity-80 text-white"
        : "text-blue-500 hover:bg-blue-400"
    }`}
    onClick={onClick}
  >
    {icon}
    {label}
  </Link>
);

export default Navbar;
