import React, { useEffect } from "react";
import {
  SignIn,
  useUser,
  useClerk,
  useSession,
  useSignIn,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { message as antdMessage } from "antd";

const AdminLogin = () => {
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminPrivileges = async () => {
      if (session && isLoaded) {
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
  }, [isLoaded, user, session, navigate, signOut]);

  return (
    <div className="flex justify-center pt-6">
      <div className="max-w-md w-full">
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-700">
          Admin Sign In
        </h2>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out",
              formFieldInput:
                "w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
              footer: "hidden",
              // header: "hidden",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtons: "hidden",
              dividerRow: "hidden",
            },
          }}
          forceRedirectUrl={"/admin/dashboard"}
        />
      </div>
    </div>
  );
};

export default AdminLogin;
