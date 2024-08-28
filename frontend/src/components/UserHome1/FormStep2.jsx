import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";

const FormStep2 = ({ formData, handleAddressChange, handleChange }) => {
  const [originQuery, setOriginQuery] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isOriginSuggestionVisible, setOriginSuggestionVisible] =
    useState(false);

  const apiKey = import.meta.env.VITE_OLA_KEY;

  const fetchSuggestions = debounce(async (query) => {
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

      setOriginSuggestions(uniqueSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setOriginSuggestions([]);
    }
  }, 300);

  useEffect(() => {
    if (originQuery.length < 3) {
      setOriginSuggestions([]);
      setOriginSuggestionVisible(false);
      return;
    }

    fetchSuggestions(originQuery);
    setOriginSuggestionVisible(true);

    // Cleanup function to cancel debounced fetch
    return () => {
      fetchSuggestions.cancel();
    };
  }, [originQuery]);

  const handleSuggestionClick = (suggestion) => {
    const location = suggestion.geometry.location;
    const selectedPlace = {
      description: suggestion.description,
      lat: location.lat,
      lng: location.lng,
    };

    setOriginQuery(suggestion.description);
    handleAddressChange(
      { target: { name: "line1", value: suggestion.description } },
      "pickupAddress"
    );
    setOriginSuggestions([]);
    setOriginSuggestionVisible(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        Pickup Information
      </h2>
      <fieldset className="">
        <div className="mb-4">
          <label
            htmlFor="pickupAddressLine1"
            className="block text-sm font-medium mb-2 text-darkgray"
          >
            Address
          </label>
          <input
            type="text"
            id="pickupAddressLine1"
            name="line1"
            value={formData.pickupAddress.line1 || originQuery}
            onChange={(e) => {
              setOriginQuery(e.target.value);
              handleAddressChange(e, "pickupAddress");
            }}
            placeholder="Enter pickup address"
            className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
            required
          />
          <div className="relative mb-4">
            {isOriginSuggestionVisible && originSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {originSuggestions.map((suggestion) => (
                  <li
                    key={suggestion.place_id}
                    className="p-2 cursor-pointer hover:bg-indigo-100 transition duration-200"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.description}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </fieldset>

      <div className="mb-4">
        <label
          htmlFor="pickupDate"
          className="block text-sm font-medium mb-2 text-darkgray"
        >
          Pickup Date
        </label>
        <input
          type="date"
          id="pickupDate"
          name="pickupDate"
          value={formData.pickupDate || ""}
          onChange={handleChange}
          className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="pickupTimeWindow"
          className="block text-sm font-medium mb-2 text-darkgray"
        >
          Pickup Time Window
        </label>
        <select
          id="pickupTimeWindow"
          name="pickupTimeWindow"
          value={formData.pickupTimeWindow || ""}
          onChange={handleChange}
          className="w-full p-3 border border-lightgray rounded-lg focus:outline-none focus:border-blue-600"
          required
        >
          <option value="" disabled>
            Select a time window
          </option>
          <option value="9 AM - 12 PM">9 AM - 12 PM</option>
          <option value="12 PM - 3 PM">12 PM - 3 PM</option>
          <option value="3 PM - 6 PM">3 PM - 6 PM</option>
          <option value="6 PM - 9 PM">6 PM - 9 PM</option>
          <option value="Anytime">Anytime</option>
        </select>
      </div>
    </div>
  );
};

export default FormStep2;
