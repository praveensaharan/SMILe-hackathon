import React, { useState, useEffect } from "react";
import { Spin, Card, Row, Col, Statistic } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useSession } from "@clerk/clerk-react";
import { Slider } from "antd";
const BaseUrl = "https://backend-peach-theta.vercel.app";
// const BaseUrl = "http://localhost:3000";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const { session } = useSession();

  // const [actualPercentage, setActualPercentage] = useState(70);
  // const [experimentalPercentage, setExperimentalPercentage] = useState(30);

  // const handleActualChange = (e) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (value >= 0 && value <= 100) {
  //     setActualPercentage(value);
  //     setExperimentalPercentage(100 - value);
  //   }
  // };

  // const handleExperimentalChange = (e) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (value >= 0 && value <= 100) {
  //     setExperimentalPercentage(value);
  //     setActualPercentage(100 - value);
  //   }
  // };

  const [actualPercentage, setActualPercentage] = useState(70);
  const [experimentalPercentage, setExperimentalPercentage] = useState(30);

  const handleSliderChange = (value) => {
    setActualPercentage(value);
    setExperimentalPercentage(100 - value);
  };

  useEffect(() => {
    const fetchOrdersData = async () => {
      if (session) {
        try {
          const token = await session.getToken();
          const response = await fetch(`${BaseUrl}/calculatedmetrics`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch orders data");
          }

          const data1 = await response.json();
          console.log(data1.metrics);
          setData(data1.metrics);
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
          tip="Loading your dashboard..."
          style={{ color: "#4A90E2", fontSize: "20px" }}
        />
      </div>
    );
  }

  return (
    <div className=" min-h-screen py-4 px-4 md:px-8 flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex flex-wrap justify-center items-center mb-2 w-full max-w-screen-lg">
        <div className="flex justify-center items-center w-full sm:w-1/2 md:w-1/3 p-4">
          <div className="text-center py-6 px-20 rounded-lg border-0 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200">
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-700">
                  Unique Users
                </span>
              }
              value={data.totalUsers}
              prefix={<UserOutlined className="mr-2 text-xl text-green-600" />}
              valueStyle={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#10B981",
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center w-full sm:w-1/2 md:w-1/3 p-4">
          <div className="text-center py-6 px-20 rounded-lg border-0 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200">
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-700">
                  Total Revenue
                </span>
              }
              value={data.totalRevenue}
              prefix={<span className="text-xl text-blue-600">₹</span>}
              precision={2}
              valueStyle={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#3B82F6",
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center w-full sm:w-1/2 md:w-1/3 p-4">
          <div className="text-center py-6 px-20 rounded-lg border-0 shadow-lg bg-gradient-to-r from-gray-100 to-gray-200">
            <Statistic
              title={
                <span className="text-sm font-medium text-gray-700">
                  Total Bookings
                </span>
              }
              value={data.totalBookings}
              prefix={
                <ShoppingCartOutlined className="mr-2 text-xl text-yellow-600" />
              }
              valueStyle={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#F59E0B",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="mb-6 max-w-screen-lg"
        style={{
          width: "98%",
        }}
      >
        <h2 className="text-lg font-semibold mb-4">Current Assignment</h2>
        <div className="w-full flex rounded-lg overflow-hidden shadow-sm border border-gray-300 mb-1">
          <div
            className="flex items-center justify-center text-white font-medium p-2"
            style={{
              width: `${actualPercentage}%`,
              backgroundColor: "#10B981",
            }}
          >
            <span className="text-base">Actual: {actualPercentage}%</span>
          </div>
          <div
            className="flex items-center justify-center text-white font-medium p-2"
            style={{
              width: `${experimentalPercentage}%`,
              backgroundColor: "#3B82F6",
            }}
          >
            <span className="text-base">
              Experimental: {experimentalPercentage}%
            </span>
          </div>
        </div>

        <div className="flex justify-center items-center opacity-90">
          <Slider
            min={0}
            max={100}
            value={actualPercentage}
            onChange={handleSliderChange}
            className="max-w-md w-4/5 bg-gray-200 rounded-lg"
            tooltipStyle={{
              backgroundColor: "#4A90E2",
              color: "#FFFFFF",
              borderRadius: "4px",
              fontSize: "2px",
            }}
          />
        </div>
      </div>

      <Row gutter={[16, 16]} className="w-full max-w-screen-lg">
        <Col xs={24} md={12}>
          <Card
            title="Control Group"
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 border-0 rounded-lg shadow-lg"
            headStyle={{
              backgroundColor: "#1f2937",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Total Sales
                    </span>
                  }
                  value={data.totalSales}
                  prefix={<span className="text-xl text-green-600">₹</span>}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#10B981",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Checked Price, Didn't Order
                    </span>
                  }
                  value={data.checkedPriceButDidntOrder}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#F59E0B",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Average Sale per Order
                    </span>
                  }
                  value={data.avgSalePerOrder}
                  prefix={<span className="text-xl text-blue-600">₹</span>}
                  precision={2}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#3B82F6",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Avg. Distance per Order
                    </span>
                  }
                  value={data.avgDistancePerOrder}
                  suffix={<span className="text-sm text-gray-500">km</span>}
                  precision={2}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#6B7280",
                  }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Abandoned Cart Rate
                    </span>
                  }
                  value={`${data.abandonedCartRate}%`}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#EF4444",
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card
            title="Experiment Group"
            className="w-full bg-gradient-to-r from-gray-100 to-gray-200 border-0 rounded-lg shadow-lg"
            headStyle={{
              backgroundColor: "#1f2937",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
            bodyStyle={{ padding: "20px" }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Total Sales
                    </span>
                  }
                  value={data.totalSales}
                  prefix={<span className="text-xl text-green-600">₹</span>}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#10B981",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Checked Price, Didn't Order
                    </span>
                  }
                  value={data.checkedPriceButDidntOrder}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#F59E0B",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Average Sale per Order
                    </span>
                  }
                  value={data.avgSalePerOrder}
                  prefix={<span className="text-xl text-blue-600">₹</span>}
                  precision={2}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#3B82F6",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Avg. Distance per Order
                    </span>
                  }
                  value={data.avgDistancePerOrder}
                  suffix={<span className="text-sm text-gray-500">km</span>}
                  precision={2}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#6B7280",
                  }}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title={
                    <span className="text-sm font-medium text-gray-700">
                      Abandoned Cart Rate
                    </span>
                  }
                  value={`${data.abandonedCartRate}%`}
                  valueStyle={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#EF4444",
                  }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
