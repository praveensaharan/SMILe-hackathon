import React, { useEffect, useState } from "react";
import { Form, Input, Spin } from "antd";
import { useUser } from "@clerk/clerk-react";

const FormStep1 = ({ formData, handleChange }) => {
  const { user, isLoaded } = useUser();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      // Set form values once user data and formData are ready
      form.setFieldsValue({
        name: user?.fullName || formData.name || "",
        contact:
          user?.primaryEmailAddress?.emailAddress || formData.contact || "",
      });
      setLoading(false);
    }
  }, [isLoaded, user, form, formData, form.setFieldsValue]);

  if (loading) {
    return (
      <div className="p-6 bg-white flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">
        Personal Information
      </h2>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changedValues) => handleChange(changedValues)}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            placeholder="Enter your name"
            className="border border-lightgray rounded-lg"
          />
        </Form.Item>
        <Form.Item
          label="Phone / Email"
          name="contact"
          rules={[
            { required: true, message: "Please enter your phone or email" },
          ]}
        >
          <Input
            placeholder="Enter your phone number or email address"
            className="border border-lightgray rounded-lg"
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormStep1;
