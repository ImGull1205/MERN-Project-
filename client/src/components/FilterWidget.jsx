import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FilterWidget({ onFilter }) {
  const navigate = useNavigate();
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleApplyFilters = () => {
    const province = document.getElementById("province").value;
    const district = document.getElementById("district").value;
    const street = document.getElementById("street").value;
    const features = [];
    const featureCheckboxes = document.querySelectorAll("input[name='feature']:checked");
    featureCheckboxes.forEach((checkbox) => features.push(checkbox.value));

    const selectedTicketTypes = ticketTypes;
    let min = minPrice ? parseFloat(minPrice) : null;
    let max = maxPrice ? parseFloat(maxPrice) : null;

    // Validation logic for price
    if ((min && max && max <= min) || (min && isNaN(min)) || (max && isNaN(max))) {
      setErrorMessage("Please ensure that prices are positive numbers and Max Price is greater than Min Price.");
      return;
    } else {
      setErrorMessage(""); 
    }

    const queryParams = new URLSearchParams({
      province,
      district,
      street,
      features: features.join(","),
      ticketTypes: selectedTicketTypes.join(","),
      minPrice: minPrice || "", 
      maxPrice: maxPrice || "", 
    }).toString();
    navigate(`?${queryParams}`);
  };

  const handleTicketChange = (event) => {
    const { value, checked } = event.target;
    setTicketTypes((prev) =>
      checked ? [...prev, value] : prev.filter((type) => type !== value)
    );
  };

  const handlePriceChange = (event) => {
    const { id, value } = event.target;
    if (value === "" || /^[0-9]*\.?[0-9]+$/.test(value)) {
      if (id === "minPrice") {
        setMinPrice(value);
      } else if (id === "maxPrice") {
        setMaxPrice(value);
      }
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-2xl space-y-4">
      <h2 className="text-2xl font-bold text-center">Filter Places</h2>
      <div className="border rounded-2xl p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Province:</label>
          <input
            id="province"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter Province"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">District:</label>
          <input
            id="district"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Enter District"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Street:</label>
          <input
            id="street"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Street Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Features:</label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="feature" value="WiFi" className="h-4 w-4" />
              <span>WiFi</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="feature" value="Free parking spot" className="h-4 w-4" />
              <span>Free parking spot</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="feature" value="TV" className="h-4 w-4" />
              <span>TV</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="feature" value="Radio" className="h-4 w-4" />
              <span>Radio</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="feature" value="Pets" className="h-4 w-4" />
              <span>Pets</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" name="feature" value="Private entrance" className="h-4 w-4" />
              <span>Private entrance</span>
            </label>
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Min Price:</label>
            <input
              id="minPrice"
              type="text"
              value={minPrice}
              onChange={handlePriceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Min Price"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Max Price:</label>
            <input
              id="maxPrice"
              type="text"
              value={maxPrice}
              onChange={handlePriceChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Max Price"
            />
          </div>
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button
          onClick={handleApplyFilters}
          className="w-full py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
