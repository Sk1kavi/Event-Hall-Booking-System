import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomerDashboard = () => {
  const customerId = localStorage.getItem("customerId");
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [occasion, setOccasion] = useState("");
  const [customer, setCustomer] = useState(null);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://event-hall-booking-system.onrender.com/halls/list");
      const data = await response.json();
      if (data.success) {
        setHalls(data.halls);
      } else {
        alert("Failed to fetch halls.");
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
      alert("An error occurred while fetching halls.");
    }
    setLoading(false);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      hallId: selectedHall._id,
      date: selectedDate,
      occasion,
      customerId: customerId,
    };

    const res = await fetch("https://event-hall-booking-system.onrender.com/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (data.success) {
      alert("Booking successful!");
      setSelectedDate("");
      setOccasion("");
      setShowBookingForm(false);
    } else {
      alert("Booking failed: " + data.message);
    }
  };

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(
          `https://event-hall-booking-system.onrender.com/customer/${customerId}`
        );
        const data = await res.json();
        if (data.success) {
          setCustomer(data.customer);
        } else {
          alert("Failed to load profile");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      setFetching(false);
    };

    fetchCustomer();
  }, [customerId]);

  if (fetching)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <p className="text-lg font-semibold text-blue-700 animate-pulse">
          Loading your profile...
        </p>
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <p className="text-lg font-semibold text-blue-700 animate-pulse">
          Loading halls...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
          Customer Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full shadow hover:scale-105 transition"
        >
          Logout
        </button>
      </div>

      {/* Profile Section */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {customer.name?.charAt(0)}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              {customer.name}
            </h2>
            <p className="text-gray-700 mb-1">
              <span className="font-semibold">Email:</span> {customer.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Phone:</span> {customer.number}
            </p>
          </div>
        </div>
      </div>

      {/* Halls Section */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <h3 className="text-3xl font-bold mb-8 text-center text-purple-700">
          Available Event Halls
        </h3>
        {halls.length === 0 ? (
          <p className="text-center text-gray-500">
            No halls available at the moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {halls.map((hall, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
              >
                <div className="h-40 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-5xl text-blue-400 font-extrabold">
                  <span role="img" aria-label="hall">
                    🏛️
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h4 className="text-xl font-semibold mb-2 text-blue-700">
                    {hall.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Capacity:</strong> {hall.capacity}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Price:</strong> <span className="text-green-600 font-bold">₹{hall.price}/day</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Address:</strong> {hall.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Amenities:</strong>{" "}
                    {(hall.amenities || []).join(", ")}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Operating Days:</strong>{" "}
                    {(hall.daysOpen || []).join(", ")}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedHall(hall);
                      setShowBookingForm(true);
                    }}
                    className="mt-auto w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-xl shadow-md font-semibold transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedHall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => setShowBookingForm(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-blue-700">
              Book {selectedHall.name}
            </h2>
            <form onSubmit={handleBookingSubmit}>
              <label className="block mb-2 font-medium text-gray-700">
                Select Date
              </label>
              <DatePicker
                selected={selectedDate ? new Date(selectedDate) : null}
                onChange={(date) => {
                  const isoDate = date.toISOString().split("T")[0];
                  setSelectedDate(isoDate);
                }}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="w-full mb-4 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                required
              />

              <label className="block mb-2 font-medium text-gray-700">
                Occasion
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full mb-6 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400"
                required
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-2 px-4 rounded-xl font-semibold shadow transition"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;