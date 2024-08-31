import React from "react";
import { Card } from "antd";
import {
  CodepenOutlined,
  EnvironmentOutlined,
  BoxPlotOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import OrdersPage from "./order";
const imageUrl =
  "https://media.istockphoto.com/id/1418267688/photo/aerial-top-down-view-of-a-large-container-cargo-ship-with-copy-space.jpg?s=612x612&w=0&k=20&c=yp2Y2BxdYy5z4mpKT8fRc1uTf-ocJVNlGjjPNEo7jSM=";

const features = [
  {
    icon: <CodepenOutlined className="text-3xl text-blue-500" />,
    title: "Weight is Key",
    description:
      "The weight of your package is the most significant factor affecting the shipping price. Heavier packages increase costs due to the added handling and transportation needs.",
  },
  {
    icon: <EnvironmentOutlined className="text-3xl text-green-500" />,
    title: "Distance Matters",
    description:
      "Shipping to farther destinations increases the price due to the greater resources required, including fuel, time, and logistics.",
  },
  {
    icon: <BoxPlotOutlined className="text-3xl text-yellow-500" />,
    title: "Number of Packages",
    description:
      "While the number of packages does influence the price, its impact is generally less than that of weight. Consolidating your items into fewer packages can be cost-effective.",
  },
  {
    icon: <SafetyCertificateOutlined className="text-3xl text-red-500" />,
    title: "Secure Delivery",
    description:
      "Opting for special handling ensures that your packages are treated with extra care, reducing the risk of damage during transit. This service adds a small premium but offers peace of mind.",
  },
  {
    icon: <ClockCircleOutlined className="text-3xl text-indigo-500" />,
    title: "Standard Shipping",
    description:
      "Standard shipping is the most affordable option, though it has longer delivery times. It's ideal for non-urgent deliveries.",
  },
  {
    icon: <ThunderboltOutlined className="text-3xl text-orange-500" />,
    title: "Express Shipping",
    description:
      "Express shipping offers faster delivery times than standard shipping, making it a good choice for items that need to arrive quickly but are not urgent.",
  },
  {
    icon: <RocketOutlined className="text-3xl text-purple-500" />,
    title: "Overnight Shipping",
    description:
      "Overnight shipping is ideal for urgent deliveries that need to arrive the next day. It's the most expensive option but guarantees speed.",
  },
];

const Dashboard = () => {
  return (
    <div className="relative flex flex-col lg:flex-row min-h-screen p-8">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      ></div>
      {/* Left Section: Orders Page */}
      <section className="lg:w-2/3 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <OrdersPage />
        </div>
      </section>

      {/* Right Section: WebApp Features */}
      <section className="lg:w-1/3 flex flex-col h-full overflow-hidden">
        <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
          Key Features to Consider
        </h2>
        <div className="flex-1 overflow-y-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-2xl transform hover:-translate-y-1 transition-transform duration-300 ease-in-out"
              >
                <div className="text-primary mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

// <div className="flex flex-col lg:flex-row min-h-screen p-8 bg-gradient-to-b from-gray-100 to-gray-200">
//   {/* Left Section: Orders Page */}
//   <section className="lg:w-2/3 mb-16 lg:mb-0 flex ">
//     <div className="w-full">
//       <OrdersPage />
//     </div>
//   </section>

//   {/* Right Section: WebApp Features */}
//   <section className="lg:w-1/3 flex flex-col justify-center items-center">
//     <h2 className="text-2xl font-semibold text-gray-700 mb-8 text-center">
//       Explore Our WebApp Features
//     </h2>
//     <div className="grid grid-cols-1 sm:grid-cols-1 gap-6 w-full">
//       {features.map((feature, index) => (
//         <Card
//           key={index}
//           className="bg-white rounded-lg shadow-lg p-2 hover:shadow-2xl transform hover:-translate-y-1 transition-transform duration-300 ease-in-out"
//         >
//           <div className="text-primary mb-4 text-3xl">{feature.icon}</div>
//           <h3 className="text-xl font-semibold text-gray-800 mb-2">
//             {feature.title}
//           </h3>
//           <p className="text-gray-600 leading-relaxed">
//             {feature.description}
//           </p>
//         </Card>
//       ))}
//     </div>
//   </section>
// </div>
