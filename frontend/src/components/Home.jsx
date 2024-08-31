import React, { useEffect } from "react";
import Hero from "./HomeSection/Hero";
import Suggestion from "./User/Suggestions";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Spin, message as antdMessage } from "antd";

const Home = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      const role = user.publicMetadata.role;

      if (role === "admin") {
        antdMessage.success("You have admin privileges.");
        navigate("/admin/dashboard");
      } else {
        antdMessage.success("You have user privileges.");
        navigate("/user/dashboard");
      }
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  // Show a spinner while loading
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Hero />
      <Suggestion />
    </>
  );
};

export default Home;
