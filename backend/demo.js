const sql = require("./db");
const { clerkClient } = require("./clerk");

function generateTransportationPrice({
  distance,
  pickupTimeWindow,
  numPackages,
  packageWeight,
  serviceType,
  specialHandlingNeeded,
}) {
  let basePrice = 100.0;

  const timeFactors = {
    morning: 1.0,
    afternoon: 1.1,
    evening: 1.2,
  };
  const timeFactor = timeFactors[pickupTimeWindow] || 1.0;

  const distanceFactor = 1.0 + Math.pow(distance / 100, 1.05);

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

// Example usage
async function main() {
  const formData = {
    pickupTimeWindow: "afternoon", // "morning", "afternoon", or "evening"
    distance: 10, // in kilometers
    packageDetails: {
      numberOfPackages: 1,
      packageWeight: 15, // in kilograms
    },
    serviceType: 1, // 0 = Standard, 1 = Expedited, 2 = Overnight
    specialHandlingNeeded: 0, // 0 = No, 1 = Yes
  };

  // Mapping formData to the required function parameters
  const customOrderData = {
    distance: formData.distance,
    pickupTimeWindow: formData.pickupTimeWindow,
    numPackages: formData.packageDetails.numberOfPackages,
    packageWeight: formData.packageDetails.packageWeight,
    serviceType: formData.serviceType,
    specialHandlingNeeded: formData.specialHandlingNeeded,
  };

  const price = generateTransportationPrice(customOrderData);

  console.log(
    "Generated Transportation Price:",
    price,
    "distance:",
    customOrderData.distance,
    "km"
  );
}

// Execute the main function
main();
