import React from "react";

function Footer() {
  return (
    <footer className="bg-darkgray text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p>Meet the team and learn our mission.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>Email: info@example.com</p>
            <p>Phone: (123) 456-7890</p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-lightblue">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.04c-5.52 0-10 4.48-10 10 0 4.42 3.58 8.07 8 8.93v-6.28h-2.4v-2.64h2.4v-1.9c0-2.4 1.44-3.72 3.64-3.72 1.05 0 2.14.2 2.14.2v2.36h-1.2c-1.2 0-1.56.76-1.56 1.55v1.89h2.64l-.42 2.64h-2.22v6.28c4.42-.86 8-4.51 8-8.93 0-5.52-4.48-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="hover:text-lightblue">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23 3c-.8.35-1.6.58-2.5.68.9-.55 1.6-1.45 1.92-2.5-.85.5-1.8.85-2.8 1.04-1-.88-2.4-1.45-3.8-1.45-2.8 0-5 2.3-5 5 0 .4 0 .8.1 1.1-4.1-.2-7.8-2.2-10.2-5.3-.5.8-.8 1.8-.8 2.9 0 2 .9 3.7 2.4 4.7-.8 0-1.6-.2-2.3-.6v.1c0 2.8 2 5.2 4.6 5.7-.5.1-1 .2-1.5.2-.4 0-.7 0-1 0 .7 2.3 2.8 3.9 5.2 3.9-2 1.5-4.5 2.3-7.2 2.3-.5 0-1 0-1.4-.1 2.6 1.7 5.7 2.7 9 2.7 10.8 0 16.6-9 16.6-16.7 0-.2 0-.4 0-.5.1-.5.2-.9.3-1.4z" />
                </svg>
              </a>
              <a href="#" className="hover:text-lightblue">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm4.5 10.75h-3v6.5h-3v-6.5h-3v-2.75h3v-2.25c0-2.21 1.79-4 4-4h3v2.75h-3c-.28 0-.5.22-.5.5v1.75h3.5l-.5 2.75z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Privacy Policy</h3>
            <p>
              <a href="#" className="hover:text-lightblue">
                Read our Privacy Policy
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Terms of Service</h3>
            <p>
              <a href="#" className="hover:text-lightblue">
                Read our Terms of Service
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-lightgray pt-4 text-center">
          <p>&copy; 2024 Logistics Company. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
