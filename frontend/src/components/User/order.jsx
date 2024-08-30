import React, { useState, useEffect } from "react";
import { useSession } from "@clerk/clerk-react";
import { Spin } from "antd";
const BaseUrl = "https://backend-peach-theta.vercel.app";
// const BaseUrl = "http://localhost:3000";

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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spin
          size="large"
          tip="Loading your orders..."
          style={{ color: "#4A90E2", fontSize: "20px" }}
        />
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        Your Orders
      </h1>
      {data.length === 0 ? (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center">
            <svg
              viewBox="0 0 24 24"
              className="text-red-600 w-16 h-16 mx-auto mb-4"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.977,16.5h-1.4l-1.243-1.244c-1.5,1.08-3.263,1.744-5.334,1.744-2.173,0-4.126-1.073-5.303-2.714C4.107,13.628,3.867,12.855,4.06,12.1L2.515,9.49A10.834,10.834,0,0,0,2.25,12,11.98,11.98,0,0,0,24,12a11.98,11.98,0,0,0-.318-2.51L22.4,9.49c-.155.72-1.277,2.318-4.423,4.644a11.94,11.94,0,0,0-.829.705c-.013.011-.028.021-.041.032-.064.053-.128.109-.192.164-.271.23-.538.463-.8.7-.042.039-.084.077-.125.116L14.377,16.5h-1.4l.126-.116c-1.5-1.08-3.262-1.744-5.334-1.744-2.173,0-4.126,1.073-5.303,2.714C1.107,17.628,.867,16.855,1.06,16.1L-.485,13.49A10.834,10.834,0,0,0,0,12,11.98,11.98,0,0,0,21.75,12,11.98,11.98,0,0,0,0,12a11.98,11.98,0,0,0,.318-2.51L1.6,9.49C1.755,10.21,2.877,11.808,6.023,14.134a11.94,11.94,0,0,0,.829.705c.013.011,.028.021,.041.032.064.053,.128.109,.192.164.271.23,.538.463,.8.7,.042,.039,.084,.077,.125,.116l-.126,.116H6.977ZM12,2.75A9.25,9.25,0,1,1,2.75,12,9.262,9.262,0,0,1,12,2.75ZM8.25,13a1.25,1.25,0,1,1,1.25-1.25A1.249,1.249,0,0,1,8.25,13Zm3.5,0a1.25,1.25,0,1,1,1.25-1.25A1.249,1.249,0,0,1,11.75,13Zm3.5,0a1.25,1.25,0,1,1,1.25-1.25A1.249,1.249,0,0,1,15.25,13Z"
              ></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Orders Found
            </h3>
            <p className="text-gray-600">
              There are currently no orders to display.
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-8">
          {data.map((order) => (
            <li
              key={order.id}
              className="p-4 bg-blue-100 border border-gray-300 rounded-lg shadow hover:shadow-md transition-shadow duration-300 ease-in-out"
            >
              <div className="flex flex-col md:flex-row justify-between items-start">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    Order #{order.unique_order_id.slice(-7)}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {formatDateToReadable(order.order_date)}
                  </p>
                </div>
                <div className="flex flex-col text-right mt-3 md:mt-0">
                  <p className="text-xs text-gray-600 mb-1">
                    Payment ID: #{order.unique_order_id.slice(7)}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    Total: {order.order_price}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Summary
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    Total: {order.order_price}
                  </p>
                  <p className="text-xs font-medium text-gray-600 mt-1">
                    Pickup Address:
                  </p>
                  <p className="text-xs text-gray-600">
                    {order.pickup_address}
                  </p>
                </div>

                <div className="bg-gray-100 p-3 rounded-lg shadow-sm">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Shipping
                  </h3>
                  <div className="flex items-center space-x-3">
                    <img
                      className="w-6 h-6"
                      alt="shipping"
                      src="https://i.ibb.co/L8KSdNQ/image-3.png"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        DPD Delivery
                      </p>
                      <p className="text-xs text-gray-600">
                        Delivery Status: Order Received
                      </p>
                      <p className="text-xs font-medium text-gray-600 mt-1">
                        Shipping Address:
                      </p>
                      <p className="text-xs text-gray-600">
                        {order.delivery_address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between mt-4 bg-gray-50 p-3 rounded-lg space-y-3 md:space-y-0 md:space-x-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Customer Details
                  </h3>
                  <p className="text-sm font-medium text-gray-800">
                    {order.full_name_order}
                  </p>
                  <p className="text-xs text-gray-600 flex items-center">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="inline mr-1"
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
                    {order.email}
                  </p>
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-gray-600">
                    Number of Packages: {order.number_of_packages}
                  </p>
                  <p className="text-xs text-gray-600">
                    Package Weight: {order.package_weight} kg
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
