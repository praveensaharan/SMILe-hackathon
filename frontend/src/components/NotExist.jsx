import React from "react";

const NotExist = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotExist;
