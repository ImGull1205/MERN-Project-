import { useContext, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import { DeleteOutlined } from "@ant-design/icons";
export default function BookingWidget({ place }) {
  const [activationDate, setActivationDate] = useState("");
  const [redirect, setRedirect] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [notification, setNotification] = useState(null); // Add state for notification
  const { user } = useContext(UserContext);

  const handleAddTicket = () => {
    setSelectedTickets([...selectedTickets, { type: "", quantity: "" }]);
  };

  const handleTicketTypeChange = (index, type) => {
    const ticket = place.tickets.find((ticket) => ticket.type === type);
    const updatedTickets = [...selectedTickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      type,
      price: ticket.price,
    };
    setSelectedTickets(updatedTickets);
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedTickets = [...selectedTickets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      quantity: quantity || "",
    };
    setSelectedTickets(updatedTickets);
  };

  const handleRemoveTicket = (index) => {
    const updatedTickets = selectedTickets.filter((_, i) => i !== index);
    setSelectedTickets(updatedTickets);
  };

  async function bookThisPlace() {
    if (!user) {
      setRedirect("/login"); // Redirect to login if the user is not logged in
      return;
    }

    try {
      const ticketDetails = selectedTickets.map((ticket) => ({
        type: ticket.type,
        quantity: ticket.quantity,
      }));

      const response = await axios.post("/api/bookings", {
        placeId: place._id,
        activationDate,
        selectedTickets: ticketDetails,
        userId: user._id, // Send the user ID along with the request
      });

      const bookingId = response.data._id;

      // Show success notification
      setNotification({
        type: "success",
        message: "Booking successful! Your booking ID is: " + bookingId,
      });
    } catch (error) {
      console.error(
        "Error booking the place:",
        error.response?.data || error.message
      );
      setNotification({
        type: "error",
        message: "There was an error with your booking. Please try again.",
      });
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow p-6 rounded-2xl space-y-4">
      <h2 className="text-2xl font-bold text-center">Book Your Tickets</h2>
      {notification && (
        <div
          className={`p-4 rounded-lg ${
            notification.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {notification.message}
        </div>
      )}
      <div className="border rounded-2xl p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Activation Date:
          </label>
          <input
            type="date"
            value={activationDate}
            onChange={(ev) => setActivationDate(ev.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        {selectedTickets.map((ticket, index) => (
          <div key={index} className="grid grid-cols-[1fr,auto,auto] items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ticket Type:</label>
            <select
              value={ticket.type || ''}
              onChange={(ev) => handleTicketTypeChange(index, ev.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select ticket</option>
              {place.tickets.map((ticketOption, idx) => (
                <option key={idx} value={ticketOption.type}>
                  {ticketOption.type} - ${ticketOption.price}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700">Quantity:</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={ticket.quantity || ''}
              onChange={(ev) => handleQuantityChange(index, ev.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="self-end mb-3">
            <DeleteOutlined
              onClick={() => handleRemoveTicket(index)}
              className="text-red-500 hover:text-red-700 text-xl cursor-pointer"
            />
          </div>
        </div>
        ))}
        <button
          onClick={handleAddTicket}
          className="text-blue-500 hover:text-blue-700"
        >
          + Add Another Ticket
        </button>
      </div>
      <button
        onClick={bookThisPlace}
        className="w-full py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 disabled:bg-gray-300"
        disabled={!selectedTickets.length || !activationDate}
      >
        Book Now
        {selectedTickets.length > 0 && (
          <span>
            {" "}
            ($
            {selectedTickets.reduce(
              (sum, ticket) => sum + (ticket.price || 0) * ticket.quantity,
              0
            )}
            )
          </span>
        )}
      </button>
    </div>
  );
}
