import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Descriptions, notification, Modal, Button } from "antd";
import Map from "../UserHome1/Map";
import { useSession } from "@clerk/clerk-react";
import { Spin, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
const BaseUrl = "https://backend-peach-theta.vercel.app";
// const BaseUrl = "http://localhost:3000";

const FormSubmission = () => {
  const { session } = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(0);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const apiKey = import.meta.env.VITE_OLA_KEY;

  const formData = location.state?.formData || {};

  useEffect(() => {
    if (Object.keys(formData).length === 0) {
      navigate("/form");
    }
  }, [formData, navigate]);

  const origin = {
    description: formData.pickupAddress,
    lat: formData.pickupAddresslng,
    lng: formData.pickupAddresslat,
  };
  const destination = {
    description: formData.deliveryAddress,
    lat: formData.deliveryAddresslng,
    lng: formData.deliveryAddresslat,
  };

  // Ensure the API key is correct

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const apiUrl = `https://api.olamaps.io/routing/v1/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=${apiKey}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch route data.");
        }

        const data = await response.json();
        const route = data.routes[0];

        if (route) {
          const distanceInMeters = route.legs[0].distance;
          const distanceInKm = distanceInMeters / 1000; // Convert to kilometers
          setDistance(distanceInKm);
          console.log("Distance:", distanceInKm);
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (Object.keys(formData).length != 0 && origin && destination) {
      fetchRoute();
    }
  }, [origin, destination, apiKey]);

  useEffect(() => {
    if (Object.keys(formData).length != 0 && distance > 0) {
      onFinish();
    }
  }, [distance, formData]);
  console.log(distance);

  const onFinish = () => {
    setLoading(true); // Start loading indicator

    if (!origin || !destination) {
      notification.error({
        message: "Validation Error",
        description: "Please enter both origin and destination addresses.",
      });
      setLoading(false); // Stop loading indicator if validation fails
      return;
    }

    const valuesWithDistance = {
      Distance: distance,
      ShipmentType: parseInt(formData.serviceType, 10),
      NumPackages: parseInt(formData.packageDetails?.numberOfPackages, 10),
      SpecialHandling: parseInt(formData.specialHandlingNeeded, 10),
      PackageWeight: parseFloat(formData.packageDetails?.packageWeight),
    };

    console.log(valuesWithDistance);

    fetch("https://hello-xx4atey7ia-uc.a.run.app/predict", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(valuesWithDistance),
    })
      .then((response) => response.json())
      .then((data) => {
        const price = data.prediction;
        console.log("Predicted price:", price);
        setPredictedPrice(price);
      })
      .catch(() => {
        notification.error({
          message: "Prediction Failed",
          description: "There was an error processing your request.",
        });
      })
      .finally(() => {
        setLoading(false); // Stop loading indicator after request is completed (either success or error)
      });
  };

  const showPayModal = () => {
    setIsPayModalVisible(true);
  };

  const handlePayOk = async () => {
    setIsPayModalVisible(false);
    try {
      if (session) {
        setLoading(true);
        const token = await session.getToken();

        const response = await axios.post(
          `${BaseUrl}/saveorders`,
          {
            full_name_order: formData.name,
            email: formData.contact,
            pickup_address: formData.pickupAddress,
            delivery_address: formData.deliveryAddress,
            number_of_packages: parseInt(
              formData.packageDetails?.numberOfPackages
            ),
            package_weight: parseInt(formData.packageDetails?.packageWeight),
            order_price: predictedPrice,
            distance: distance,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          message.success("Booking successful!");
          navigate(`/user/dashboard`);
        } else {
          message.error(response.data.error || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting booking form:", error);
      message.error(
        "Error submitting booking form: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayCancel = () => {
    setIsPayModalVisible(false);
  };

  const showCancelModal = () => {
    setIsCancelModalVisible(true);
  };

  const handleCancelOk = async () => {
    setIsCancelModalVisible(false);
    try {
      if (session) {
        setLoading(true);
        const token = await session.getToken();

        const response = await axios.post(
          `${BaseUrl}/cancelorders`,
          {
            full_name_order: formData.name,
            email: formData.contact,
            distance: distance,
            number_of_packages: parseInt(
              formData.packageDetails?.numberOfPackages
            ),
            package_weight: parseInt(formData.packageDetails?.packageWeight),
            order_price: predictedPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          message.error("Cancelled Order!");
          navigate(`/user/dashboard`);
        } else {
          message.error(response.data.error || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Error submitting booking form:", error);
      message.error(
        "Error submitting booking form: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }

    console.log("Booking cancelled");
  };

  const handleCancelModal = () => {
    setIsCancelModalVisible(false);
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin
          size="large"
          tip="Loading your orders..."
          className="text-blue-500"
        />
      </div>
    );
  }
  return (
    <>
      <section className="bg-gradient-to-r from-blue-200 to-indigo-300 pt-20">
        <div className="mt-6 lg:flex lg:items-start lg:gap-12 px-4">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 justify-center items-center">
                Details
              </h2>
              <div className="rounded-lg border border-gray-300 bg-white p-4">
                <Descriptions
                  column={1}
                  size="middle"
                  bordered
                  className="bg-white rounded-lg"
                >
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">Name</span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.name || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Contact
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.contact || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Pickup Address
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.pickupAddress || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Pickup Date
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.pickupDate || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Pickup Time Window
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.pickupTimeWindow || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Delivery Address
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.deliveryAddress || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Number of Packages
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.packageDetails?.numberOfPackages || "N/A"}
                    </span>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <span className="font-semibold text-gray-700">
                        Package Weight
                      </span>
                    }
                  >
                    <span className="text-gray-900">
                      {formData.packageDetails?.packageWeight || "N/A"}
                    </span>
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="large" />
            </div>
          ) : (
            predictedPrice && (
              <div className="w-full space-y-6 lg:max-w-xs xl:max-w-md justify-center items-center my-auto bg-white p-6 rounded-xl text-black">
                <div className="flow-root">
                  <div className="-my-3 divide-y divide-gray-500">
                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-normal">Subtotal</dt>
                      <dd className="text-base font-medium">
                        ₹{(predictedPrice + 5).toFixed(2)}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-normal">Discount</dt>
                      <dd className="text-base font-medium">-₹5</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4 py-3">
                      <dt className="text-base font-bold">Total</dt>
                      <dd className="text-base font-bold">
                        ₹{predictedPrice.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button
                    type="primary"
                    onClick={showPayModal}
                    className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                  >
                    Pay Now
                  </Button>
                  <Button
                    type="button"
                    onClick={showCancelModal}
                    className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-md hover:bg-red-700"
                  >
                    Cancel
                  </Button>
                </div>
                <Modal
                  title="Confirm Payment"
                  visible={isPayModalVisible}
                  onOk={handlePayOk}
                  onCancel={handlePayCancel}
                  okText="Confirm"
                  cancelText="Back"
                >
                  <p>Are you sure you want to proceed with the payment?</p>
                </Modal>

                {/* Cancel Booking Modal */}
                <Modal
                  title="Cancel Booking"
                  visible={isCancelModalVisible}
                  onOk={handleCancelOk}
                  onCancel={handleCancelModal}
                  okText="Yes, Cancel"
                  cancelText="No, Go Back"
                >
                  <p>Are you sure you want to cancel this booking?</p>
                </Modal>
              </div>
            )
          )}
        </div>
      </section>

      {Object.keys(formData).length != 0 && origin && destination && (
        <div className="text-center text-xl text-gray-800 bg-gradient-to-r from-blue-200 to-indigo-300 py-10">
          <Map
            origin={origin}
            destination={destination}
            totalDistance={distance}
          />
        </div>
      )}
    </>
  );
};

export default FormSubmission;
