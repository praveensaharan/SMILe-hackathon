import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";

const UserLogin = () => {
  const [activeComponent, setActiveComponent] = useState("signin");

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  return (
    <div className=" text-white p-10 min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-900">
          {activeComponent === "signin" ? "User Sign In" : "New User? Sign Up"}
        </h2>

        {/* Navbar */}
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={() => handleNavigation("signin")}
            className={`${
              activeComponent === "signin"
                ? "bg-gradient-to-r from-red-300 to-orange-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } w-1/2 mx-2 font-semibold py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleNavigation("signup")}
            className={`${
              activeComponent === "signup"
                ? "bg-gradient-to-r from-red-300 to-orange-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            } w-1/2 mx-2 font-semibold py-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-md`}
          >
            Sign Up
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeComponent === "signin" ? (
            <SignIn
              appearance={{
                elements: {
                  card: "shadow-none",
                  formButtonPrimary:
                    "w-full bg-gradient-to-r from-red-300 to-orange-600 hover:from-red-500 hover:to-orange-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out",
                  formFieldInput:
                    "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  footer: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
              forceRedirectUrl={"/user/dashboard"}
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  card: "shadow-none",
                  formButtonPrimary:
                    "w-full bg-gradient-to-r from-red-300 to-orange-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300 ease-in-out",
                  formFieldInput:
                    "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
                  footer: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                },
              }}
              forceRedirectUrl={"/user/dashboard"}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
