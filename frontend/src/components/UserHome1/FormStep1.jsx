import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useUser } from "@clerk/clerk-react";

const FormStep1 = ({ formData, handleChange }) => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      const initialValues = {
        name: user.fullName || "",
        contact: user.primaryEmailAddress?.emailAddress || "",
      };

      handleChange({
        target: { name: "name", value: initialValues.name },
      });
      handleChange({
        target: { name: "contact", value: initialValues.contact },
      });

      setLoading(false);
    }
  }, [isLoaded, user]);

  const handleInputChange = (e) => {
    handleChange(e);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">
        Personal Information
      </h2>
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
          onChange={handleInputChange}
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
          value={formData.contact || ""}
          onChange={handleInputChange}
          className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue"
          required
        />
      </div>
    </div>
  );
};

export default FormStep1;
