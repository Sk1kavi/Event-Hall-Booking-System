import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [showBookings, setShowBookings] = useState(false);
  const [owner, setOwner] = useState(null);
  const [fetching, setFetching] = useState(true);
  const ownerId = localStorage.getItem("ownerId");
  const [showForm, setShowForm] = useState(false);
  const [hallName, setHallName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [daysOpen, setDaysOpen] = useState([]);
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const amenitiesOptions = ['Parking', 'Wi-Fi', 'Air Conditioning', 'Stage', 'Catering'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };
  const toggleAmenity = (amenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const toggleDay = (day) => {
    setDaysOpen((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddHall = async (e) => {
    e.preventDefault();

    if (!hallName || !capacity || isNaN(capacity) || !price) {
      alert('Please fill in all required fields with valid data.');
      return;
    }

    const newHall = {
      name: hallName.trim(),
      owner_id: ownerId,
      capacity: Number(capacity),
      address,
      price: Number(price),
      amenities: Array.isArray(amenities) ? amenities : [],
      daysOpen: Array.isArray(daysOpen) ? daysOpen : []
    };

    try {
      const response = await fetch('http://localhost:5000/hallregister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHall),
      });

      if (response.ok) {
        const savedHall = await response.json();
        setHalls((prev) => [...prev, savedHall]);
        setHallName('');
        setCapacity('');
        setAddress('');
        setPrice('');
        setAmenities([]);
        setDaysOpen([]);
        alert('Hall registered successfully!');
      } else {
        alert('Failed to register hall. Please try again.');
      }
    } catch (error) {
      console.error('Error registering hall:', error);
      alert('An error occurred. Please try again.');
    }
    fetchHalls();
  };
  const handleViewBookings = async (hallId) => {
    try {
      const res = await fetch(`http://localhost:5000/bookings/byHall/${hallId}`);
      const data = await res.json();

      if (data.success) {
        setSelectedBookings(data.bookingsWithCustomer);
        setShowBookings(true);
      } else {
        alert("Failed to fetch bookings");
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };
  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/halls/list/${ownerId}`);
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
  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`http://localhost:5000/owner/${ownerId}`);
        const data = await res.json();
        if (data.success) {
          setOwner(data.owner);
        } else {
          alert("Failed to load profile");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
      setFetching(false);
    };

    fetchOwner();
  }, [ownerId]);

  if (fetching) return <div className="flex items-center justify-center h-screen"><p className="text-lg font-semibold">Loading your profile...</p></div>;
  if (loading) return <div className="flex items-center justify-center h-screen"><p className="text-lg font-semibold">Loading halls...</p></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow">Owner Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold shadow">
              {owner.name?.[0]?.toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Your Profile</h2>
            <p className="text-gray-700"><span className="font-semibold">Name:</span> {owner.name}</p>
            <p className="text-gray-700"><span className="font-semibold">Email:</span> {owner.email}</p>
            <p className="text-gray-700"><span className="font-semibold">Phone:</span> {owner.number}</p>
          </div>
        </div>

        {/* Halls Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-purple-700">Registered Halls</h3>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition font-semibold"
              >
                Register a New Hall
              </button>
            )}
          </div>
          {halls.length === 0 ? (
            <p className="text-gray-500 text-center">No halls registered yet.</p>
          ) : (
            <ul className="grid md:grid-cols-2 gap-6">
              {halls.map((hall, index) => (
                <li key={index} className="bg-gradient-to-br from-blue-100 to-purple-100 p-5 rounded-xl shadow-md border border-blue-100">
                  <p className="text-lg font-bold text-blue-800 mb-1">{hall.name}</p>
                  <p className="text-gray-700 mb-1">Capacity: <span className="font-semibold">{hall.capacity}</span></p>
                  <p className="text-gray-700 mb-1">Price: <span className="font-semibold">₹{hall.price}/day</span></p>
                  <p className="text-gray-700 mb-1">Address: <span className="font-semibold">{hall.address}</span></p>
                  <p className="text-gray-700 mb-1">Amenities: <span className="font-semibold">{(hall.amenities || []).join(', ')}</span></p>
                  <p className="text-gray-700 mb-2">Operating Days: <span className="font-semibold">{(hall.daysOpen || []).join(', ')}</span></p>
                  <button
                    onClick={() => handleViewBookings(hall._id)}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-lg shadow transition font-semibold"
                  >
                    View Bookings
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Bookings Modal/Section */}
          {showBookings && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
                  onClick={() => setShowBookings(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h3 className="text-lg font-bold mb-4 text-blue-700">Bookings</h3>
                {selectedBookings.length === 0 ? (
                  <p className="text-gray-500">No bookings found.</p>
                ) : (
                  <ul className="space-y-3">
                    {selectedBookings.map((booking, index) => (
                      <li key={index} className="border border-blue-100 p-4 rounded-lg shadow bg-blue-50">
                        <p><span className="font-semibold">Date:</span> {booking.date}</p>
                        <p><span className="font-semibold">Occasion:</span> {booking.occasion}</p>
                        <p><span className="font-semibold">Booked By:</span> {booking.customer.name} ({booking.customer.email})</p>
                        <p><span className="font-semibold">Phone:</span> {booking.customer.number}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* Hall Registration Form */}
          {showForm && (
            <form onSubmit={handleAddHall} className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg space-y-5">
              <h4 className="text-lg font-bold text-purple-700 mb-2">Register a New Hall</h4>
              <input
                type="text"
                placeholder="Hall Name"
                value={hallName}
                onChange={(e) => setHallName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                placeholder="Price per Day"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />

              <div>
                <label className="block font-medium mb-1 text-blue-700">Amenities:</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="accent-blue-600"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1 text-blue-700">Operating Days:</label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={daysOpen.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="accent-purple-600"
                      />
                      <span>{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  Add Hall
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
