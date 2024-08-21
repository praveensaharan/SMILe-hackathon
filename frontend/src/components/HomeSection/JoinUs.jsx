import React from "react";

function JoinUs() {
  return (
    <div className="bg-darkgray text-white py-12 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Join Us in Revolutionizing Logistics
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Join our journey to transform logistics with data-driven insights and
          advanced analytics.
        </p>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              For Admins
            </h3>
            <a
              href="#"
              className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300 mb-4 w-48 text-center"
            >
              Admin Login
            </a>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              For Users
            </h3>
            <a
              href="#"
              className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300 mb-4 w-48 text-center"
            >
              User Login
            </a>
            <a
              href="#"
              className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300 w-48 text-center"
            >
              User Signup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinUs;
