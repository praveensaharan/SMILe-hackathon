import React, { useState, useEffect } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Spin, Alert, message as antdMessage } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Content from "./Content";

const Dashboard = () => {
  const [error, setError] = useState(null);
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        if (user && user.publicMetadata.role !== "admin") {
          antdMessage.error("You do not have admin privileges.");
          setError("You do not have admin privileges.");
          signOut({ redirectUrl: "/" });
        }
      } else {
        antdMessage.error("You are not signed in.");
        navigate("/signin");
      }
    }
  }, [isLoaded, isSignedIn, user, signOut, navigate]);

  if (!isLoaded) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Spin indicator={antIcon} size="large" tip="Loading Dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Alert
          message="Access Denied"
          description={error}
          type="error"
          showIcon
          className="max-w-sm"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 to-indigo-300 pb-8">
      <div className="max-w-5xl mx-auto">
        <Content />
      </div>
    </div>
  );
};

export default Dashboard;
