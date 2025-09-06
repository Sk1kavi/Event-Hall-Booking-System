import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * OwnerDashboard (UI-refactor)
 * - Left aligned fixed-width sidebar (always visible)
 * - Menu: My Halls (default) | Profile | Logout
 * - Clicking a hall's "View Bookings" shows bookings in main area
 * - No "Back" button (use sidebar to switch)
 * - Kept core logic: register hall, fetch halls, fetch owner, fetch bookings
 */

export default function OwnerDashboard() {
  // --- data / form state (kept from your original) ---
  const [selectedBookings, setSelectedBookings] = useState([]); // bookings for a selected hall
  const [owner, setOwner] = useState(null);
  const [fetching, setFetching] = useState(true);
  const ownerId = localStorage.getItem("ownerId");

  const [showForm, setShowForm] = useState(false);
  const [hallName, setHallName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [daysOpen, setDaysOpen] = useState([]);

  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const amenitiesOptions = ["Parking", "Wi-Fi", "Air Conditioning", "Stage", "Catering"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const navigate = useNavigate();

  // --- UI navigation state ---
  const [selectedMenu, setSelectedMenu] = useState("myHalls"); // "myHalls" | "profile" | "bookings"
  const [selectedHallId, setSelectedHallId] = useState(null); // which hall's bookings are shown

  // --- helpers ---
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleAmenity = (amenity) => {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]));
  };

  const toggleDay = (day) => {
    setDaysOpen((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  // add hall (kept your logic)
  const handleAddHall = async (e) => {
    e.preventDefault();
    if (!hallName || !capacity || isNaN(capacity) || !price) {
      alert("Please fill in all required fields with valid data.");
      return;
    }

    const newHall = {
      name: hallName.trim(),
      owner_id: ownerId,
      capacity: Number(capacity),
      address,
      price: Number(price),
      amenities: Array.isArray(amenities) ? amenities : [],
      daysOpen: Array.isArray(daysOpen) ? daysOpen : [],
    };

    try {
      const response = await fetch("https://event-hall-booking-system.onrender.com/hallregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHall),
      });

      if (response.ok) {
        const savedHall = await response.json();
        // optionally append then refresh list (keeps behavior similar to your original)
        setHalls((prev) => [...prev, savedHall]);
        setHallName("");
        setCapacity("");
        setAddress("");
        setPrice("");
        setAmenities([]);
        setDaysOpen([]);
        alert("Hall registered successfully!");
      } else {
        alert("Failed to register hall. Please try again.");
      }
    } catch (error) {
      console.error("Error registering hall:", error);
      alert("An error occurred. Please try again.");
    }
    // refresh master list
    fetchHalls();
  };

  // fetch bookings for a hall -> display in main area
  const handleViewBookings = async (hallId) => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/bookings/byHall/${hallId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedBookings(data.bookingsWithCustomer || []);
        setSelectedHallId(hallId);
        setSelectedMenu("bookings");
      } else {
        alert("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Error fetching bookings");
    }
  };

  // fetch halls and owner (kept your logic)
  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://event-hall-booking-system.onrender.com/halls/list/${ownerId}`);
      const data = await response.json();
      if (data.success) setHalls(data.halls || []);
      else alert("Failed to fetch halls.");
    } catch (error) {
      console.error("Error fetching halls:", error);
      alert("An error occurred while fetching halls.");
    }
    setLoading(false);
  };
  const handleUpdateStatus = async (bookingId, newStatus) => {
  try {
    const res = await fetch(`http://localhost:5000/bookings/${bookingId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();
    if (data.success) {
      // Update state locally so UI updates instantly
      setSelectedBookings(prev =>
        prev.map(b =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
      alert(`Booking ${newStatus}`);
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert("Failed to update booking status");
  }
};


  useEffect(() => {
    fetchHalls();
  }, []); // ownerId is stable from localStorage

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`https://event-hall-booking-system.onrender.com/owner/${ownerId}`);
        const data = await res.json();
        if (data.success) setOwner(data.owner);
        else alert("Failed to load profile");
      } catch (error) {
        console.error("Error loading profile:", error);
        alert("Error loading profile");
      }
      setFetching(false);
    };
    fetchOwner();
  }, [ownerId]);

  // --- loading guards (hooks remain in same order) ---
  if (fetching) return <div className="flex items-center justify-center h-screen"><p className="text-lg font-semibold">Loading your profile...</p></div>;
  if (loading) return <div className="flex items-center justify-center h-screen"><p className="text-lg font-semibold">Loading halls...</p></div>;

  // find selected hall for heading (if any)
  const selectedHall = halls.find((h) => h._id === selectedHallId);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      {/* ---------- Sidebar (fixed width, properly aligned) ---------- */}
      <aside className="w-72 bg-white shadow-lg rounded-r-2xl p-6 flex flex-col gap-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            BP
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">BookingPro</div>
            <div className="text-xs text-gray-400">Owner Panel</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setSelectedMenu("myHalls")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMenu === "myHalls" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
            aria-current={selectedMenu === "myHalls"}
          >
            <span className="text-lg">🏛️</span>
            <span>My Halls</span>
          </button>

          <button
            onClick={() => setSelectedMenu("profile")}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMenu === "profile" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}
          >
            <span className="text-lg">👤</span>
            <span>Profile</span>
          </button>

          <div className="border-t border-gray-100 my-2" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </nav>

        {/* small owner info at bottom */}
        <div className="mt-auto">
          <div className="text-xs text-gray-400">Signed in as</div>
          <div className="text-sm font-medium text-gray-800 truncate">{owner?.name || "Owner"}</div>
        </div>
      </aside>

      {/* ---------- Main content ---------- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Profile view */}
        {selectedMenu === "profile" && (
          <section className="max-w-3xl bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                {owner.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{owner.name}</h2>
                <p className="text-sm text-gray-600 mt-1"><span className="font-semibold">Email:</span> {owner.email}</p>
                <p className="text-sm text-gray-600"><span className="font-semibold">Phone:</span> {owner.number}</p>
              </div>
            </div>
          </section>
        )}

        {/* My Halls (default) */}
        {selectedMenu === "myHalls" && (
          <section className="space-y-6">
            {/* header */}
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-800">My Halls</h3>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
                >
                  Register a New Hall
                </button>
              )}
            </div>

            {/* halls grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {halls.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow">No halls registered yet.</div>
              ) : (
                halls.map((hall) => (
                  <div key={hall._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 transform transition hover:-translate-y-1 hover:shadow-md">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-blue-800">{hall.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{hall.address}</p>
                        <div className="mt-3 text-sm text-gray-700">
                          <div>Capacity: <span className="font-semibold">{hall.capacity}</span></div>
                          <div>Price: <span className="font-semibold">₹{hall.price}/day</span></div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handleViewBookings(hall._id)}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                        >
                          View Bookings
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      <div><strong>Amenities:</strong> {(hall.amenities || []).join(", ") || "—"}</div>
                      <div className="mt-1"><strong>Operating Days:</strong> {(hall.daysOpen || []).join(", ") || "—"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Register form (inline, appears under list) */}
            {showForm && (
              <form onSubmit={handleAddHall} className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 max-w-2xl">
                <h4 className="text-lg font-semibold text-gray-800">Register a New Hall</h4>
                <input type="text" placeholder="Hall Name" value={hallName} onChange={(e) => setHallName(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" placeholder="Capacity" value={capacity} onChange={(e) => setCapacity(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                  <input type="number" placeholder="Price per Day" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Amenities</label>
                  <div className="grid grid-cols-2 gap-2">
                    {amenitiesOptions.map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} className="accent-blue-600" />
                        <span>{a}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">Operating Days</label>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map((d) => (
                      <label key={d} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={daysOpen.includes(d)} onChange={() => toggleDay(d)} className="accent-purple-600" />
                        <span>{d}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold">Add Hall</button>
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                </div>
              </form>
            )}
          </section>
        )}

{selectedMenu === "bookings" && (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-semibold text-gray-800">
        Bookings{selectedHall ? ` — ${selectedHall.name}` : ""}
      </h3>
      <div className="text-sm text-gray-500">Use the sidebar to switch views</div>
    </div>

    {selectedBookings.length === 0 ? (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        No bookings found for this hall.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {selectedBookings.map((booking, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between h-72 border border-gray-100 hover:shadow-lg transition"
          >
            {/* Booking Info */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</div>
              <div className="text-lg font-bold text-blue-700">{booking.date}</div>
              <div className="text-sm text-gray-700 mt-1"><strong>Occasion:</strong> {booking.occasion}</div>
              <div className="text-sm text-gray-700 mt-1"><strong>Booked By:</strong> {booking.customer?.name}</div>
              <div className="text-sm text-gray-700">{booking.customer?.email}</div>
              <div className="text-sm text-gray-700">{booking.customer?.number}</div>
            </div>

            {/* Status / Actions */}
            <div className="mt-4 flex justify-center gap-2">
              {booking.status === "pending" ? (
                <>
                  <button
                    className="bg-green-600 text-white text-sm py-1 px-3 rounded-full hover:bg-green-700 transition flex-1"
                    onClick={() => handleUpdateStatus(booking._id, "confirmed")}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-600 text-white text-sm py-1 px-3 rounded-full hover:bg-red-700 transition flex-1"
                    onClick={() => handleUpdateStatus(booking._id, "rejected")}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <span
                  className={`inline-block text-sm px-4 py-2 rounded-full font-medium
                    ${booking.status === "confirmed" ? "bg-green-100 text-green-700" : ""}
                    ${booking.status === "rejected" ? "bg-red-100 text-red-700" : ""}
                  `}
                >
                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </section>
)}

      </main>
    </div>
  );
}
