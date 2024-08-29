import React, { useState, useEffect } from "react";
import { useSession } from "@clerk/clerk-react";
import { Spin } from "antd";
const BaseUrl = "https://backend-peach-theta.vercel.app";

// Date formatting function
const formatDateToReadable = (dateString) => {
  const orderDate = new Date(dateString);
  const formattedDate = orderDate.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
  });
  const formattedTime = orderDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
};

const OrdersPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { session } = useSession();

  useEffect(() => {
    const fetchOrdersData = async () => {
      if (session) {
        try {
          const token = await session.getToken();
          const response = await fetch(`${BaseUrl}/getorders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch orders data");
          }

          const data1 = await response.json();
          setData(data1);
        } catch (error) {
          console.error("Error fetching orders data:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrdersData();
  }, [session]);

  if (loading) {
    return (
      <div className="h-40">
        <Spin />
      </div>
    );
  }

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-20 2xl:container 2xl:mx-auto mt-16">
      <h1 className="font-bold mb-5">Your Orders</h1>
      {data.length === 0 ? (
        <div className="bg-gray-100 h-screen mt-10">
          <div className="bg-white p-6 md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-red-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.977,16.5h-1.4l-1.243-1.244c-1.5,1.08-3.263,1.744-5.334,1.744-2.173,0-4.126-1.073-5.303-2.714C4.107,13.628,3.867,12.855,4.06,12.1L2.515,9.49A10.834,10.834,0,0,0,2.25,12,11.98,11.98,0,0,0,24,12a11.98,11.98,0,0,0-.318-2.51L22.4,9.49c-.155.72-1.277,2.318-4.423,4.644a11.94,11.94,0,0,0-.829.705c-.013.011-.028.021-.041.032-.064.053-.128.109-.192.164-.271.23-.538.463-.8.7-.042.039-.084.077-.125.116L14.377,16.5h-1.4l.126-.116c-1.5-1.08-3.262-1.744-5.334-1.744-2.173,0-4.126,1.073-5.303,2.714C1.107,17.628,.867,16.855,1.06,16.1L-.485,13.49A10.834,10.834,0,0,0,0,12,11.98,11.98,0,0,0,21.75,12,11.98,11.98,0,0,0,0,12a11.98,11.98,0,0,0,.318-2.51L1.6,9.49C1.755,10.21,2.877,11.808,6.023,14.134a11.94,11.94,0,0,0,.829.705c.013.011,.028.021,.041.032.064.053,.128.109,.192.164.271.23,.538.463,.8.7,.042,.039,.084,.077,.125,.116l-.126,.116H6.977ZM12,2.75A9.25,9.25,0,1,1,2.75,12,9.262,9.262,0,0,1,12,2.75ZM8.25,13a1.25,1.25,0,1,1,1.25-1.25A1.249,1.249,0,0,1,8.25,13Zm3.5,0a1.25,1.25,0,1,1,1.25-1.25A1.249,1.249,0,0,1,11.75,13Zm3.5,0a1.25,1.25,0,1,1,1.25-1.25A1.249,1.249,0,0,1,15.25,13Z"
              ></path>
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                No Orders Found
              </h3>
              <p className="text-gray-600 my-2">
                There are currently no orders to display.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ul className="space-y-8">
          {data.map((order) => (
            <div className="border-2 p-4 bg-white rounded-2xl" key={order._id}>
              <li>
                <div className="flex">
                  <div className="flex-1 justify-start items-start space-y-2 flex-col">
                    <h1 className="text-3xl lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
                      Order #{order.id.slice(-7)}
                    </h1>
                    <p className="text-base font-medium leading-6 text-gray-600">
                      {formatDateToReadable(order.date)}
                    </p>
                  </div>
                  <div className="flex-1 justify-end items-end space-y-2 flex-col">
                    <p className="text-base font-medium leading-6 text-gray-600">
                      Payment ID: #{order.id.slice(7)}
                    </p>
                  </div>
                </div>

                <div className="mt-10 flex flex-col xl:flex-row justify-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
                  <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
                    <div className="flex justify-center md:flex-row flex-col items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
                      <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 space-y-6">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800">
                          Summary
                        </h3>

                        <div className="flex justify-between items-center w-full">
                          <p className="text-base font-semibold leading-4 text-gray-800">
                            Total
                          </p>
                          <p className="text-base font-semibold leading-4 text-gray-600">
                            {order.order_price}
                          </p>
                        </div>
                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-0 xl:mt-5">
                          <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                            Shipping Address
                          </p>
                          <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                            {order.delivery_address}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-100 space-y-6">
                        <h3 className="text-xl font-semibold leading-5 text-gray-800">
                          Shipping
                        </h3>
                        <div className="flex justify-between items-start w-full">
                          <div className="flex justify-center items-center space-x-4">
                            <div className="w-8 h-8">
                              <img
                                className="w-full h-full"
                                alt="logo"
                                src="https://i.ibb.co/L8KSdNQ/image-3.png"
                              />
                            </div>
                            <div className="flex flex-col justify-start items-center">
                              <p className="text-lg leading-6 font-semibold text-gray-800">
                                DPD Delivery
                                <br />
                                <span className="font-normal">
                                  Delivery Status: Order Received
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 w-full xl:w-96 flex justify-between items-center md:items-start px-4 py-6 md:p-6 xl:p-8 flex-col">
                    <h3 className="text-xl font-semibold leading-5 text-gray-800 mb-4">
                      Customer Details
                    </h3>
                    <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                      <div className="flex flex-col justify-start items-start flex-shrink-0">
                        <div className="flex justify-center w-full md:justify-start items-center space-x-4 border-b border-gray-200">
                          <div className="flex justify-start items-start flex-col">
                            <p className="text-base font-semibold text-left text-gray-800">
                              {order.full_name_order}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center md:justify-start items-center space-x-1 py-1 border-b border-gray-200 w-full">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                              stroke="#1F2937"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3 7L12 13L21 7"
                              stroke="#1F2937"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="cursor-pointer text-sm leading-1 text-gray-800">
                            {order.email}
                          </p>
                        </div>
                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-0 xl:mt-5">
                          <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                            Number of Packages
                          </p>
                          <p className="text-sm leading-5 text-gray-600">
                            {order.number_of_packages}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-1 md:mt-0">
                        <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-1 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                          <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-0 xl:mt-5">
                            <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800">
                              Pickup Address
                            </p>
                            <p className="w-48 lg:w-full xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                              {order.pickup_address}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-0 xl:mt-5">
                          <p className="text-base font-semibold leading-4 text-center md:text-left text-gray-800 mt-2">
                            Package Weight
                          </p>
                          <p className="text-sm leading-5 text-gray-600">
                            {order.package_weight} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
