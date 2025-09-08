import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Menu } from "lucide-react";

// Animations
const fadeIn = "animate-[fadeIn_0.5s_ease-in-out]";
const scaleIn = "animate-[scaleIn_0.4s_ease-in-out]";

const style = document.createElement("style");
style.innerHTML = `
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;
if (!document.head.querySelector("#custom-animations")) {
  style.id = "custom-animations";
  document.head.appendChild(style);
}

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
  const [favouriteHallIds, setFavouriteHallIds] = useState([]);

  // menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("halls"); // halls | profile | bookings | favourites

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleViewBookings = async () => {
    try {
      const res = await fetch(
        `https://event-hall-booking-system.onrender.com/bookings/byCustomer/${customer._id}`
      );
      const data = await res.json();
      setBookings(data.bookingsWithHallDetails || []);
      setActiveSection("bookings");
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleViewFavourites = async () => {
    try {
      const res = await fetch(
        `https://event-hall-booking-system.onrender.com/favourites/byCustomer/${customer._id}`
      );
      const data = await res.json();
      setFavourites(data.favouritesWithHallDetails || []);
      setActiveSection("favourites");
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://event-hall-booking-system.onrender.com/halls/list"
      );
      const data = await response.json();
      if (data.success) {
        setHalls(data.halls);
      }
    } catch (error) {
      console.error("Error fetching halls:", error);
    }
    setLoading(false);
  };

  const handleToggleFavourite = async (hallId) => {
    try {
      const res = await fetch(
        `https://event-hall-booking-system.onrender.com/favourites/toggle`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: customer._id,
            hallId: hallId,
          }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setFavourites((prev) =>
          prev.some((fav) => fav.hallId === hallId)
            ? prev.filter((fav) => fav.hallId !== hallId)
            : [...prev, { hallId, hallName: halls.find((h) => h._id === hallId)?.name }]
        );
        setFavouriteHallIds((prev) =>
          prev.includes(hallId)
            ? prev.filter((id) => id !== hallId)
            : [...prev, hallId]
        );
      }
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const isFavourite = (hallId) => favouriteHallIds.includes(hallId);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      hallId: selectedHall._id,
      date: selectedDate,
      occasion,
      customerId: customerId,
    };
    const res = await fetch(
      "https://event-hall-booking-system.onrender.com/bookings",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      }
    );
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
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      setFetching(false);
    };
    fetchCustomer();
  }, [customerId]);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(
          `https://event-hall-booking-system.onrender.com/favourites/byCustomer/${customerId}`
        );
        const data = await res.json();
        if (data.success) {
          const ids = data.favouritesWithHallDetails.map((f) => f.hallId);
          setFavouriteHallIds(ids);
        }
      } catch (err) {
        console.error("Error fetching favourites:", err);
      }
    };
    fetchFavourites();
  }, [customerId]);

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-white shadow-md">
        <h1 className="text-xl font-bold text-blue-700">Booking System</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={26} className="text-blue-700" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-6 mt-2 bg-white rounded-xl shadow-lg py-2 w-48 z-50 border border-gray-200">
          <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              onClick={() => {
                setActiveSection("halls");
                setMenuOpen(false);
              }}
            >
              Browse Halls
            </button>

          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => {
              setActiveSection("profile");
              setMenuOpen(false);
            }}
          >
            Profile
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => {
              handleViewBookings();
              setMenuOpen(false);
            }}
          >
            My Bookings
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
            onClick={() => {
              handleViewFavourites();
              setMenuOpen(false);
            }}
          >
            My Favourites
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto mt-10 px-6">
        {/* Loading */}
        {fetching || loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg font-semibold text-blue-700 animate-pulse">
              Loading...
            </p>
          </div>
        ) : (
          <>
            {activeSection === "profile" && (
              <div
                className={`bg-white rounded-2xl shadow-lg p-8 flex items-center gap-8 ${fadeIn}`}
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-blue-200">
                  {customer?.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">
                    {customer?.name}
                  </h2>
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Email:</span>{" "}
                    {customer?.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Phone:</span>{" "}
                    {customer?.number}
                  </p>
                </div>
              </div>
            )}

            {activeSection === "halls" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {halls.map((hall, index) => (
                  <div
                    key={index}
                    className={`bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col transform hover:-translate-y-1 hover:scale-105 ${scaleIn}`}
                  >
                    {hall.image ? (
                      <img
                        src={hall.image}
                        alt={hall.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-700 text-4xl font-bold rounded-lg">
                        {hall.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-blue-700">
                          {hall.name}
                        </h4>
                        <button
                          onClick={() => handleToggleFavourite(hall._id)}
                          className="text-xl"
                        >
                          {isFavourite(hall._id) ? "❤️" : "🤍"}
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        <strong>Capacity:</strong> {hall.capacity}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Price:</strong>{" "}
                        <span className="text-green-600 font-bold">
                          ₹{hall.price}/day
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Address:</strong> {hall.address}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Amenities:</strong>{" "}
                        {(hall.amenities || []).join(", ")}
                      </p>
                      <button
                        onClick={() => {
                          setSelectedHall(hall);
                          setShowBookingForm(true);
                        }}
                        className="mt-auto w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
              {activeSection === "bookings" && (
                <div className={` rounded-2xl shadow-lg p-6 ${fadeIn}`}>
                  <h3 className="text-lg font-bold mb-4 text-blue-700">My Bookings</h3>

                  {bookings.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {bookings.map((b, idx) => (
                        <li
                          key={idx}
                          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition transform duration-300 ease-out"
                        >
                          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                            {/* Left: Hall info */}
                            <div className="flex flex-col gap-2">
                              <h4 className="text-xl font-bold text-blue-700">{b.hall?.name}</h4>
                              <p className="text-sm text-gray-600"><strong>Address:</strong> {b.hall?.address}</p>
                              <p className="text-sm text-gray-600"><strong>Price:</strong> ₹{b.hall?.price}</p>
                            </div>

                            {/* Right: Date + Status */}
                            <div className="flex flex-col md:items-end gap-2">
                              <span className="bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full font-medium">
                                {b.date}
                              </span>

                              <span
                                className={`inline-block text-sm px-4 py-2 rounded-full font-semibold
                                  ${b.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                  ${b.status === "confirmed" ? "bg-green-100 text-green-800" : ""}
                                  ${b.status === "rejected" ? "bg-red-100 text-red-800" : ""}
                                `}
                              >
                                {b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                              </span>
                            </div>
                          </div>

                          {/* Occasion */}
                          <p className="mt-2 text-sm text-purple-700 font-medium inline-block bg-purple-50 px-2 py-1 rounded-full">
                            {b.occasion}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No bookings found.</p>
                  )}
                </div>
              )}


           {activeSection === "favourites" && (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${fadeIn}`}>
    <h3 className="text-lg font-bold mb-4 text-purple-700">
      My Favourites
    </h3>

    {favourites.length > 0 ? (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favourites.map((f, idx) => (
          <li
            key={idx}
            className="relative bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl shadow hover:shadow-md hover:scale-[1.02] transition transform duration-200 overflow-hidden"
          >
            {/* Floating Heart Badge */}
            <span className="absolute top-2 right-2 text-red-500 text-2xl animate-pulse">
              💖
            </span>

            {/* Hall Image / Avatar */}
            {f.hall?.image ? (
              <img
                src={f.hall.image}
                alt={f.hall.name}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-200 text-gray-700 text-4xl font-bold">
                {f.hall?.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Card Content */}
            <div className="p-4">
              <h4 className="text-md font-semibold text-gray-800">
                {f.hall?.name || "Unnamed Hall"}
              </h4>
              <p className="text-sm text-gray-600">
                {f.hall?.address || "N/A"}
              </p>
              <p className="text-sm text-green-600 font-bold">
                ₹{f.hall?.price || "N/A"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No favourites found.</p>
    )}
  </div>
)}

          </>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedHall && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div
            className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative ${scaleIn}`}
          >
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
              onClick={() => setShowBookingForm(false)}
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
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                required
              />
              <label className="block mb-2 font-medium text-gray-700">
                Occasion
              </label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full mb-6 p-2 border border-gray-300 rounded"
                required
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-xl font-semibold hover:scale-105 transition"
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
