import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";


export default function OwnerDashboard() {
  const navigate = useNavigate();
  const ownerId = localStorage.getItem("ownerId");

  // --- State ---
  const [owner, setOwner] = useState(null);
  const [halls, setHalls] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedMenu, setSelectedMenu] = useState("myHalls");
  const [selectedHallId, setSelectedHallId] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [hallName, setHallName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [daysOpen, setDaysOpen] = useState([]);
  const [image, setImage] = useState(null);


  const [filterHallId, setFilterHallId] = useState("all");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const amenitiesOptions = ["Parking", "Wi-Fi", "Air Conditioning", "Stage", "Catering"];
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // --- Fetch owner profile ---
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`https://event-hall-booking-system.onrender.com/owner/${ownerId}`);
        const data = await res.json();
        if (data.success) setOwner(data.owner);
      } catch (error) {
        console.error(error);
      }
      setFetching(false);
    };
    fetchOwner();
  }, [ownerId]);

  // --- Fetch halls ---
  const fetchHalls = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/halls/list/${ownerId}`);
      const data = await res.json();
      if (data.success) setHalls(data.halls || []);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // --- Fetch all bookings for analytics ---
  const fetchAllBookings = async () => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/bookings/byOwner/${ownerId}`);
      const data = await res.json();
      if (data.success) setAllBookings(data.bookingsWithCustomer || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHalls();
    fetchAllBookings();
  }, []);

  // --- Approve/Reject booking ---
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        setAllBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        alert(`Booking ${newStatus}`);
      } else alert(data.message);
    } catch (err) {
      console.error(err);
      alert("Failed to update booking status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const toggleAmenity = (amenity) => {
    setAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const toggleDay = (day) => {
    setDaysOpen(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleAddHall = async (e) => {
  e.preventDefault();
  if (!hallName || !capacity || isNaN(capacity) || !price || !image) {
    alert("Fill all required fields including image");
    return;
  }

  const formData = new FormData();
  formData.append("name", hallName.trim());
  formData.append("owner_id", ownerId);
  formData.append("capacity", Number(capacity));
  formData.append("address", address);
  formData.append("price", Number(price));
  formData.append("amenities",JSON.stringify(amenities));
  formData.append("daysOpen",JSON.stringify(daysOpen) );
  formData.append("image", image);

  try {
    const res = await fetch("https://event-hall-booking-system.onrender.com/hallregister", {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      const savedHall = await res.json();
      setHalls(prev => [...prev, savedHall]);
      setHallName(""); setCapacity(""); setAddress(""); setPrice(""); setAmenities([]); setDaysOpen([]); setImage(null);
      alert("Hall registered successfully!");
    }
  } catch (err) {
    console.error(err);
    alert("Error registering hall");
  }
  fetchHalls();
};


  const handleViewBookings = async (hallId) => {
    try {
      const res = await fetch(`https://event-hall-booking-system.onrender.com/bookings/byHall/${hallId}`);
      const data = await res.json();
      if (data.success) {
        setSelectedBookings(data.bookingsWithCustomer || []);
        setSelectedHallId(hallId);
        setSelectedMenu("bookings");
      }else {
        alert("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Error fetching bookings");
    }
  };

  if (fetching) return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
  if (loading) return <div className="flex items-center justify-center h-screen">Loading halls...</div>;

  const selectedHall = halls.find(h => h._id === selectedHallId);

  // --- Analytics ---
  const years = [...new Set(allBookings.map(b => new Date(b.date).getFullYear()))];

  const filteredBookings = allBookings.filter(b =>
  (filterHallId === "all" || b.hallId === filterHallId) &&
  (filterYear === "all" || new Date(b.date).getFullYear() === Number(filterYear))
);


  const chartData = halls
    .filter(h => filterHallId === "all" || h._id === filterHallId)
    .map(h => ({
      name: h.name,
      pending: filteredBookings.filter(b => b.hallId === h._id && b.status === "pending").length,
      confirmed: filteredBookings.filter(b => b.hallId === h._id && b.status === "confirmed").length,
      rejected: filteredBookings.filter(b => b.hallId === h._id && b.status === "rejected").length,
    }));

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-purple-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg rounded-r-2xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg">BP</div>
          <div>
            <div className="text-sm font-semibold text-gray-800">BookingPro</div>
            <div className="text-xs text-gray-400">Owner Panel</div>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button onClick={() => setSelectedMenu("myHalls")} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMenu === "myHalls" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}>🏛️ My Halls</button>
          <button onClick={() => setSelectedMenu("analysis")} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMenu === "analysis" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}>📊 Analysis</button>
          <button onClick={() => setSelectedMenu("profile")} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedMenu === "profile" ? "bg-blue-600 text-white shadow" : "text-gray-700 hover:bg-gray-100"}`}>👤 Profile</button>

          <div className="border-t border-gray-100 my-2" />

          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition">🚪 Logout</button>
        </nav>

        <div className="mt-auto">
          <div className="text-xs text-gray-400">Signed in as</div>
          <div className="text-sm font-medium text-gray-800 truncate">{owner?.name}</div>
        </div>
      </aside>

      {/* Main */}
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
        {/* My Halls */}
{selectedMenu === "myHalls" && (
  <section className="space-y-6">
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

    <div className="grid md:grid-cols-2 gap-6">
      {halls.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow">No halls registered yet.</div>
      ) : (
        halls.map((h) => (
          <div
            key={h._id}
            className="cursor-pointer bg-white p-5 rounded-xl shadow-sm border border-gray-100 transform transition hover:-translate-y-1 hover:shadow-md"
            onClick={() => navigate(`/updatehall/${h._id}`)} // card click
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-lg font-bold text-blue-800">{h.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{h.address}</p>
                <div className="mt-3 text-sm text-gray-700">
                  <div>
                    Capacity: <span className="font-semibold">{h.capacity}</span>
                  </div>
                  <div>
                    Price: <span className="font-semibold">₹{h.price}/day</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {/* Stop propagation so button click doesn't trigger card click */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewBookings(h._id);
                  }}
                  className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  View Bookings
                </button>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-500">
              <div>
                <strong>Amenities:</strong> {(h.amenities || []).join(", ") || "—"}
              </div>
              <div className="mt-1">
                <strong>Operating Days:</strong> {(h.daysOpen || []).join(", ") || "—"}
              </div>
            </div>
          </div>
        ))
      )}
    </div>

    {showForm && (
      <form
        onSubmit={handleAddHall}
        className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4 max-w-2xl"
      >
        <h4 className="text-lg font-semibold text-gray-800">Register a New Hall</h4>
        <input
          type="text"
          placeholder="Hall Name"
          value={hallName}
          onChange={(e) => setHallName(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <label className="block mb-2 font-medium text-gray-700">Hall Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          required
          className="w-full px-2 py-2 border border-gray-200 rounded-lg"
        />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
          <input
            type="number"
            placeholder="Price per Day"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {amenitiesOptions.map((a) => (
              <label key={a} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={amenities.includes(a)}
                  onChange={() => toggleAmenity(a)}
                  className="accent-blue-600"
                />
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
                <input
                  type="checkbox"
                  checked={daysOpen.includes(d)}
                  onChange={() => toggleDay(d)}
                  className="accent-purple-600"
                />
                <span>{d}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
          >
            Add Hall
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    )}
  </section>
)}

        {/* Bookings */}
        {selectedMenu === "bookings" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold text-gray-800">Bookings{selectedHall ? ` — ${selectedHall.name}` : ""}</h3>
              <div className="text-sm text-gray-500">Use the sidebar to switch views</div>
            </div>

            {selectedBookings.length === 0 ? (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">No bookings found for this hall.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {selectedBookings.map((booking, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between h-72 border border-gray-100 hover:shadow-lg transition">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date</div>
                      <div className="text-lg font-bold text-blue-700">{booking.date}</div>
                      <div className="text-sm text-gray-700 mt-1"><strong>Occasion:</strong> {booking.occasion}</div>
                      <div className="text-sm text-gray-700 mt-1"><strong>Booked By:</strong> {booking.customer?.name}</div>
                      <div className="text-sm text-gray-700">{booking.customer?.email}</div>
                      <div className="text-sm text-gray-700">{booking.customer?.number}</div>
                    </div>

                    <div className="mt-4 flex justify-center gap-2">
                      {booking.status === "pending" ? (
                        <>
                          <button className="bg-green-600 text-white text-sm py-1 px-3 rounded-full hover:bg-green-700 transition flex-1" onClick={()=>handleUpdateStatus(booking._id,"confirmed")}>Approve</button>
                          <button className="bg-red-600 text-white text-sm py-1 px-3 rounded-full hover:bg-red-700 transition flex-1" onClick={()=>handleUpdateStatus(booking._id,"rejected")}>Reject</button>
                        </>
                      ) : (
                        <span className={`inline-block text-sm px-4 py-2 rounded-full font-medium ${booking.status==="confirmed"?"bg-green-100 text-green-700":""} ${booking.status==="rejected"?"bg-red-100 text-red-700":""}`}>
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

        {/* Analytics */}
        {selectedMenu === "analysis" && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
              <label className="text-sm font-medium">Filter Hall:</label>
              <select className="border px-3 py-2 rounded-lg" value={filterHallId} onChange={e=>setFilterHallId(e.target.value)}>
                <option value="all">All Halls</option>
                {halls.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
              </select>

             <label className="text-sm font-medium">Filter Year:</label>
              <select
                className="border px-3 py-2 rounded-lg"
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option> {/* ← added option */}
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Total Halls</div>
                <div className="text-3xl font-bold text-blue-700">{halls.length}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Total Bookings</div>
                <div className="text-3xl font-bold text-green-700">{filteredBookings.length}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="text-3xl font-bold text-yellow-700">{filteredBookings.filter(b=>b.status==="pending").length}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Confirmed</div>
                <div className="text-3xl font-bold text-green-700">{filteredBookings.filter(b=>b.status==="confirmed").length}</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
                <div className="text-sm text-gray-500">Rejected</div>
                <div className="text-3xl font-bold text-red-700">{filteredBookings.filter(b=>b.status==="rejected").length}</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-gray-700 mb-4">Bookings per Hall</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <Tooltip/>
                  <Legend/>
                  <Bar dataKey="pending" fill="#FACC15"/>
                  <Bar dataKey="confirmed" fill="#22C55E"/>
                  <Bar dataKey="rejected" fill="#EF4444"/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
