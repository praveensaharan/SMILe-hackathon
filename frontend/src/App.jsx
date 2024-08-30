import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "./components/Navbar";

import Signin from "./components/Signin";
import RoleBasedRoute from "./components/RoleBasedRoute";
import Home from "./components/Home";
import Footer from "./components/HomeSection/Footer";
import UserForm from "./components/UserHome1/FormUser";
import Predictio from "./components/User/Prediction";
import DemoMap from "./components/Demomap";
import NotExist from "./components/NotExist";
import AdminDashboard from "./components/Admin/Dashboard";
import UserDashboard from "./components/User/Dashboard";
import Prediction from "./components/User/Prediction2";
import FormSubmission from "./components/User/FormSubmission";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/predictor"
            element={
              <>
                <Prediction />
                {/* <DemoMap /> */}
              </>
            }
          />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signin />} />
          <Route path="/form" element={<Predictio />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/submission" element={<FormSubmission />} />
          <Route path="*" element={<NotExist />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
