import React from "react";
import { Progress, Card } from "antd";

const AdminDashboard = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl mb-8">
        <Card className="text-center">
          <h2 className="text-xl font-semibold">Unique Users</h2>
          <p className="text-2xl">100</p>
        </Card>

        <Card className="text-center">
          <h2 className="text-xl font-semibold">Total Revenue</h2>
          <p className="text-2xl">₹16780.58</p>
        </Card>
      </div>

      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-xl font-semibold text-center mb-4">
          Current Assignment
        </h2>
        <div className="flex justify-between items-center">
          <Progress
            percent={70}
            strokeColor="#FFC107"
            className="w-3/5"
            showInfo={false}
          />
          <Progress
            percent={30}
            strokeColor="#1890FF"
            className="w-1/3"
            showInfo={false}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Control Group */}
        <Card title="Control Group" className="text-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3>Total Bookings</h3>
              <p className="text-xl">4</p>
            </div>
            <div>
              <h3>Total Sales</h3>
              <p className="text-xl">4</p>
            </div>
            <div>
              <h3>User checked price but didn't complete order</h3>
              <p className="text-xl">4</p>
            </div>
            <div>
              <h3>Average sale per order</h3>
              <p className="text-xl">4</p>
            </div>
            <div className="col-span-2">
              <h3>Abandoned cart rate</h3>
              <p className="text-xl">4</p>
            </div>
          </div>
        </Card>

        {/* Experiment Group */}
        <Card title="Experiment Group" className="text-center">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3>Total Bookings</h3>
              <p className="text-xl">4</p>
            </div>
            <div>
              <h3>Total Sales</h3>
              <p className="text-xl">4</p>
            </div>
            <div>
              <h3>User checked price but didn't complete order</h3>
              <p className="text-xl">4</p>
            </div>
            <div>
              <h3>Average sale per order</h3>
              <p className="text-xl">4</p>
            </div>
            <div className="col-span-2">
              <h3>Abandoned cart rate</h3>
              <p className="text-xl">4</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
