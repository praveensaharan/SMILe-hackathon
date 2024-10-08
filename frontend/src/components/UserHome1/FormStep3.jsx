import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce"; // Ensure lodash is installed for debounce

const FormStep3 = ({
  formData,
  handleChange,
  handleChange1,
  handlePackageDetailsChange,
}) => {
  const [deliveryQuery, setDeliveryQuery] = useState("");
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [isDeliverySuggestionVisible, setDeliverySuggestionVisible] =
    useState(false);

  const apiKey = import.meta.env.VITE_OLA_KEY;

  const fetchSuggestions = debounce(async (query, type) => {
    try {
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete`,
        {
          params: {
            input: query,
            api_key: apiKey,
          },
        }
      );

      const uniqueSuggestions = Array.from(
        new Map(
          response.data.predictions.map((item) => [item.place_id, item])
        ).values()
      );

      if (type === "delivery") {
        setDeliverySuggestions(uniqueSuggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      if (type === "delivery") {
        setDeliverySuggestions([]);
      }
    }
  }, 300);

  useEffect(() => {
    if (deliveryQuery.length < 3) {
      setDeliverySuggestions([]);
      setDeliverySuggestionVisible(false);
      return;
    }

    fetchSuggestions(deliveryQuery, "delivery");
    setDeliverySuggestionVisible(true);

    return () => {
      fetchSuggestions.cancel();
    };
  }, [deliveryQuery]);

  const handleSuggestionClick = (suggestion, type) => {
    if (type === "delivery") {
      const location = suggestion.geometry?.location || {};
      setDeliveryQuery(suggestion.description);

      // Update formData
      handleChange1({
        target: {
          name: "deliveryAddress",
          value: `${suggestion.description}++--${location.lat}++--${location.lng}`,
        },
      });

      setDeliverySuggestions([]);
      setDeliverySuggestionVisible(false);
    }
  };

  return (
    <div>
      {/* Delivery Address Section */}
      <fieldset className="mb-6">
        <legend className="text-lg font-semibold mb-4 text-blue-600">
          Delivery Address
        </legend>
        <div className="mb-4">
          <label
            htmlFor="deliveryAddressLine1"
            className="block text-sm font-medium mb-2 text-darkgray"
          >
            Address
          </label>
          <input
            type="text"
            id="deliveryAddressLine1"
            name="line1"
            value={formData.deliveryAddress || deliveryQuery}
            onChange={(e) => {
              setDeliveryQuery(e.target.value);
            }}
            placeholder="Enter delivery address"
            className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
            required
          />
          <div className="relative mb-4">
            {isDeliverySuggestionVisible && deliverySuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {deliverySuggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 cursor-pointer hover:bg-indigo-100 transition duration-200"
                    onClick={() =>
                      handleSuggestionClick(suggestion, "delivery")
                    }
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </fieldset>

      {/* Package Details Section */}
      <fieldset className="mb-6">
        <legend className="text-lg font-semibold mb-4 text-blue-600">
          Package Details
        </legend>
        <div className="mb-4">
          <label
            htmlFor="numberOfPackages"
            className="block text-sm font-medium mb-2 text-darkgray"
          >
            Number of Packages
          </label>
          <input
            type="number"
            id="numberOfPackages"
            name="numberOfPackages"
            default="1"
            value={formData.packageDetails.numberOfPackages || ""}
            onChange={(e) => handlePackageDetailsChange(e, "numberOfPackages")}
            className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="packageWeight"
            className="block text-sm font-medium mb-2 text-darkgray"
          >
            Package Weight (kg)
          </label>
          <input
            type="number"
            id="packageWeight"
            name="packageWeight"
            value={formData.packageDetails.packageWeight || ""}
            onChange={(e) => handlePackageDetailsChange(e, "packageWeight")}
            className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
            placeholder="Enter package weight"
            required
          />
        </div>
      </fieldset>
    </div>
  );
};

export default FormStep3;
