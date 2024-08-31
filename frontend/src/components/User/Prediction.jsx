import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Input,
  DatePicker,
  Radio,
} from "antd";
import axios from "axios";
import debounce from "lodash/debounce";
import Suggestions from "./Suggestions";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const Prediction = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [isOriginSuggestionVisible, setOriginSuggestionVisible] =
    useState(false);
  const [isDestinationSuggestionVisible, setDestinationSuggestionVisible] =
    useState(false);
  const { user, isLoaded } = useUser();

  const apiKey = import.meta.env.VITE_OLA_KEY;

  const fetchSuggestions = debounce(async (query, type) => {
    try {
      const response = await axios.get(
        "https://api.olamaps.io/places/v1/autocomplete",
        {
          params: {
            input: query,
            api_key: apiKey,
          },
        }
      );

      const uniqueSuggestions = Array.from(
        new Map(
          response.data.predictions.map((item) => [item.place_id, item])
        ).values()
      );

      if (type === "origin") {
        setOriginSuggestions(uniqueSuggestions);
      } else {
        setDestinationSuggestions(uniqueSuggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (type === "origin") {
        setOriginSuggestions([]);
      } else {
        setDestinationSuggestions([]);
      }
    }
  }, 300);

  useEffect(() => {
    if (originQuery.length < 3) {
      setOriginSuggestions([]);
      setOriginSuggestionVisible(false);
      return;
    }

    fetchSuggestions(originQuery, "origin");
    setOriginSuggestionVisible(true);

    return () => {
      fetchSuggestions.cancel();
    };
  }, [originQuery]);

  useEffect(() => {
    if (destinationQuery.length < 3) {
      setDestinationSuggestions([]);
      setDestinationSuggestionVisible(false);
      return;
    }

    fetchSuggestions(destinationQuery, "destination");
    setDestinationSuggestionVisible(true);

    return () => {
      fetchSuggestions.cancel();
    };
  }, [destinationQuery]);

  const handleSuggestionClick = (suggestion, type) => {
    const location = suggestion.geometry.location;
    const selectedPlace = {
      description: suggestion.description,
      lat: location.lat,
      lng: location.lng,
    };

    if (type === "origin") {
      setOrigin(selectedPlace);
      setOriginQuery(suggestion.description);
      setOriginSuggestions([]);
      setOriginSuggestionVisible(false);
    } else {
      setDestination(selectedPlace);
      setDestinationQuery(suggestion.description);
      setDestinationSuggestions([]);
      setDestinationSuggestionVisible(false);
    }
  };
  const handleSubmit = (values) => {
    // e.preventDefault();

    const formData = {
      name: values.FullName,
      contact: values.Email,
      pickupAddresslat: origin.lng,
      pickupAddresslng: origin.lat,
      pickupAddress: origin.description,
      pickupDate: values.Date.format("YYYY-MM-DD"),
      pickupTimeWindow: values.PickupWindow,
      deliveryAddress: destination.description,
      deliveryAddresslng: destination.lat,
      deliveryAddresslat: destination.lng,
      packageDetails: {
        numberOfPackages: values.NumPackages,
        packageWeight: values.PackageWeight,
      },
      serviceType: values.ShipmentType,
      specialHandling: [values.SpecialHandlingRequirements],
      specialHandlingNeeded: values.SpecialHandling,
    };
    console.log(formData);

    navigate("/submission", { state: { formData } });
    // setFormSubmitted(true);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-200 to-indigo-300 py-10 px-5 md:px-0">
        <div className="px-10 py-6 w-full max-w-4xl bg-white rounded-xl">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Book a Shipment
          </h2>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              ShipmentType: 1,
              NumPackages: 1,
              SpecialHandling: 0,
              PackageWeight: 15,
              FullName: user?.fullName || "",
              Email: user?.primaryEmailAddress?.emailAddress || "",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Form.Item
                label="Full Name"
                name="FullName"
                rules={[
                  { required: true, message: "Please enter your full name" },
                ]}
              >
                <Input
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Enter Name"
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="example@example.com"
                />
              </Form.Item>

              <Form.Item
                label="Date"
                name="Date"
                rules={[{ required: true, message: "Please select a date" }]}
              >
                <DatePicker
                  format={{
                    format: "YYYY-MM-DD",
                    type: "mask",
                  }}
                  className="w-full border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  disabledDate={(current) =>
                    current &&
                    current < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </Form.Item>
              <div className="relative mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Pickup
                </label>
                <input
                  type="text"
                  value={originQuery}
                  onChange={(e) => setOriginQuery(e.target.value)}
                  placeholder="Enter pickup address"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 transition duration-300"
                />
                {isOriginSuggestionVisible && originSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {originSuggestions.map((suggestion) => (
                      <li
                        key={suggestion.place_id}
                        className="p-2 cursor-pointer hover:bg-indigo-100 transition duration-200"
                        onClick={() =>
                          handleSuggestionClick(suggestion, "origin")
                        }
                      >
                        {suggestion.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Destination
                </label>
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="Enter destination address"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-indigo-500 transition duration-300"
                />
                {isDestinationSuggestionVisible &&
                  destinationSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {destinationSuggestions.map((suggestion) => (
                        <li
                          key={suggestion.place_id}
                          className="p-2 cursor-pointer hover:bg-indigo-100 transition duration-200"
                          onClick={() =>
                            handleSuggestionClick(suggestion, "destination")
                          }
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <Form.Item
                label="Pickup Window"
                name="PickupWindow"
                rules={[
                  { required: true, message: "Please select a pickup window" },
                ]}
              >
                <Select
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Select pickup window"
                >
                  <Option value="morning">Morning (8 AM - 12 PM)</Option>
                  <Option value="afternoon">Afternoon (12 PM - 4 PM)</Option>
                  <Option value="evening">Evening (4 PM - 8 PM)</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Shipment Type"
                name="ShipmentType"
                rules={[
                  { required: true, message: "Please select a shipment type" },
                ]}
              >
                <Select
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Select shipment type"
                >
                  <Option value={1}>Standard</Option>
                  <Option value={2}>Express</Option>
                  <Option value={3}>Overnight</Option>
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
                <Select
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Select or enter the number of packages"
                  onChange={(value) =>
                    form.setFieldsValue({ NumPackages: value })
                  }
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <InputNumber
                        min={1}
                        placeholder="Enter custom value"
                        className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md"
                        onChange={(value) =>
                          form.setFieldsValue({ NumPackages: value })
                        }
                      />
                    </>
                  )}
                >
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Special Handling"
                name="SpecialHandling"
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <Select
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Select special handling"
                >
                  <Option value={0}>No</Option>
                  <Option value={1}>Yes</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Special Handling Requirements"
                name="SpecialHandlingRequirements"
              >
                <Radio.Group className="flex flex-col space-y-2">
                  <Radio value="fragile">Fragile</Radio>
                  <Radio value="perishable">Perishable</Radio>
                  <Radio value="hazardous">Hazardous Materials</Radio>
                  <Radio value="oversized">Oversized Items</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Package Weight"
                name="PackageWeight"
                rules={[
                  {
                    required: true,
                    message: "Please enter the package weight",
                  },
                ]}
              >
                <Select
                  className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  placeholder="Select or enter package weight"
                  onChange={(value) =>
                    form.setFieldsValue({ PackageWeight: value })
                  }
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <InputNumber
                        min={1}
                        placeholder="Enter custom weight (kg)"
                        className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-md"
                        onChange={(value) =>
                          form.setFieldsValue({ PackageWeight: value })
                        }
                      />
                    </>
                  )}
                >
                  <Option value={5}>Under 5kg</Option>
                  <Option value={10}>Under 10kg</Option>
                  <Option value={15}>Under 15kg</Option>
                </Select>
              </Form.Item>
            </div>

            <Form.Item className="mt-2 flex items-center justify-center">
              <Button
                type="primary"
                htmlType="submit"
                className="bg-indigo-500 hover:bg-indigo-900 text-white px-10 py-5 rounded-xl shadow-md transition duration-300"
              >
                Book Shipment
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Suggestions />
    </>
  );
};

export default Prediction;
