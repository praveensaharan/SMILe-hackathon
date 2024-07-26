import React, { useState } from "react";

const Signin = () => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState({ email: "", password: "" });

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminData({ ...adminData, [name]: value });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    // Add your admin sign-in logic here
    console.log("Admin signed in:", adminData);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    // Add your user sign-in logic here
    console.log("User signed in:", userData);
  };

  return (
    <div className="bg-lightgray min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Admin Sign In */}
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Admin Sign In
            </h2>
            <form onSubmit={handleAdminSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="adminEmail"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="email"
                  value={adminData.email}
                  onChange={handleAdminChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="adminPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  name="password"
                  value={adminData.password}
                  onChange={handleAdminChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue hover:bg-lightblue text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Sign In
              </button>
            </form>
          </div>

          {/* User Sign In */}
          <div className="bg-darkgray text-white p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              User Sign In
            </h2>
            <form onSubmit={handleUserSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="userEmail"
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="userEmail"
                  name="email"
                  value={userData.email}
                  onChange={handleUserChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="userPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="userPassword"
                  name="password"
                  value={userData.password}
                  onChange={handleUserChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-lightblue hover:bg-blue text-darkgray font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
