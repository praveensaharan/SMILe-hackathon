import React, { useState, useEffect } from "react";
import { Form, Select, InputNumber, Button, notification } from "antd";
import axios from "axios";
import debounce from "lodash/debounce";
import RouteMap from "./MapComponent";
import Suggestions from "./Suggestions";

const { Option } = Select;

const Prediction = () => {
  const [form] = Form.useForm();
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [distance, setDistance] = useState(15);
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
  const apiKey = import.meta.env.VITE_OLA_KEY;

  const fetchSuggestions = debounce(async (query, type) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete`,
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

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const apiUrl = `https://api.olamaps.io/routing/v1/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: "",
        });

        const data = await response.json();
        const route = data.routes[0];

        if (route) {
          const distanceInMeters = route.legs[0].distance;
          const distanceInKm = distanceInMeters / 1000; // Convert to kilometers
          setDistance(distanceInKm);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (origin && destination) {
      fetchRoute();
    }
  }, [origin, destination]);

  const onFinish = (values) => {
    if (!origin || !destination) {
      notification.error({
        message: "Validation Error",
        description: "Please enter both origin and destination addresses.",
      });
      return;
    }

    const valuesWithDistance = { ...values, Distance: distance };
    console.log(valuesWithDistance);

    fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valuesWithDistance),
    })
      .then((response) => response.json())
      .then((data) => {
        const price = data.prediction[0];
        setPredictedPrice(price);
        notification.success({
          message: "Prediction Success",
          description: `The predicted price is ₹${price.toFixed(2)}`,
        });
      })
      .catch(() => {
        notification.error({
          message: "Prediction Failed",
          description: "There was an error processing your request.",
        });
      });
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-indigo-300 py-20">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md ">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Price Prediction
          </h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              ShipmentType: 1,
              NumPackages: 1,
              SpecialHandling: 0,
              PackageWeight: 15,
            }}
          >
            <div className="relative mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Origin
              </label>
              <input
                type="text"
                value={originQuery}
                onChange={(e) => setOriginQuery(e.target.value)}
                placeholder="Enter origin address"
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
              label="Shipment Type"
              name="ShipmentType"
              rules={[
                { required: true, message: "Please select a shipment type" },
              ]}
            >
              <Select className="w-full rounded-lg shadow-sm focus:outline-none focus:border-indigo-500">
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
                className="w-full rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
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
                      className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-sm"
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
              <Select className="w-full rounded-lg shadow-sm focus:outline-none focus:border-indigo-500">
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
              <Select
                className="w-full rounded-lg shadow-sm focus:outline-none focus:border-indigo-500"
                placeholder="Select or enter the package weight"
                onChange={(value) =>
                  form.setFieldsValue({ PackageWeight: value })
                }
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <InputNumber
                      min={1}
                      placeholder="Enter custom weight (kg)"
                      className="w-full p-2 mt-2 border border-gray-300 rounded-lg shadow-sm"
                      onChange={(value) =>
                        form.setFieldsValue({ PackageWeight: value })
                      }
                    />
                  </>
                )}
              >
                <Option value={1}>Under 1kg</Option>
                <Option value={2}>Under 2kg</Option>
                <Option value={3}>Under 3kg</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg shadow-md transition duration-300"
              >
                Predict
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      {predictedPrice !== null && origin && destination && (
        <div className="text-center text-xl text-gray-800 bg-gradient-to-r from-blue-200 to-indigo-300 pb-10">
          <p className="mb-6">
            The predicted price is{" "}
            <span className="font-bold text-indigo-600">
              ₹{predictedPrice.toFixed(2)}
            </span>
          </p>

          <RouteMap
            origin={origin}
            destination={destination}
            totalDistance={distance}
          />
        </div>
      )}

      <Suggestions />
    </>
  );
};

export default Prediction;
