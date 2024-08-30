const sql = require("./db");

const { clerkClient } = require("./clerk");

async function getTotalUsers() {
  try {
    // Fetch the total number of unique users using Clerk's client
    const userCount = await clerkClient.users.getCount();
    console.log("Total Unique Users:", userCount);
    return userCount;
  } catch (error) {
    console.error("Error fetching user count:", error.message);
    throw new Error("Internal Server Error");
  }
}

// Define the main function and call it
// async function main() {
//   try {
//     const totalUsers = await getTotalUsers();
//     console.log("Total Unique Users:", totalUsers);
//   } catch (error) {
//     console.error("Error in main function:", error.message);
//   }

// }

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

// Example usage
calculateMetrics()
  .then((metrics) => {
    console.log("Metrics:", metrics);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

// Example usage (you can wrap this in a function or use it in an endpoint)
async function main() {
  try {
    const totalData = await calculateMetrics();
    console.log("Combined Data:", totalData);
  } catch (error) {
    console.error("Error in main function:", error.message);
  }
}

main();
