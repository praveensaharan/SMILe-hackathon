import React from "react";

const FormStep1 = ({ formData, handleChange }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-blue">Personal Information</h2>
    <div className="mb-4">
      <label
        htmlFor="name"
        className="block text-sm font-medium mb-2 text-darkgray"
      >
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
        required
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="contact"
        className="block text-sm font-medium mb-2 text-darkgray"
      >
        Phone / Email
      </label>
      <input
        type="text"
        id="contact"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
        required
      />
    </div>
  </div>
);

export default FormStep1;
