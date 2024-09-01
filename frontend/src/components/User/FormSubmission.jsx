import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Descriptions, notification, Modal, Button, Spin, message } from "antd";
import Map from "../UserHome1/Map";
import { useSession } from "@clerk/clerk-react";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axios from "axios";

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
  const [userRole, setUserRole] = useState(null);
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

  console.log(formData, userRole);

  useEffect(() => {
    const fetchRole = async () => {
      if (session) {
        setLoading(true); // Start loading
        try {
          const token = await session.getToken();
          const response = await fetch(`${BaseUrl}/userrole`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch");
          }

          const data1 = await response.json();
          setUserRole(data1.role);
          message.info("User role fetched successfully");
        } catch (error) {
          console.error("Error fetching user role:", error.message);
          message.error("Failed to fetch user role.");
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    fetchRole();
  }, [session]);

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
        message.error("Failed to fetch route data.");
      }
    };

    if (Object.keys(formData).length !== 0 && origin && destination) {
      fetchRoute();
    }
  }, [origin, destination, apiKey]);

  useEffect(() => {
    if (Object.keys(formData).length !== 0 && distance > 0) {
      if (userRole === 0) {
        onFinish1();
      } else {
        onFinish2();
      }
    }
  }, [distance, formData, userRole]);

  const onFinish1 = async () => {
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

    try {
      const response = await fetch(
        `https://hello-xx4atey7ia-uc.a.run.app/predict`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(valuesWithDistance),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      const price = data.prediction;
      console.log("Predicted price from model:", price);
      setPredictedPrice(price);
    } catch (error) {
      notification.error({
        message: "Prediction Failed",
        description: "There was an error processing your request.",
      });
    } finally {
      setLoading(false); // Ensure loading indicator is stopped
    }
  };

  const onFinish2 = async () => {
    setLoading(true);

    if (!origin || !destination) {
      notification.error({
        message: "Validation Error",
        description: "Please enter both origin and destination addresses.",
      });
      setLoading(false); // Stop loading indicator if validation fails
      return;
    }

    try {
      if (session) {
        const token = await session.getToken();

        const response = await axios.post(
          `${BaseUrl}/predict`,
          {
            Distance: distance,
            PickupTimeWindow: formData.pickupTimeWindow,
            NumPackages: parseInt(formData.packageDetails.numberOfPackages, 10),
            PackageWeight: parseFloat(formData.packageDetails.packageWeight),
            ServiceType: formData.serviceType,
            SpecialHandling: formData.specialHandlingNeeded,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        console.log("Prediction response:", data);
        const price = data.prediction;
        console.log("Predicted price from function:", price);
        setPredictedPrice(price);
      }
    } catch (error) {
      notification.error({
        message: "Prediction Failed",
        description: "There was an error processing your request.",
      });
    } finally {
      setLoading(false); // Ensure loading indicator is stopped
    }
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
  // setLoading(true);
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex justify-between items-center w-full px-8">
          <div className="flex items-center space-x-4">
            <ShoppingCartOutlined
              size="large"
              className="text-blue-500 text-4xl"
            />
            <span className="text-lg font-medium">
              Determining Your Optimal Price...
            </span>
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <section className="bg-gradient-to-r from-blue-200 to-indigo-300 py-2">
        <div className="mt-6 lg:flex lg:items-start lg:gap-12 px-4">
          <div className="flex-1 space-y-8 mb-5 md:mb-0">
            <div className="space-y-4">
              {/* <h2 className="text-xl font-semibold text-gray-800 justify-center items-center">
                Booking Details
              </h2> */}
              <h2 className="text-2xl font-semibold text-gray-700 mb-8">
                Shipment Details
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
                    <span className="text-gray-900 capitalize">
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
                  <div className="divide-gray-500">
                    <dl className="flex items-center justify-between gap-4 py-3  border-gray-300">
                      <dt className="text-base font-normal">Subtotal</dt>
                      <dd className="text-base font-medium">
                        ₹
                        {(predictedPrice + 5).toFixed(2) -
                          (0.18 * (predictedPrice + 5 - 5)).toFixed(3)}
                      </dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4 py-3  border-gray-300">
                      <dt className="text-base font-normal">Discount</dt>
                      <dd className="text-base font-medium">-₹5.00</dd>
                    </dl>
                    <dl className="flex items-center justify-between gap-4 py-3 border-b border-gray-300">
                      <dt className="text-base font-normal">GST (18%)</dt>
                      <dd className="text-base font-medium">
                        ₹{(0.18 * (predictedPrice + 5 - 5)).toFixed(3)}
                      </dd>
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
