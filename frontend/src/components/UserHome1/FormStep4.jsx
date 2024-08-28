import React from "react";

const FormStep4 = ({ formData, handleChange, handleSpecialHandlingChange }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-blue-600">
      Service Information & Special Handling
    </h2>

    {/* Service Type Section */}
    <div className="mb-6">
      <label className="block text-sm font-medium mb-2 text-darkgray">
        Service Type
      </label>
      <select
        id="serviceType"
        name="serviceType"
        value={formData.serviceType}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
        required
      >
        <option value="">Select Service Type</option>
        <option value="standard">Standard Shipping</option>
        <option value="expedited">Expedited Shipping</option>
        <option value="overnight">Overnight Shipping</option>
      </select>
    </div>

    {/* Special Handling Requirements Section */}
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold mb-4 text-blue-600">
        Special Handling Requirements
      </legend>
      <div className="space-y-2">
        {[
          "Fragile",
          "Perishable",
          "Hazardous Materials",
          "Oversized Items",
        ].map((item) => (
          <div key={item} className="flex items-center">
            <input
              type="checkbox"
              id={item}
              name="specialHandling"
              value={item}
              checked={formData.specialHandling.includes(item)}
              onChange={handleSpecialHandlingChange}
              className="mr-2 focus:ring focus:ring-blue-600 focus:ring-opacity-50"
            />
            <label htmlFor={item} className="text-sm text-darkgray">
              {item}
            </label>
          </div>
        ))}
      </div>
    </fieldset>

    {/* Special Handling Selection Section */}
    <div className="mb-6">
      <label
        htmlFor="specialHandlingSelect"
        className="block text-sm font-medium mb-2 text-darkgray"
      >
        Special Handling Needed
      </label>
      <select
        id="specialHandlingSelect"
        name="specialHandlingNeeded"
        value={formData.specialHandlingNeeded}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
        required
      >
        <option value="">Select Option</option>
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>
    </div>
  </div>
);

export default FormStep4;
