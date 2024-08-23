import React, { useState, useEffect } from "react";
import {
  SignIn,
  SignUp,
  useUser,
  useClerk,
  useSession,
  useSignIn,
} from "@clerk/clerk-react";

import { useNavigate } from "react-router-dom";
import { Spin, Alert, message as antdMessage } from "antd";

const AdminLogin = () => {
  const [adminData, setAdminData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { signIn, isLoaded } = useSignIn();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { session } = useSession();

  //   const handleAdminChange = (e) => {
  //     setAdminData({ ...adminData, [e.target.name]: e.target.value });
  //   };

  //   const handleAdminSubmit = async (e) => {
  //     e.preventDefault();
  //     setError(null);
  //     setLoading(true);

  //     if (!isLoaded) {
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const { email, password } = adminData;

  //       const signInAttempt = await signIn.create({
  //         identifier: email,
  //         password: password,
  //       });

  //       if (signInAttempt.status === "needs_first_factor") {
  //         await signInAttempt.authenticateWithPassword({
  //           emailAddress: email,
  //           password: password,
  //         });

  //         if (user && user.publicMetadata.role === "admin") {
  //           antdMessage.success("Admin signed in successfully!");
  //           navigate("/admin/dashboard");
  //         } else {
  //           antdMessage.error("You do not have admin privileges.");
  //           signOut({ redirectUrl: "/signin" });
  //           navigate("/signin");
  //         }
  //       }
  //     } catch (error) {
  //       antdMessage.error(
  //         "Sign-in failed. Please check your credentials and try again."
  //       );
  //       console.error("Sign-in failed:", error);
  //       navigate("/signin");
  //       setError("Sign-in failed. Please check your credentials and try again.");
  //     } finally {
  //       setLoading(false);
  //       navigate("/signin");
  //     }
  //   };

  useEffect(() => {
    const checkAdminPrivileges = async () => {
      if (session) {
        if (user.publicMetadata.role === "admin") {
          antdMessage.success("Admin signed in successfully!");
          navigate("/admin/dashboard");
        } else {
          antdMessage.error("You do not have admin privileges.");
          await signOut({ redirectUrl: "/signin" });
        }
      }
    };

    checkAdminPrivileges();
  }, [isLoaded, user, session]);

  return (
    <div className="p-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-gray-700">
        Admin Sign In
      </h2>

      <SignIn
        appearance={{
          elements: {
            footer: "hidden",
            header: "hidden",
            socialButtons: "hidden",
            dividerRow: "hidden",
            // formFieldRow__password: "block",
            button:
              "bg-blue-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-400",
          },
        }}
        forceRedirectUrl={"/admin/dashboard"}
      />
    </div>
  );
};

export default AdminLogin;
