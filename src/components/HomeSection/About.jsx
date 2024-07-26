import React from "react";

function About() {
  return (
    <div className="bg-darkgray text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg md:text-xl">
            We're competing in the Data Dive: Revolutionizing Logistics
            hackathon to transform the industry. Our project aims to create an
            A/B testing framework to refine price recommendations, boosting
            booking conversion rates and revenue through data science.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A/B Testing Framework
          </h2>
          <p className="text-lg md:text-xl mb-4">
            We're building a framework to assess and enhance price
            recommendation strategies, improving booking conversions and
            revenue.
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Evaluate price recommendations</li>
            <li>Boost booking conversion rates</li>
            <li>Increase revenue with data insights</li>
          </ul>
          <a
            href="#"
            className="inline-block bg-blue hover:bg-lightblue text-darkgray font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Explore Our Solution
          </a>
        </section>
      </div>
    </div>
  );
}

export default About;
