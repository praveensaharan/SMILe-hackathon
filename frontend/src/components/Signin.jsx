import React, { useState } from "react";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleAdminChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLoaded) {
      return;
    }

    try {
      const { email, password } = adminData;

      const signInAttempt = await signIn.create({
        identifier: email,
        password: password,
      });

      if (signInAttempt.status === "needs_first_factor") {
        await signInAttempt.authenticateWithPassword({
          emailAddress: email,
          password: password,
        });

        // Re-check the user and their role after signing in
        if (user && user.publicMetadata.role === "admin") {
          console.log("Admin signed in successfully!");
          navigate("/admin/dashboard");
        } else {
          setError("You do not have admin privileges.");
          await signOut();
        }
      }
    } catch (error) {
      console.error("Sign-in failed:", error);
      setError("Sign-in failed. Please check your credentials and try again.");
    }
  };

  const toggleAuthView = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Admin Sign In */}
          <div className="p-10">
            <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-700">
              Admin Sign In
            </h2>
            <form onSubmit={handleAdminSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="adminEmail"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="email"
                  value={adminData.email}
                  onChange={handleAdminChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="adminPassword"
                  className="block text-sm font-semibold text-gray-600 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  name="password"
                  value={adminData.password}
                  onChange={handleAdminChange}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out"
              >
                Sign In
              </button>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
          </div>

          {/* User Sign In */}
          <div className="bg-gradient-to-br from-gray-900 to-black text-white p-10">
            <h2 className="text-3xl font-extrabold mb-8 text-center">
              {isSignIn ? "User Sign In" : "New User? Sign Up"}
            </h2>
            <div className="mb-8">
              {isSignIn ? (
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
            <div className="border-t border-gray-700 pt-8 text-center">
              <button
                onClick={toggleAuthView}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300"
              >
                {isSignIn ? "Switch to Sign Up" : "Switch to Sign In"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
