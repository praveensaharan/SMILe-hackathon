import React, { useState, useEffect } from "react";
import { SignIn, SignUp, useUser, useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Spin, Alert, message as antdMessage, notification } from "antd";
import UserLogin from "./User/UserLogin";
import AdminLogin from "./Admin/AdminLogin";
const imageurl =
  "https://plus.unsplash.com/premium_photo-1681487814165-018814e29155?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Signin = () => {
  const { isLoaded } = useSignIn();

  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();

  notification.info({
    className: "bg-blue-100 h-24 text-sm p-0",
    message: "🎉 Welcome! Admin access:",
    maxCount: 1,
    duration: 5,
    showProgress: true,
    placement: "bottom",
    description: (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>
          Email:{" "}
          <span style={{ color: "blue", fontWeight: "semibold" }}>
            carrers@logipredict.com
          </span>
        </span>
        <span>
          Password:{" "}
          <span style={{ color: "green", fontWeight: "semibold" }}>
            LogiPredict@hackathon
          </span>
        </span>
      </div>
    ),
    style: {
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    icon: <i className="fas fa-user-shield" style={{ color: "blue" }} />,
  });

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
    <div className="relative bg-gradient-to-br from-gray-100 to-gray-300 min-h-screen flex items-center justify-center py-12 px-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url(${imageurl})`,
        }}
      ></div>
      <div className="relative max-w-6xl w-full overflow-hidden">
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-orange-500 md:inset-y-0 md:left-1/2 md:w-0.5 md:h-full md:bg-gradient-to-b"></div>

        <div className="relative grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center p-6">
            <AdminLogin />
          </div>
          <div className="flex flex-col items-center px-3 py-0">
            <UserLogin />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
