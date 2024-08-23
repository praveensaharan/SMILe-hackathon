import React, { useState, useEffect } from "react";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Spin, Alert, message as antdMessage } from "antd";
import UserLogin from "./User/UserLogin";
import AdminLogin from "./Admin/AdminLogin";

const Signin = () => {
  const { isLoaded } = useSignIn();

  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();

  useEffect(() => {
    const checkAdminPrivileges = async () => {
      if (isLoaded && user) {
        if (user.publicMetadata.role === "admin") {
          antdMessage.success("Admin signed in successfully!");
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    };

    checkAdminPrivileges();
  }, [isLoaded, user, signOut, navigate]);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <AdminLogin />
          <UserLogin />
        </div>
      </div>
    </div>
  );
};

export default Signin;
