import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const UserLogin = () => {
  const [activeComponent, setActiveComponent] = useState("signin");

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-10 min-h-screen flex flex-col justify-center">
      <h2 className="text-3xl font-extrabold mb-8 text-center">
        {activeComponent === "signin" ? "User Sign In" : "New User? Sign Up"}
      </h2>

      {/* Navbar */}
      <div className="flex justify-center items-center mb-8">
        <button
          type="button"
          onClick={() => handleNavigation("signin")}
          className={`${
            activeComponent === "signin"
              ? "bg-orange-400 text-white"
              : "bg-white text-blue-500 border-teal-500 hover:bg-slate-300"
          } w-1/2 max-w-xs mx-2 font-semibold py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => handleNavigation("signup")}
          className={`${
            activeComponent === "signup"
              ? "bg-orange-400 text-white"
              : "bg-white text-blue-500 border-teal-500 hover:bg-slate-300"
          } w-1/2 max-w-xs mx-2 font-semibold py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}
        >
          Sign Up
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow p-6">
        {activeComponent === "signin" ? (
          <SignIn
            appearance={{
              elements: {
                footer: "hidden",
              },
            }}
          />
        ) : (
          <SignUp
            appearance={{
              elements: {
                footer: "hidden",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserLogin;
