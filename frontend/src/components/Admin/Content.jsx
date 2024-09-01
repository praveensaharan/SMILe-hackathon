import React, { useState, useEffect, useRef } from "react";
import { Spin, Card, Row, Col, Statistic, notification, Slider } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useSession, useUser } from "@clerk/clerk-react";
import axios from "axios";

const BaseUrl = "https://backend-peach-theta.vercel.app";
// const BaseUrl = "http://localhost:3000";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { session } = useSession();
  const { user } = useUser();
  const [actualPercentage, setActualPercentage] = useState(70);
  const [experimentalPercentage, setExperimentalPercentage] = useState(30);

  const notificationTimeoutRef = useRef(null);

  const handleSliderChange = async (value) => {
    setActualPercentage(value);
    setExperimentalPercentage(100 - value);

    // Update the user's unsafeMetadata with the new percentage
    try {
      await user.update({
        unsafeMetadata: { actualPercentage: value.toString() },
      });
    } catch (error) {
      console.error("Failed to update user metadata:", error);
    }

    // Clear any existing notification timeout
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }

    // Debounce the notification and API call
    notificationTimeoutRef.current = setTimeout(() => {
      notification.success({
        message: "Percentage Allocation Updated",
        showProgress: true,
        description: `The distribution has been updated: ${value}% Actual and ${
          100 - value
        }% Experimental.`,
        placement: "topRight",
        duration: 3,
        className: "notification-custom-style",
      });
    }, 300); // Adjusted delay for better responsiveness
  };

  useEffect(() => {
    const initializePercentage = () => {
      if (user) {
        const { unsafeMetadata } = user;

        if (unsafeMetadata && unsafeMetadata.actualPercentage) {
          const storedPercentage = parseInt(unsafeMetadata.actualPercentage);
          if (!isNaN(storedPercentage)) {
            setActualPercentage(storedPercentage);
            setExperimentalPercentage(100 - storedPercentage);
          }
        }
      }
    };

    initializePercentage();
  }, [user]);

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);
  useEffect(() => {
    const fetchMetricssData = async () => {
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
          setData(data1.metrics);
        } catch (error) {
          console.error("Error fetching orders data:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMetricssData();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
            <span className="text-base">Control: {actualPercentage}%</span>
          </div>
          <div
            className="flex items-center justify-center text-white font-medium p-2"
            style={{
              width: `${experimentalPercentage}%`,
              backgroundColor: "#3B82F6",
            }}
          >
            <span className="text-base">Target: {experimentalPercentage}%</span>
          </div>
        </div>

        <div className="flex flex-col items-center opacity-90 p-1">
          <span className="text-lg font-semibold text-gray-900">
            Adjust Assignment Percentage
          </span>
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
              fontSize: "12px",
            }}
          />
        </div>
      </div>

      <Row gutter={[16, 16]} className="w-full max-w-screen-lg">
        <Col xs={24} md={12}>
          <Card
            title="Control Group"
            className="w-full bg-gray-100 border-0 rounded-lg shadow-lg"
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
                  value={data.controlGroup.totalSales}
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
                  value={data.controlGroup.checkedPriceButDidntOrder}
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
                  value={data.controlGroup.avgSalePerOrder}
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
                  value={data.controlGroup.avgDistancePerOrder}
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
                  value={`${data.controlGroup.abandonedCartRate}%`}
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
            title="Target Group"
            className="w-full bg-gray-100 border-0 rounded-lg shadow-lg"
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
                  value={data.experimentGroup.totalSales}
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
                  value={data.experimentGroup.checkedPriceButDidntOrder}
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
                  value={data.experimentGroup.avgSalePerOrder}
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
                  value={data.experimentGroup.avgDistancePerOrder}
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
                  value={`${data.experimentGroup.abandonedCartRate}%`}
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
