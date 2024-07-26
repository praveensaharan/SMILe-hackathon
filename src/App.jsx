import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Form from "./components/Form";
import Home from "./components/Home";
import Footer from "./components/HomeSection/Footer";
import UserForm from "./components/UserHome1/FormUser";
import DemoMap from "./components/Demomap";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<DemoMap />} />
        {/* <Route path="/signup" element={<Signup />} /> */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/form" element={<UserForm />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
