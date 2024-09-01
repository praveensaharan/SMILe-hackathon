// routes.js
const express = require("express");
const {
  getPgVersion,
  getOrders,
  addcancelorders,
  addorders,
  calculateMetrics,
  updateAssignment,
  getAssignmentGroupForUser,
} = require("./utils");

const router = express.Router();
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const { clerkClient } = require("./clerk");
const crypto = require("crypto");

router.get("/", async (req, res) => {
  try {
    const version = await getPgVersion();
    res.json(version);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/getorders", ClerkExpressRequireAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ error: "Unauthenticated!" });
  }

  try {
    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(req.auth.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const orders = await getOrders(user.id);
    console.log("orders", orders);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/saveorders", ClerkExpressRequireAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ error: "Unauthenticated!" });
  }

  try {
    // Fetch user details from Clerk
    const user = await clerkClient.users.getUser(req.auth.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = req.auth.userId;
    const randomValue = crypto.randomBytes(4).toString("hex");
    const orderId = `${new Date().toISOString().slice(-7)}${randomValue}`;
    const role = await getAssignmentGroupForUser(userId);

    const orderData = {
      userId: userId,
      ...req.body,
      id: orderId,
      role: role,
    };

    const insertedOrder = await addorders(orderData);
    res.status(201).json({
      message: "Order saved successfully!",
      order: insertedOrder,
    });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

router.post("/cancelorders", ClerkExpressRequireAuth({}), async (req, res) => {
  if (!req.auth || !req.auth.userId) {
    return res.status(401).json({ error: "Unauthenticated!" });
  }

  try {
    const user = await clerkClient.users.getUser(req.auth.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = req.auth.userId;
    const role = await getAssignmentGroupForUser(userId);
    const orderData = {
      userId: userId,
      role: role,
      ...req.body,
    };

    const result = await addcancelorders(orderData);
    res.status(201).json({
      message: "Canceled order saved successfully!",
      order: result,
    });
  } catch (err) {
    console.error("Error handling canceled order:", err);
    res.status(500).json({ error: "Internal Server Error: " + err.message });
  }
});

router.get(
  "/calculatedmetrics",
  ClerkExpressRequireAuth({}),
  async (req, res) => {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({ error: "Unauthenticated!" });
    }

    try {
      const user = await clerkClient.users.getUser(req.auth.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { unsafeMetadata } = user;
      if (!unsafeMetadata || !unsafeMetadata.actualPercentage) {
        return res
          .status(400)
          .json({ error: "Actual percentage not found in user metadata." });
      }

      const actualPercentage = parseInt(unsafeMetadata.actualPercentage, 10);
      if (
        isNaN(actualPercentage) ||
        actualPercentage < 0 ||
        actualPercentage > 100
      ) {
        return res
          .status(400)
          .json({ error: "Percentage must be between 0 and 100." });
      }

      const experimentalPercentage = 100 - actualPercentage;

      // Update the assignment percentages in the database
      await updateAssignment(actualPercentage, experimentalPercentage);

      // Calculate the metrics
      const result = await calculateMetrics();

      // Respond with the calculated metrics
      res.status(200).json({
        metrics: result,
      });
    } catch (err) {
      console.error("Error calculating metrics: ", err);
      res.status(500).json({ error: "Internal Server Error: " + err.message });
    }
  }
);

module.exports = router;
