import React from "react";
import { Card, List, Button } from "antd";
import { ShoppingCartOutlined, CheckCircleOutlined } from "@ant-design/icons";
import OrdersPage from "./order";

const features = [
  {
    icon: <ShoppingCartOutlined className="text-3xl text-blue-500" />,
    title: "Easy Shopping",
    description: "Browse and shop your favorite items with ease.",
  },
  {
    icon: <CheckCircleOutlined className="text-3xl text-green-500" />,
    title: "Order Tracking",
    description: "Track your orders in real-time from processing to delivery.",
  },
  {
    icon: <ShoppingCartOutlined className="text-3xl text-yellow-500" />,
    title: "Exclusive Offers",
    description: "Get access to exclusive discounts and offers.",
  },
];

const Dashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center mb-10">User Dashboard</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Features of Our WebApp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="text-center p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="mb-10">
        <OrdersPage />
      </div>
    </div>
  );
};

export default Dashboard;
