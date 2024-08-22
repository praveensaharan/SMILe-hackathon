import React, { useState, useEffect } from "react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [error, setError] = useState(null);
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until everything is loaded and authenticated
    if (isLoaded) {
      if (isSignedIn) {
        if (user && user.publicMetadata.role !== "admin") {
          setError("You do not have admin privileges.");
          signOut({ redirectUrl: "/" });
        }
      } else {
        navigate("/signin");
      }
    }
  }, [isLoaded, isSignedIn, user, signOut, navigate]);

  if (!isLoaded) {
    return <div>Loading...</div>; // Optionally show a loading state
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <div>Admin Dashboard</div>;
};

export default Dashboard;
