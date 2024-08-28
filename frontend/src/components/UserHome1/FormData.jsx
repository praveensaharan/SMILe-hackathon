import React from "react";
import { Card, Descriptions, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import RouteMap from "./Map";

const FormSubmission = ({ formData }) => {
  const origin = {
    description: formData.pickupAddress,
    lng: formData.pickupAddresslat,
    lat: formData.pickupAddresslng,
  };
  const destination = {
    description: formData.deliveryAddress,
    lng: formData.deliveryAddresslat,
    lat: formData.deliveryAddresslng,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <Card
        className="w-full max-w-2xl shadow-lg"
        title={
          <div className="text-center">
            <CheckCircleOutlined className="text-4xl text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-700 mt-2">
              Form Submitted Successfully
            </h2>
            <p className="text-md text-gray-500">
              Your booking details have been recorded.
            </p>
          </div>
        }
        bordered={false}
        style={{ borderRadius: "10px" }}
      >
        <Descriptions
          bordered
          column={1}
          size="middle"
          className="bg-white p-4 rounded-lg"
        >
          <Descriptions.Item label="Name">
            {formData.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Contact">
            {formData.contact || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Pickup Address">
            {formData.pickupAddress || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Pickup Date">
            {formData.pickupDate || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Pickup Time Window">
            {formData.pickupTimeWindow || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Delivery Address">
            {formData.deliveryAddress || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Number of Packages">
            {formData.packageDetails?.numberOfPackages || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Package Weight">
            {formData.packageDetails?.packageWeight || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Service Type">
            <Tag color="blue">{formData.serviceType || "Standard"}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Special Handling Needed">
            {formData.specialHandling.length > 0 ? (
              formData.specialHandling.map((item) => (
                <Tag key={item} color="red" className="mb-1">
                  {item}
                </Tag>
              ))
            ) : (
              <Tag color="green">No</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <div className="mt-8 w-full max-w-2xl">
        <RouteMap origin={origin} destination={destination} />
      </div>
    </div>
  );
};

export default FormSubmission;
