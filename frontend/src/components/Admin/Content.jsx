import React, { useState, useEffect } from "react";
import { Spin, Card, Row, Col, Statistic } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { useSession } from "@clerk/clerk-react";
const BaseUrl = "https://backend-peach-theta.vercel.app";
// const BaseUrl = "http://localhost:3000";

const AdminDashboard = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const { session } = useSession();

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
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">Admin Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6 w-full max-w-screen-lg">
        <Col xs={24} sm={12} md={8}>
          <Card className="w-full">
            <Statistic
              title="Unique Users"
              value={data.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="w-full">
            <Statistic
              title="Total Revenue"
              value={data.totalRevenue}
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="w-full">
            <Statistic
              title="Total Bookings"
              value={data.totalBookings}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Current Assignment" className="mb-6 w-full max-w-screen-lg">
        <div className="w-full flex rounded-lg">
          <div className="w-[70%] bg-[#4ad428] flex rounded-lg items-center justify-center text-white font-bold p-2">
            Actual-70%
          </div>
          <div className="w-[30%] bg-[#1890FF] flex rounded-lg items-center justify-center text-white font-bold p-2">
            Experimental-30%
          </div>
        </div>
      </Card>

      <Row gutter={[16, 16]} className="w-full max-w-screen-lg">
        <Col xs={24} md={12}>
          <Card title="Control Group" className="w-full">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Total Sales"
                  value={data.totalSales}
                  prefix="₹"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Checked Price, Didn't Order"
                  value={data.checkedPriceButDidntOrder}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Average Sale per Order"
                  value={data.avgSalePerOrder}
                  prefix="₹"
                  precision={2}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg. Distance per Order"
                  value={data.avgDistancePerOrder}
                  suffix="km"
                  precision={2}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Abandoned Cart Rate"
                  value={`${data.abandonedCartRate}%`}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Experiment Group */}
        <Col xs={24} md={12}>
          <Card title="Experiment Group" className="w-full">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Total Sales"
                  value={data.totalSales}
                  prefix="₹"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Checked Price, Didn't Order"
                  value={data.checkedPriceButDidntOrder}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Average Sale per Order"
                  value={data.avgSalePerOrder}
                  prefix="₹"
                  precision={2}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg. Distance per Order"
                  value={data.avgDistancePerOrder}
                  suffix="km"
                  precision={2}
                />
              </Col>
              <Col span={24}>
                <Statistic
                  title="Abandoned Cart Rate"
                  value={`${data.abandonedCartRate}%`}
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
