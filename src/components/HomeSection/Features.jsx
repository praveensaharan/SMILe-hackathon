import React from "react";

function Features() {
  return (
    <div className="bg-darkgray text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Admin Capabilities
          </h2>
          <p className="text-lg md:text-xl mb-4">
            Our solution offers powerful tools for administrators to manage and
            monitor price recommendation strategies.
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Secure Login</li>
            <li>User Distribution Management</li>
            <li>
              Detailed Metrics Dashboard:
              <ul className="list-disc list-inside ml-4">
                <li>Booking conversion rates</li>
                <li>Revenue tracking</li>
                <li>User distribution visuals</li>
                <li>Booking trends</li>
                <li>Click-through and form abandonment rates</li>
                <li>Machine learning accuracy</li>
                <li>Control vs. target group comparisons</li>
              </ul>
            </li>
          </ul>
          <a
            href="#"
            className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Admin Login
          </a>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            User Experience
          </h2>
          <p className="text-lg md:text-xl mb-4">
            A seamless platform for users to register, log in, and book
            logistics services.
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Register</li>
            <li>Secure Login</li>
            <li>
              Detailed Booking Form:
              <ul className="list-disc list-inside ml-4">
                <li>Personal Information</li>
                <li>Pickup & Delivery Locations</li>
                <li>Pickup Date and Time</li>
                <li>Shipment Type & Details</li>
                <li>Service Type</li>
                <li>Special Handling Requirements</li>
                <li>Promo Code</li>
              </ul>
            </li>
          </ul>
          <a
            href="#"
            className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            User Registration
          </a>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Data-Driven Insights
          </h2>
          <p className="text-lg md:text-xl mb-4">
            Visual insights into price recommendation performance and user
            interactions.
          </p>
          <ul className="list-disc list-inside mb-4 space-y-2">
            <li>Control vs. target group distribution</li>
            <li>Booking trends</li>
            <li>Click-through and form abandonment rates</li>
            <li>Key metric comparisons</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default Features;
