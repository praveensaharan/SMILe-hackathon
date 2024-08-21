import React from "react";

function Hero() {
  return (
    <div className="relative bg-darkgray h-screen flex items-center justify-center text-center">
      <img
        src="https://plus.unsplash.com/premium_photo-1661963455086-8fbd8a330cd5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Logistics operations"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 p-8 max-w-3xl text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Revolutionize Logistics with Data-Driven Insights
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Develop an A/B testing framework to optimize price recommendations and
          enhance logistics efficiency.
        </p>
        <a
          href="#"
          className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}

export default Hero;
