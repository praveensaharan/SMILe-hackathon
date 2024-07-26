import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-darkgray p-4 shadow-lg">
      <ul className="flex justify-center space-x-8">
        <li>
          <Link
            to="/"
            className="text-lightgray hover:text-lightblue font-semibold"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/signup"
            className="text-lightgray hover:text-lightblue font-semibold"
          >
            Signup
          </Link>
        </li>
        <li>
          <Link
            to="/signin"
            className="text-lightgray hover:text-lightblue font-semibold"
          >
            Signin
          </Link>
        </li>
        <li>
          <Link
            to="/form"
            className="text-lightgray hover:text-lightblue font-semibold"
          >
            Form
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
