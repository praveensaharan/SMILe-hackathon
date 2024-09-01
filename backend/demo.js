const sql = require("./db");
const { clerkClient } = require("./clerk");

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

async function main() {
  try {
    const metrics = await calculateMetrics();
    console.log(metrics);
  } catch (error) {
    console.error("Error in main function:", error.message);
  }
}

main();

async function calculateMetrics() {
  try {
    const ordersResult = await sql`
      SELECT 
        SUM(order_price) AS total_revenue, 
        SUM(distance) AS total_distance, 
        COUNT(*) AS total_orders 
      FROM orders;
    `;

    const canceledOrdersResult = await sql`
      SELECT COUNT(*) AS total_canceled_orders 
      FROM canceled_orders;
    `;

    const userCount = await clerkClient.users.getCount();

    const totalRevenue = parseFloat(ordersResult[0]?.total_revenue) || 0;
    const totalDistance = parseFloat(ordersResult[0]?.total_distance) || 0;
    const totalOrders = parseInt(ordersResult[0]?.total_orders) || 0;
    const totalCanceledOrders =
      parseInt(canceledOrdersResult[0]?.total_canceled_orders) || 0;

    const avgDistancePerOrder =
      totalOrders > 0 ? totalDistance / totalOrders : 0;
    const avgSalePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const abandonedCartRate = parseFloat(
      totalOrders + totalCanceledOrders > 0
        ? (
            (totalCanceledOrders / (totalOrders + totalCanceledOrders)) *
            100
          ).toFixed(2)
        : 0
    );

    const metrics = {
      totalRevenue,
      totalBookings: totalOrders,
      totalSales: totalRevenue,
      checkedPriceButDidntOrder: totalCanceledOrders,
      avgSalePerOrder: parseFloat(avgSalePerOrder.toFixed(2)),
      avgDistancePerOrder: parseFloat(avgDistancePerOrder.toFixed(2)),
      abandonedCartRate,
      totalUsers: userCount,
    };

    return metrics;
  } catch (error) {
    console.error("Error calculating metrics:", error.message);
    throw new Error("Internal Server Error");
  }
}

// // Example usage
// calculateMetrics()
//   .then((metrics) => {
//     console.log("Metrics:", metrics);
//   })
//   .catch((error) => {
//     console.error("Error:", error.message);
//   });

// async function getAssignmentGroupForUser(userId) {
//   try {
//     const existingUser =
//       await sql`SELECT role FROM users WHERE user_id = ${userId}`;

//     if (existingUser.length > 0) {
//       const role = existingUser[0].role;
//       console.log(`User ${userId} already assigned to group ${role}.`);
//       return role;
//     }

//     const result = await sql`SELECT actual_percentage FROM current_assignment`;
//     const controlGroupDistribution = isNaN(
//       parseInt(result[0].actual_percentage)
//     )
//       ? 0.7
//       : parseInt(result[0].actual_percentage) / 100;
//     console.log("Actual Percentage:", controlGroupDistribution);

//     const [controlAssignments, experimentAssignments] = await Promise.all([
//       sql`SELECT COUNT(*) FROM users WHERE role = 1`,
//       sql`SELECT COUNT(*) FROM users WHERE role = 0`,
//     ]);

//     const controlCount = parseInt(controlAssignments[0].count, 10);
//     const experimentCount = parseInt(experimentAssignments[0].count, 10);
//     const totalAssignments = controlCount + experimentCount;

//     const controlDesired = Math.round(
//       controlGroupDistribution * totalAssignments
//     );

//     const role = controlCount < controlDesired ? 1 : 0;
//     await sql`INSERT INTO users (user_id, role) VALUES (${userId}, ${role})`;

//     console.log(
//       `User ${userId} is assigned to the ${
//         role === 1 ? "Control" : "Experiment"
//       } group.`
//     );

//     return role;
//   } catch (error) {
//     console.error("Error assigning group:", error.message);
//     throw error;
//   }
// }

// const userIds = [
//   "user_2lSPawkewaKrz4Kn98adTHMER8i",
//   "user_2lRA2FoHRzr9HQYwh2vMKpCbSBs",
//   "user_2lQKQw21JHGssqAEqLXfOC9NI1l",
//   "user_2lPao7vrtadVyWVcqczcCWO9AAc",
//   "user_2lFVw1W8HqM0DiAfEfsxIFi7IWs",
//   "user_2l3f9NmOEVO1Kz2zcuyNl24OVBc",
//   "user_2l3d3PKBu8va92j5Q36hRIGiFt4",
//   "user_2l2SHDzZ8gxCt6F62r8OimVnAy2",
//   "user_2l12QldalSAL7o1DRWZB6YRyoyq",
//   "user_2l0loIjg1AsRBVAO7BkjjTKkWXP",
// ];

// async function main() {
//   try {
//     for (let i = 0; i < userIds.length; i++) {
//       const userId = userIds[i];
//       const p = await getAssignmentGroupForUser(userId);
//       console.log(p);
//     }
//   } catch (error) {
//     console.error("Error in main function:", error.message);
//   }
// }

// main();
