import React from "react";

const FormStep3 = ({
  formData,
  handleAddressChange,
  handleChange,
  handlePackageDetailsChange,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4 text-blue">
      Delivery Information & Package Details
    </h2>
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold mb-4 text-blue">
        Delivery Address
      </legend>
      <div className="mb-4">
        <label
          htmlFor="deliveryAddressLine1"
          className="block text-sm font-medium mb-2 text-darkgray"
        >
          Address Line 1
        </label>
        <input
          type="text"
          id="deliveryAddressLine1"
          name="line1"
          value={formData.deliveryAddress.line1}
          onChange={(e) => handleAddressChange(e, "deliveryAddress")}
          className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
          required
        />
      </div>
      {/* Repeat similar input fields for other address details */}
    </fieldset>
    <div className="mb-4">
      <label
        htmlFor="shipmentType"
        className="block text-sm font-medium mb-2 text-darkgray"
      >
        Shipment Type
      </label>
      <select
        id="shipmentType"
        name="shipmentType"
        value={formData.shipmentType}
        onChange={handleChange}
        className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
        required
      >
        <option value="">Select Shipment Type</option>
        <option value="package">Package</option>
        <option value="pallet">Pallet</option>
        <option value="container">Container</option>
      </select>
    </div>
    <fieldset className="mb-6">
      <legend className="text-lg font-semibold mb-4 text-blue">
        Package Details
      </legend>
      <div className="mb-4">
        <label
          htmlFor="numberOfPackages"
          className="block text-sm font-medium mb-2 text-darkgray"
        >
          Number of Packages
        </label>
        <input
          type="number"
          id="numberOfPackages"
          name="numberOfPackages"
          value={formData.packageDetails.numberOfPackages}
          onChange={(e) => handlePackageDetailsChange(e, "numberOfPackages")}
          className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
          required
        />
      </div>
      {/* Repeat similar input fields for other package details */}
    </fieldset>
  </div>
);

export default FormStep3;
