import React, { useState } from "react";
import { InputNumber, Select, Button, Form, notification } from "antd";

const { Option } = Select;

const Prediction = () => {
  const [form] = Form.useForm();
  const [predictedPrice, setPredictedPrice] = useState(null);

  const onFinish = (values) => {
    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const price = data.prediction[0];
        setPredictedPrice(price);
        notification.success({
          message: "Prediction Success",
          description: `The predicted price is $${price.toFixed(2)}`,
        });
      })
      .catch((error) => {
        notification.error({
          message: "Prediction Failed",
          description: "There was an error processing your request.",
        });
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Price Prediction
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            Distance: 15,
            ShipmentType: 1,
            NumPackages: 1,
            SpecialHandling: 0,
            PackageWeight: 15,
          }}
        >
          <Form.Item
            label="Distance"
            name="Distance"
            rules={[{ required: true, message: "Please enter the distance" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Shipment Type"
            name="ShipmentType"
            rules={[
              { required: true, message: "Please select a shipment type" },
            ]}
          >
            <Select>
              <Option value={1}>Standard</Option>
              <Option value={2}>Express</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Number of Packages"
            name="NumPackages"
            rules={[
              {
                required: true,
                message: "Please enter the number of packages",
              },
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Special Handling"
            name="SpecialHandling"
            rules={[{ required: true, message: "Please select an option" }]}
          >
            <Select>
              <Option value={0}>No</Option>
              <Option value={1}>Yes</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Package Weight"
            name="PackageWeight"
            rules={[
              { required: true, message: "Please enter the package weight" },
            ]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Predict
            </Button>
          </Form.Item>
        </Form>
        {predictedPrice !== null && (
          <div className="mt-4 text-center text-lg">
            The predicted price is ${predictedPrice.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
