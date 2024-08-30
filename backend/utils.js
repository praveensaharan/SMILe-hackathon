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

// async function getMentors(userid) {
//   try {
//     const result = await sql`
//       SELECT
//       *
//       FROM
//         orders where userid = '${userid}';
//     `;

//     return result;
//   } catch (error) {
//     console.error("Error fetching mentors and availability:", error.message);
//     throw new Error("Internal Server Error");
//   }
// }
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

async function getMentor(id) {
  try {
    const result = await sql`
      SELECT 
        m.id AS mentor_id,
        m.name,
        m.roles,
        m.rating,
        a.date,
        a.start_time,
        a.end_time
      FROM 
        mentors m
      LEFT JOIN 
        availability a
      ON 
        m.id = a.mentor_id
      WHERE
        m.id = ${id}
      ORDER BY 
        a.date, a.start_time;
    `;
    if (!result || result.length === 0) {
      return null;
    }

    const rolesArray = result[0].roles.split(",").map((role) => role.trim());

    const mentorData = {
      id: result[0].mentor_id,
      name: result[0].name,
      roles: rolesArray,
      availability: [],
    };

    result.forEach((row) => {
      if (row.date && row.start_time && row.end_time) {
        mentorData.availability.push({
          date: row.date.toISOString().split("T")[0],
          startTime: row.start_time.slice(0, 5),
          endTime: row.end_time.slice(0, 5),
        });
      }
    });

    return mentorData;
  } catch (error) {
    console.error("Error fetching mentor and availability:", error.message);
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
        order_price
      ) VALUES (
        ${orderData.userId},
        ${orderData.full_name_order},
        ${orderData.email},
        ${orderData.distance},
        ${orderData.number_of_packages},
        ${orderData.package_weight},
        ${orderData.order_price}
    
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
        unique_order_id
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
        ${orderData.id}
      )
      RETURNING *; 
    `;

    return result; // Return the inserted data or result
  } catch (error) {
    console.error("Error inserting order: ", error.message);
    throw new Error("Internal Server Error");
  }
}

// Function to send emails with session details

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

async function emailssend(mentor_email, user_email, date, time, duration) {
  try {
    const formattedTime = formatTimeTo12Hour(time); // Format the time to 12-hour format

    await sendSessionEmails(
      mentor_email, // mentor's email
      user_email, // user's email
      date, // session date
      formattedTime, // formatted session time
      duration // session duration
    );

    return true; // Return true if emails are sent successfully
  } catch (error) {
    console.error("Error sending emails:", error.message);
    throw new Error("Internal Server Error");
  }
}

async function getpaymentDone(id) {
  try {
    const paymentResult = await sql`
      SELECT * FROM payment WHERE id = ${id};
    `;
    if (paymentResult.length === 0) {
      return { error: "Payment not found" };
    }

    if (paymentResult[0].paid === true) {
      return { message: "Payment already made" };
    }

    const {
      student_id: studentId,
      mentor_id: mentorId,
      role,
      duration,
      date,
      time,
    } = paymentResult[0];

    let startDateTime = new Date(
      `${new Date(date).toISOString().split("T")[0]}T${time}Z`
    );

    startDateTime.setMinutes(startDateTime.getMinutes() + 330);

    const formattedDateTime = startDateTime
      .toISOString()
      .replace("T", " ")
      .split(".")[0];

    await sql`
      INSERT INTO sessions (
        student_id,
        mentor_id,
        date_time,
        duration,
        role,
        order_id
      ) VALUES (
        ${studentId},
        ${mentorId},
        ${formattedDateTime}::TIMESTAMP,
        ${duration},
        ${role},
        ${id}
      );
    `;

    const newEndTime = calculateNewEndTime(time, duration);

    await sql`
      UPDATE availability
      SET start_time = ${newEndTime}
      WHERE mentor_id = ${mentorId}
      AND date = ${date};
    `;

    await sql`
      UPDATE payment SET paid = true WHERE id = ${id};
    `;
    await emailssend(
      paymentResult[0].mentor_email,
      paymentResult[0].user_email,
      paymentResult[0].date,
      paymentResult[0].time,
      paymentResult[0].duration
    );

    return { message: "Payment processed and session scheduled" };
  } catch (error) {
    console.error("Error processing payment:", error.message);
    throw new Error("Internal Server Error");
  }
}

module.exports = {
  getPgVersion,
  getOrders,
  getMentor,
  addcancelorders,
  addorders,
  getpaymentDone,
  calculateMetrics,
};
