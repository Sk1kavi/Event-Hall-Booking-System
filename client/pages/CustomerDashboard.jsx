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
  const [bookings, setBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isFavouritesOpen, setIsFavouritesOpen] = useState(false);
const [favouriteHallIds, setFavouriteHallIds] = useState([]);


  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const handleViewBookings = async () => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/bookings/byCustomer/${customer._id}`);
      const data = await res.json();
      setBookings(data.bookingsWithHallDetails || []);
      console.log(bookings);
      setIsBookingsOpen(true);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  useEffect(() => {
  const fetchFavourites = async () => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/favourites/byCustomer/${customerId}`);
      const data = await res.json();
      if (data.success) {
        const ids = data.favouritesWithHallDetails.map(f => f.hallId);
        setFavouriteHallIds(ids);
      }
    } catch (err) {
      console.error("Error fetching favourites:", err);
    }
  };

  fetchFavourites();
}, [customerId]);
  const handleViewFavourites = async () => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/favourites/byCustomer/${customer._id}`);
      const data = await res.json();
      console.log(data);
      setFavourites(data.favouritesWithHallDetails || []);
      setIsFavouritesOpen(true);
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
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
  // Toggle Favourite Handler
const handleToggleFavourite = async (hallId) => {
  try {
    const res = await fetch(`https://event-hall-booking-system.onrender.com/favourites/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: customer._id,
        hallId: hallId
      }),
    });

    const data = await res.json();

    if (data.success) {
      setFavourites((prev) => {
        // If hall is already in favourites → remove it, else add it
        if (prev.some((fav) => fav.hallId === hallId)) {
          return prev.filter((fav) => fav.hallId !== hallId);
        } else {
          return [...prev, { hallId, hallName: halls.find(h => h._id === hallId)?.name }];
        }
      });
      setFavouriteHallIds((prev) =>
        prev.includes(hallId)
          ? prev.filter((id) => id !== hallId)
          : [...prev, hallId]
      );
    } else {
      alert(data.message || "Failed to update favourites");
    }
  } catch (error) {
    console.error("Error toggling favourite:", error);
  }
};

// Check if hall is favourite
const isFavourite = (hallId) => {
  return favouriteHallIds.includes(hallId);
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

    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Profile Icon */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {customer.name?.charAt(0)}
          </div>
        </div>

        {/* Customer Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">
            {customer.name}
          </h2>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">Email:</span> {customer.email}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">Phone:</span> {customer.number}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleViewBookings}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
            >
              View Bookings
            </button>
            <button
              onClick={handleViewFavourites}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 shadow"
            >
              View Favourites
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Modal */}
      {isBookingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[28rem] max-h-[80vh] overflow-y-auto shadow-lg">
            <h3 className="text-xl font-bold mb-4">Your Bookings</h3>
            {bookings.length > 0 ? (
              <ul className="space-y-3">
                {bookings.map((b, idx) => (
                  <li key={idx} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                    <span className="font-semibold">Hall:</span> {b.hall?.name} <br />
                    <span className="font-semibold">Address:</span> {b.hall?.address} <br />
                    <span className="font-semibold">Price:</span> ₹{b.hall?.price} <br />
                    <span className="font-semibold">Date:</span> {b.date} <br />
                    <span className="font-semibold">Occasion:</span> {b.occasion}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No bookings found.</p>
            )}
            <button
              onClick={() => setIsBookingsOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Favourites Modal */}
      {isFavouritesOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Your Favourites</h3>
            {favourites.length > 0 ? (
              <ul className="space-y-2">
                {favourites.map((f, idx) => (
                  <li key={idx} className="p-3 bg-gray-100 rounded-lg shadow-sm">
                    <div>
                      <span className="font-semibold">Hall:</span> {f.hall?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="font-semibold">Address:</span> {f.hall?.address || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Price:</span> ₹{f.hall?.price || "N/A"}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No favourites found.</p>
            )}
            <button
              onClick={() => setIsFavouritesOpen(false)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Halls Section */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <h3 className="text-3xl font-bold mb-8 text-center text-purple-700">
          Available Event Halls
        </h3>
        {halls.length === 0 ? (
          <p className="text-center text-gray-500">No halls available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {halls.map((hall, index) => (
              <div
                key={index}
                className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col"
              >
                {/* Hall Icon Banner */}
                <div className="h-40 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center text-5xl text-blue-400 font-extrabold">
                  <span role="img" aria-label="hall">🏛️</span>
                </div>

                {/* Hall Details */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Name + Favourite Button */}
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-semibold text-blue-700">{hall.name}</h4>
                    <button
                      onClick={() => handleToggleFavourite(hall._id)}
                      className="text-2xl focus:outline-none"
                    >
                      {isFavourite(hall._id) ? (
                        <span className="text-red-500">❤️</span>
                      ) : (
                        <span className="text-gray-400 hover:text-red-400">🤍</span>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Capacity:</strong> {hall.capacity}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Price:</strong>{" "}
                    <span className="text-green-600 font-bold">₹{hall.price}/day</span>
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Address:</strong> {hall.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Amenities:</strong> {(hall.amenities || []).join(", ")}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>Operating Days:</strong> {(hall.daysOpen || []).join(", ")}
                  </p>

                  {/* Book Button */}
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
              <label className="block mb-2 font-medium text-gray-700">Select Date</label>
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

              <label className="block mb-2 font-medium text-gray-700">Occasion</label>
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
  </div>
);
};

export default CustomerDashboard;