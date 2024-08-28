import React, { useState } from "react";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import FormStep4 from "./FormStep4";

const FormUser = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    pickupAddress: {
      line1: "",
      line2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    pickupDate: "",
    pickupTimeWindow: "",
    deliveryAddress: {
      line1: "",
      line2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    shipmentType: "",
    packageDetails: {
      numberOfPackages: "",
      weight: "",
      dimensions: { length: "", width: "", height: "" },
      description: "",
      value: "",
    },
    serviceType: "",
    specialHandling: [],
    promoCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = (e, type) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [type]: { ...formData[type], [name]: value },
    });
  };

  const handlePackageDetailsChange = (e, detail) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      packageDetails: { ...formData.packageDetails, [name]: value },
    });
  };

  const handleSpecialHandlingChange = (e) => {
    const { value, checked } = e.target;
    setFormData({
      ...formData,
      specialHandling: checked
        ? [...formData.specialHandling, value]
        : formData.specialHandling.filter((item) => item !== value),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handlePrevious = () => setCurrentStep(currentStep - 1);

  return (
    <div className="bg-gradient-to-r from-blue-200 to-indigo-300 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue">
          Logistics Booking Form
        </h2>
        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <FormStep1 formData={formData} handleChange={handleChange} />
          )}
          {currentStep === 2 && (
            <FormStep2
              formData={formData}
              handleAddressChange={handleAddressChange}
              handleChange={handleChange}
            />
          )}
          {currentStep === 3 && (
            <FormStep3
              formData={formData}
              handleAddressChange={handleAddressChange}
              handleChange={handleChange}
              handlePackageDetailsChange={handlePackageDetailsChange}
            />
          )}
          {currentStep === 4 && (
            <FormStep4
              formData={formData}
              handleChange={handleChange}
              handleSpecialHandlingChange={handleSpecialHandlingChange}
            />
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="bg-lightgray hover:bg-lightblue text-darkgray font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-blue-500 hover:bg-darkgray text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-blue-500 hover:bg-darkgray text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormUser;
