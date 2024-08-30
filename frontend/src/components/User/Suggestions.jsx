import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Card, Tooltip, Col, Row } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

Chart.register(...registerables);
const imageurl =
  "https://media.istockphoto.com/id/1142724418/photo/harbor-colorful-containers.jpg?s=612x612&w=0&k=20&c=QnSRPTyOoolJa3ev9DAB8OKw4UJn9JHQYXT3-uO8xqw=";

const PricingInsights = () => {
  const weightData = {
    labels: ["1kg", "2kg", "3kg", "4kg", "5kg"],
    datasets: [
      {
        label: "Price vs Weight",
        data: [100, 150, 200, 250, 300],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const distanceData = {
    labels: ["1km", "2km", "3km", "4km", "5km"],
    datasets: [
      {
        label: "Price vs Distance",
        data: [100, 180, 260, 340, 420],
        borderColor: "rgba(255,99,132,1)",
        backgroundColor: "rgba(255,99,132,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const priceOptions = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Weight & Distance",
          color: "#666",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (₹)",
          color: "#666",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        position: "top",
      },
    },
  };

  const renderChartCard = (title, tooltip, description, chartData) => (
    <Card className="p-6 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        {title}
        <Tooltip title={tooltip} placement="topRight">
          <InfoCircleOutlined className="text-indigo-500 ml-2" />
        </Tooltip>
      </h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Line data={chartData} options={priceOptions} />
    </Card>
  );

  const renderInfoCard = (title, tooltip, description, imgSrc, altText) => (
    <Card className="p-6 bg-white rounded-lg shadow-md h-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        {title}
        <Tooltip title={tooltip} placement="topRight">
          <InfoCircleOutlined className="text-indigo-500 ml-2" />
        </Tooltip>
      </h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <img
        src={imgSrc}
        alt={altText}
        className="w-full h-32 object-cover rounded-lg shadow-lg"
      />
    </Card>
  );

  return (
    <div className="relative p-8 py-20 rounded-lg shadow-lg">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('${imageurl}')`,
        }}
      ></div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Understanding Pricing Factors
        </h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            {renderChartCard(
              "Weight is Key",
              "Heavier packages typically cost more to ship.",
              "The weight of your package is the most significant factor affecting the shipping price. Heavier packages increase costs due to the added handling and transportation needs.",
              weightData
            )}
          </Col>
          <Col xs={24} md={12}>
            {renderChartCard(
              "Distance Matters",
              "Longer distances lead to higher shipping costs.",
              "Shipping to farther destinations increases the price due to the greater resources required, including fuel, time, and logistics.",
              distanceData
            )}
          </Col>
          <Col xs={24} md={12}>
            {renderInfoCard(
              "Number of Packages",
              "More packages slightly increase the cost, but weight is more crucial.",
              "While the number of packages does influence the price, its impact is generally less than that of weight. Consolidating your items into fewer packages can be cost-effective.",
              "https://plus.unsplash.com/premium_photo-1679858781690-71bffb438658?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              "Secure Delivery"
            )}
          </Col>
          <Col xs={24} md={12}>
            {renderInfoCard(
              "Extra Care for Secure Delivery",
              "Choosing special handling ensures a safer and more secure delivery.",
              "Opting for special handling ensures that your packages are treated with extra care, reducing the risk of damage during transit. This service adds a small premium but offers peace of mind.",
              "https://plus.unsplash.com/premium_photo-1682144129268-da41af3e9793?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VjdXJlJTIwZGVsaXZlcnl8ZW58MHx8MHx8fDA%3D",
              "Secure Delivery"
            )}
          </Col>
        </Row>

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
            Understanding Shipping Types
          </h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              {renderInfoCard(
                "Standard Shipping",
                "Standard shipping is cost-effective but takes longer.",
                "Standard shipping is the most affordable option, though it has longer delivery times. It's ideal for non-urgent deliveries.",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxRYTqdK56B4JTwZoczRWZOwFjnzmUsTXHtygVN_moF4en4A1phfMAsPywUu7TexYW4A0&usqp=CAU",
                "Standard Shipping"
              )}
            </Col>
            <Col xs={24} md={8}>
              {renderInfoCard(
                "Express Shipping",
                "Express shipping balances cost and speed.",
                "Express shipping offers faster delivery times than standard shipping, making it a good choice for items that need to arrive quickly but are not urgent.",
                "https://media.istockphoto.com/id/1069742886/photo/loaded-european-truck-on-motorway-in-sunset.jpg?s=612x612&w=0&k=20&c=s7-nBIrUURXWuhXFmkBBUifMdBjGl4z5hVk1qrloxh0=",
                "Express Shipping"
              )}
            </Col>
            <Col xs={24} md={8}>
              {renderInfoCard(
                "Overnight Shipping",
                "Overnight shipping is the fastest but most expensive option.",
                "Overnight shipping is ideal for urgent deliveries that need to arrive the next day. It's the most expensive option but guarantees speed.",
                "https://media.istockphoto.com/id/1047540990/photo/loading-cargo-into-the-aircraft-before-departure-in-domodedovo-airport-in-moscow-russia.jpg?s=612x612&w=0&k=20&c=7-O4d2QVP7UCz229167Tf1FRS7LBs9RlpU3jJlihHJE=",
                "Overnight Shipping"
              )}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default PricingInsights;
