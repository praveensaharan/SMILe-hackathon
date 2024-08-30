import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";
function Hero() {
  return (
    <div className="relative bg-darkgray h-screen flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1661963455086-8fbd8a330cd5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Logistics operations"
          className="w-full h-full object-cover opacity-50 transform animate-wave"
        />
      </div>
      <div className="relative p-8 max-w-3xl text-white drop-shadow-lg">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-in-up">
          Revolutionize Logistics with Data-Driven Insights
        </h1>
        <p className="text-xl md:text-2xl mb-10 animate-fade-in-up delay-200">
          Optimize logistics efficiency with LogiPredict. Harness data-driven
          insights, predictive pricing, and A/B testing tools to transform your
          logistics operations.
        </p>

        <Link
          to="/signin"
          className="relative inline-flex items-center justify-center px-10 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-orange-400 rounded-2xl group"
        >
          <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-[#27374D] rounded-full group-hover:w-56 group-hover:h-56"></span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
          <span className="relative font-bold">Get Started</span>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
