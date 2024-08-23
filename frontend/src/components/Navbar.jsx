import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import DefaultNav from "./Nav";
import AdminNav from "./Admin/Navbar";
import UserNav from "./User/Navbar";

const Navigation = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [navComponent, setNavComponent] = useState(<DefaultNav />);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        if (user && user.publicMetadata.role === "admin") {
          setNavComponent(<AdminNav />);
        } else {
          setNavComponent(<UserNav />);
        }
      } else {
        setNavComponent(<DefaultNav />);
      }
    }
  }, [isLoaded, isSignedIn, user]);

  return <>{navComponent}</>;
};

export default Navigation;
