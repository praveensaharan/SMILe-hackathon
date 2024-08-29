// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { Card, Descriptions, Tag, notification } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";
// import Map from "../UserHome1/Map";

// const FormSubmission = () => {
//   const location = useLocation();
//   const [distance, setDistance] = useState(0);
//   const [predictedPrice, setPredictedPrice] = useState(null);
//   const formData = location.state?.formData || {}; // Prevent errors if formData is missing

//   //   const origin = {
//   //     description: formData.pickupAddress,
//   //     lng: formData.pickupAddresslng,
//   //     lat: formData.pickupAddresslat,
//   //   };
//   //   const destination = {
//   //     description: formData.deliveryAddress,
//   //     lng: formData.deliveryAddresslng,
//   //     lat: formData.deliveryAddresslat,
//   //   };

//   const origin = {
//     description:
//       "Allen Career Institute, Noida, C Block, Phase 2, Industrial Area, Sector 62, Noida, Uttar Pradesh, 201309, India",
//     lat: "28.6148",
//     lng: "77.36342",
//   };

//   const destination = {
//     description:
//       "Bukai Reson Shop, CRP Rd, Potoldanga, Maheshtala, West Bengal, 700141, India",
//     lat: "22.49296",
//     lng: "88.24545",
//   };
//   const apiKey = "bW9Vg3nH1MtEZpz9eLxrn2kJ8TsTOKZVh72yAw0h";
//   //   const apiKey = process.env.REACT_APP_OLA_KEY; // Replace with your API key

//   useEffect(() => {
//     const fetchRoute = async () => {
//       try {
//         const apiUrl = `https://api.olamaps.io/routing/v1/directions?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=false&steps=true&overview=full&language=en&traffic_metadata=false&api_key=${apiKey}`;

//         const response = await fetch(apiUrl, {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//           },
//         });

//         const data = await response.json();
//         const route = data.routes[0];

//         if (route) {
//           const distanceInMeters = route.legs[0].distance;
//           const distanceInKm = distanceInMeters / 1000; // Convert to kilometers
//           setDistance(distanceInKm);
//         }
//       } catch (error) {
//         console.error("Error fetching route:", error);
//       }
//     };

//     if (origin && destination) {
//       fetchRoute();
//     }
//   }, [origin, destination, apiKey]);

//   const onFinish = () => {
//     if (!origin || !destination) {
//       notification.error({
//         message: "Validation Error",
//         description: "Please enter both origin and destination addresses.",
//       });
//       return;
//     }
//     console.log(
//       distance
//         parseInt(formData.serviceType, 10),
//         parseInt(formData.packageDetails?.numberOfPackages, 10),
//         parseInt(formData.specialHandlingNeeded),
//         parseFloat(formData.packageDetails?.packageWeight)
//     );
//     const valuesWithDistance = {
//       Distance: distance,
//       ShipmentType: parseInt(formData.serviceType, 10),
//       NumPackages: parseInt(formData.packageDetails?.numberOfPackages, 10),
//       SpecialHandling: parseInt(formData.specialHandlingNeeded),
//       PackageWeight: parseFloat(formData.packageDetails?.packageWeight),
//     };

//     fetch("https://hello-xx4atey7ia-uc.a.run.app/predict", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(valuesWithDistance),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         const price = data.prediction;
//         console.log("Predicted price:", price);
//         setPredictedPrice(price);
//         notification.success({
//           message: "Prediction Success",
//           description: `The predicted price is ₹${price.toFixed(2)}`,
//         });
//       })
//       .catch(() => {
//         notification.error({
//           message: "Prediction Failed",
//           description: "There was an error processing your request.",
//         });
//       });
//   };
//   useEffect(() => {
//     onFinish();
//   }, []);

//   return (
//     <>
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
//         <Card
//           title={
//             <div className="text-center">
//               <CheckCircleOutlined className="text-4xl text-blue-600" />
//               <h2 className="text-2xl font-bold text-blue-600 mt-2">
//                 Form Submitted Successfully!
//               </h2>
//             </div>
//           }
//         >
//           <Descriptions
//             bordered
//             column={1}
//             size="middle"
//             className="bg-white p-4 rounded-lg"
//           >
//             <Descriptions.Item label="Name">
//               {formData.name || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Contact">
//               {formData.contact || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Pickup Address">
//               {formData.pickupAddress || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Pickup Date">
//               {formData.pickupDate || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Pickup Time Window">
//               {formData.pickupTimeWindow || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Delivery Address">
//               {formData.deliveryAddress || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Number of Packages">
//               {formData.packageDetails?.numberOfPackages || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Package Weight">
//               {formData.packageDetails?.packageWeight || "N/A"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Service Type">
//               <Tag color="blue">{formData.serviceType || "Standard"}</Tag>
//             </Descriptions.Item>
//             <Descriptions.Item label="Service Type">
//               <Tag color="blue">
//                 {formData.specialHandlingNeeded || "Standard"}
//               </Tag>
//             </Descriptions.Item>
//             {/* <Descriptions.Item label="Special Handling Needed">
//               {Array.isArray(formData.specialHandling) &&
//               formData.specialHandling.length > 0 ? (
//                 formData.specialHandling.map((item) => (
//                   <Tag key={item} color="red" className="mb-1">
//                     {item}
//                   </Tag>
//                 ))
//               ) : (
//                 <Tag color="green">No</Tag>
//               )}
//             </Descriptions.Item> */}
//           </Descriptions>
//         </Card>
//       </div>
//       {origin && destination && (
//         <div className="text-center text-xl text-gray-800 bg-gradient-to-r from-blue-200 to-indigo-300 pb-10">
//           {predictedPrice && (
//             <p className="mb-6">
//               The predicted price is{" "}
//               <span className="font-bold text-indigo-600">
//                 ₹{predictedPrice.toFixed(2)}
//               </span>
//             </p>
//           )}

//           <Map
//             origin={origin}
//             destination={destination}
//             totalDistance={distance}
//           />
//         </div>
//       )}
//     </>
//   );
// };

// export default FormSubmission;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Descriptions, notification, Modal, Button } from "antd";
import Map from "../UserHome1/Map";

const FormSubmission = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [distance, setDistance] = useState(0);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [isPayModalVisible, setIsPayModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);

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
  const apiKey = "bW9Vg3nH1MtEZpz9eLxrn2kJ8TsTOKZVh72yAw0h"; // Ensure the API key is correct

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
    if (!origin || !destination) {
      notification.error({
        message: "Validation Error",
        description: "Please enter both origin and destination addresses.",
      });
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
      });
  };

  const showPayModal = () => {
    setIsPayModalVisible(true);
  };

  const handlePayOk = () => {
    setIsPayModalVisible(false);
    // Add payment logic here
    console.log("Payment confirmed");
  };

  const handlePayCancel = () => {
    setIsPayModalVisible(false);
  };

  const showCancelModal = () => {
    setIsCancelModalVisible(true);
  };

  const handleCancelOk = () => {
    setIsCancelModalVisible(false);
    // Add cancel logic here
    console.log("Booking cancelled");
  };

  const handleCancelModal = () => {
    setIsCancelModalVisible(false);
  };

  return (
    <>
      <section className="bg-gradient-to-r from-blue-200 to-indigo-300 pt-20">
        <div className="mt-6 lg:flex lg:items-start lg:gap-12 px-4">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Details</h2>
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

          {predictedPrice && (
            <div className="w-full space-y-6 lg:max-w-xs xl:max-w-md justify-center items-center my-auto bg-white p-6 rounded-xl text-black">
              <div className="flow-root">
                <div className="-my-3 divide-y divide-gray-500">
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal">Subtotal</dt>
                    <dd className="text-base font-medium">
                      ₹{predictedPrice.toFixed(2)}
                    </dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-normal">Discount</dt>
                    <dd className="text-base font-medium">-₹5</dd>
                  </dl>
                  <dl className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-base font-bold">Total</dt>
                    <dd className="text-base font-bold">
                      ₹{predictedPrice.toFixed(2) - 5.0}
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
