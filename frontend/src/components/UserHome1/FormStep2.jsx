import React from "react";

const FormStep2 = ({ formData, handleAddressChange, handleChange }) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-blue">Pickup Information</h2>
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold mb-4 text-blue">
        Pickup Address
      </legend>
      <div className="mb-4">
        <label
          htmlFor="pickupAddressLine1"
          className="block text-sm font-medium mb-2 text-darkgray"
        >
          Address Line 1
        </label>
        <input
          type="text"
          id="pickupAddressLine1"
          name="line1"
          value={formData.pickupAddress.line1}
          onChange={(e) => handleAddressChange(e, "pickupAddress")}
          className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
          required
        />
      </div>
      {/* Repeat similar input fields for other address details */}
    </fieldset>
    <div className="mb-4">
      <label
        htmlFor="pickupDate"
        className="block text-sm font-medium mb-2 text-darkgray"
      >
        Pickup Date
      </label>
      <input
        type="date"
        id="pickupDate"
        name="pickupDate"
        value={formData.pickupDate}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
        required
      />
    </div>
    <div className="mb-4">
      <label
        htmlFor="pickupTimeWindow"
        className="block text-sm font-medium mb-2 text-darkgray"
      >
        Pickup Time Window
      </label>
      <input
        type="text"
        id="pickupTimeWindow"
        name="pickupTimeWindow"
        value={formData.pickupTimeWindow}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
        required
        placeholder="e.g., 9 AM - 12 PM, 1 PM - 5 PM"
      />
    </div>
  </div>
);

export default FormStep2;
