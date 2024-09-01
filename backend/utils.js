// utils.js
const sql = require("./db");
const axios = require("axios");
const { EMAIL_VERIFY } = require("./envSetup");
const { sendSessionEmails } = require("./email");
const { clerkClient } = require("./clerk");

async function getPgVersion() {
  try {
    const result = await sql`SELECT version()`;
    return result;
  } catch (err) {
    throw new Error(`Error fetching PostgreSQL version: ${err.message}`);
  }
}

async function updateAssignment(actualPercentage, experimentalPercentage) {
  try {
    await sql`
      UPDATE current_assignment
      SET actual_percentage = ${actualPercentage}, experimental_percentage = ${experimentalPercentage}
      WHERE id = 1;
    `;
  } catch (error) {
    console.error("Error updating assignment:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function getOrders(userid) {
  try {
    const result = await sql`
      SELECT *  FROM orders WHERE user_id = ${userid};
    `;

    // console.log("result", result);
    return result;
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function addcancelorders(orderData) {
  try {
    const result = await sql`
      INSERT INTO canceled_orders (
        user_id,
        full_name_order,
        email,
        distance,
        number_of_packages,
        package_weight,
        order_price,
        role
      ) VALUES (
        ${orderData.userId},
        ${orderData.full_name_order},
        ${orderData.email},
        ${orderData.distance},
        ${orderData.number_of_packages},
        ${orderData.package_weight},
        ${orderData.order_price},
        ${orderData.role}
      )
      RETURNING *; 
    `;

    return result; // Return the inserted data or result
  } catch (error) {
    console.error("Error inserting canceled order: ", error.message);
    throw new Error("Internal Server Error");
  }
}

async function addorders(orderData) {
  try {
    const result = await sql`
      INSERT INTO orders (
        user_id,
        full_name_order,
        email,
        pickup_address,
        delivery_address,
        number_of_packages,
        package_weight,
        order_price,
        distance,
        unique_order_id,
        role
      ) VALUES (
        ${orderData.userId},
        ${orderData.full_name_order},
        ${orderData.email},
        ${orderData.pickup_address},
        ${orderData.delivery_address},
        ${orderData.number_of_packages},
        ${orderData.package_weight},
        ${orderData.order_price},
        ${orderData.distance},
        ${orderData.id},
        ${orderData.role}
      )
      RETURNING *; 
    `;

    return result; // Return the inserted data or result
  } catch (error) {
    console.error("Error inserting order: ", error.message);
    throw new Error("Internal Server Error");
  }
}

async function calculateMetrics() {
  try {
    // Calculate metrics for role 0 (Experiment Group)
    const ordersResultRole0 = await sql`
      SELECT 
        SUM(order_price) AS total_revenue, 
        SUM(distance) AS total_distance, 
        COUNT(*) AS total_orders 
      FROM orders
      WHERE user_id IN (SELECT user_id FROM users WHERE role = 0);
    `;

    const canceledOrdersResultRole0 = await sql`
      SELECT COUNT(*) AS total_canceled_orders 
      FROM canceled_orders
      WHERE user_id IN (SELECT user_id FROM users WHERE role = 0);
    `;

    // Calculate metrics for role 1 (Control Group)
    const ordersResultRole1 = await sql`
      SELECT 
        SUM(order_price) AS total_revenue, 
        SUM(distance) AS total_distance, 
        COUNT(*) AS total_orders 
      FROM orders
      WHERE user_id IN (SELECT user_id FROM users WHERE role = 1);
    `;

    const canceledOrdersResultRole1 = await sql`
      SELECT COUNT(*) AS total_canceled_orders 
      FROM canceled_orders
      WHERE user_id IN (SELECT user_id FROM users WHERE role = 1);
    `;

    // Fetch total user count
    const userCount = await clerkClient.users.getCount();

    // Parse results for role 0 (Experiment Group)
    const totalRevenueRole0 =
      parseFloat(ordersResultRole0[0]?.total_revenue) || 0;
    const totalDistanceRole0 =
      parseFloat(ordersResultRole0[0]?.total_distance) || 0;
    const totalOrdersRole0 = parseInt(ordersResultRole0[0]?.total_orders) || 0;
    const totalCanceledOrdersRole0 =
      parseInt(canceledOrdersResultRole0[0]?.total_canceled_orders) || 0;

    const avgDistancePerOrderRole0 =
      totalOrdersRole0 > 0 ? totalDistanceRole0 / totalOrdersRole0 : 0;
    const avgSalePerOrderRole0 =
      totalOrdersRole0 > 0 ? totalRevenueRole0 / totalOrdersRole0 : 0;
    const abandonedCartRateRole0 = parseFloat(
      totalOrdersRole0 + totalCanceledOrdersRole0 > 0
        ? (
            (totalCanceledOrdersRole0 /
              (totalOrdersRole0 + totalCanceledOrdersRole0)) *
            100
          ).toFixed(2)
        : 0
    );

    // Parse results for role 1 (Control Group)
    const totalRevenueRole1 =
      parseFloat(ordersResultRole1[0]?.total_revenue) || 0;
    const totalDistanceRole1 =
      parseFloat(ordersResultRole1[0]?.total_distance) || 0;
    const totalOrdersRole1 = parseInt(ordersResultRole1[0]?.total_orders) || 0;
    const totalCanceledOrdersRole1 =
      parseInt(canceledOrdersResultRole1[0]?.total_canceled_orders) || 0;

    const avgDistancePerOrderRole1 =
      totalOrdersRole1 > 0 ? totalDistanceRole1 / totalOrdersRole1 : 0;
    const avgSalePerOrderRole1 =
      totalOrdersRole1 > 0 ? totalRevenueRole1 / totalOrdersRole1 : 0;
    const abandonedCartRateRole1 = parseFloat(
      totalOrdersRole1 + totalCanceledOrdersRole1 > 0
        ? (
            (totalCanceledOrdersRole1 /
              (totalOrdersRole1 + totalCanceledOrdersRole1)) *
            100
          ).toFixed(2)
        : 0
    );

    // Combine the metrics for both roles into a single object
    const metrics = {
      experimentGroup: {
        totalRevenue: totalRevenueRole0,
        totalBookings: totalOrdersRole0,
        totalSales: totalRevenueRole0,
        checkedPriceButDidntOrder: totalCanceledOrdersRole0,
        avgSalePerOrder: parseFloat(avgSalePerOrderRole0.toFixed(2)),
        avgDistancePerOrder: parseFloat(avgDistancePerOrderRole0.toFixed(2)),
        abandonedCartRate: abandonedCartRateRole0,
      },
      controlGroup: {
        totalRevenue: totalRevenueRole1,
        totalBookings: totalOrdersRole1,
        totalSales: totalRevenueRole1,
        checkedPriceButDidntOrder: totalCanceledOrdersRole1,
        avgSalePerOrder: parseFloat(avgSalePerOrderRole1.toFixed(2)),
        avgDistancePerOrder: parseFloat(avgDistancePerOrderRole1.toFixed(2)),
        abandonedCartRate: abandonedCartRateRole1,
      },
      totalUsers: userCount,
      totalRevenue: totalRevenueRole0 + totalRevenueRole1,
      totalBookings: totalOrdersRole0 + totalOrdersRole1,
    };

    return metrics;
  } catch (error) {
    console.error("Error calculating metrics:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function getAssignmentGroupForUser(userId) {
  try {
    const existingUser =
      await sql`SELECT role FROM users WHERE user_id = ${userId}`;

    if (existingUser.length > 0) {
      const role = existingUser[0].role;
      console.log(`User ${userId} already assigned to group ${role}.`);
      return role;
    }

    const result = await sql`SELECT actual_percentage FROM current_assignment`;
    const controlGroupDistribution = isNaN(
      parseInt(result[0].actual_percentage)
    )
      ? 0.7
      : parseInt(result[0].actual_percentage) / 100;
    console.log("Actual Percentage:", controlGroupDistribution);

    const [controlAssignments, experimentAssignments] = await Promise.all([
      sql`SELECT COUNT(*) FROM users WHERE role = 1`,
      sql`SELECT COUNT(*) FROM users WHERE role = 0`,
    ]);

    const controlCount = parseInt(controlAssignments[0].count, 10);
    const experimentCount = parseInt(experimentAssignments[0].count, 10);
    const totalAssignments = controlCount + experimentCount;

    const controlDesired = Math.round(
      controlGroupDistribution * totalAssignments
    );

    const role = controlCount < controlDesired ? 1 : 0;
    await sql`INSERT INTO users (user_id, role) VALUES (${userId}, ${role})`;

    console.log(
      `User ${userId} is assigned to the ${
        role === 1 ? "Control" : "Experiment"
      } group.`
    );

    return role;
  } catch (error) {
    console.error("Error assigning group:", error.message);
    throw error;
  }
}

async function generateTransportationPrice({
  distance,
  pickupTimeWindow,
  numPackages,
  packageWeight,
  serviceType,
  specialHandlingNeeded,
}) {
  let basePrice = 50.0;

  const timeFactors = {
    morning: 1.0,
    afternoon: 1.1,
    evening: 1.2,
  };
  const timeFactor = timeFactors[pickupTimeWindow] || 1.0;

  const distanceFactor = 1.0 + Math.pow(distance / 200, 1.05);

  const shipmentFactor = 1.0;

  const packageFactor = 1.0 + numPackages * 0.1 + packageWeight * 0.05;

  const serviceFactors = {
    0: 1.0,
    1: 1.3,
    2: 1.7,
  };
  const serviceFactor = serviceFactors[serviceType] || 1.0;

  const handlingFactor = specialHandlingNeeded === 1 ? 1.15 : 1.0;

  let price =
    basePrice *
    timeFactor *
    distanceFactor *
    shipmentFactor *
    packageFactor *
    serviceFactor *
    handlingFactor;

  // Ensure minimum price
  const minimumPrice = 100.0;
  price = Math.max(price, minimumPrice);

  return Math.round(price * 100) / 100;
}

module.exports = {
  getPgVersion,
  getOrders,
  addcancelorders,
  addorders,
  calculateMetrics,
  updateAssignment,
  getAssignmentGroupForUser,
  generateTransportationPrice,
};
