import React, { useState } from "react";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import FormStep4 from "./FormStep4";
import FormSubmission from "./FormData";
import { notification } from "antd";

const FormUser = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    pickupAddresslat: "",
    pickupAddresslng: "",
    pickupAddress: "",
    pickupDate: "",
    pickupTimeWindow: "",
    deliveryAddress: "",
    deliveryAddresslng: "",
    deliveryAddresslat: "",
    packageDetails: {
      numberOfPackages: "",
      packageWeight: "",
    },
    serviceType: "",
    specialHandling: [],
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange1 = (e) => {
    const { value } = e.target;
    const [deliveryAddress, deliveryAddresslng, deliveryAddresslat] =
      value.split("++--");

    setFormData({
      ...formData,
      deliveryAddresslat,
      deliveryAddresslng,
      deliveryAddress,
    });
  };

  const handleChange2 = (e) => {
    const { value } = e.target;
    const [pickupAddress, pickupAddresslng, pickupAddresslat] =
      value.split("++--");

    setFormData({
      ...formData,
      pickupAddresslat,
      pickupAddresslng,
      pickupAddress,
    });
  };

  const handlePackageDetailsChange = (e) => {
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

  const validateForm = () => {
    const errors = {};

    // Check for empty fields in the main form data
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === "object" && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          if (!subValue) {
            const fieldName = `${key}.${subKey}`;
            errors[fieldName] = "This field is required";

            notification.error({
              message: "Required Field Missing",
              description: `${fieldName} is required.`,
            });
          }
        }
      } else if (!value) {
        errors[key] = "This field is required";

        notification.error({
          message: "Required Field Missing",
          description: `${key} is required.`,
        });
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setFormSubmitted(true);
    }
  };

  const handleNext = () => setCurrentStep(currentStep + 1);
  const handlePrevious = () => setCurrentStep(currentStep - 1);

  return (
    <div className="bg-gradient-to-r from-blue-200 to-indigo-300 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        {!formSubmitted ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
              Logistics Booking Form
            </h2>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <FormStep1
                  formData={formData}
                  handleChange={handleChange}
                  formErrors={formErrors}
                />
              )}
              {currentStep === 2 && (
                <FormStep2
                  formData={formData}
                  handleChange={handleChange}
                  handleChange2={handleChange2}
                  formErrors={formErrors}
                />
              )}
              {currentStep === 3 && (
                <FormStep3
                  formData={formData}
                  handleChange={handleChange}
                  handleChange1={handleChange1}
                  handlePackageDetailsChange={handlePackageDetailsChange}
                  formErrors={formErrors}
                />
              )}
              {currentStep === 4 && (
                <FormStep4
                  formData={formData}
                  handleChange={handleChange}
                  handleSpecialHandlingChange={handleSpecialHandlingChange}
                  formErrors={formErrors}
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
          </>
        ) : (
          <FormSubmission formData={formData} />
        )}
      </div>
    </div>
  );
};

export default FormUser;
