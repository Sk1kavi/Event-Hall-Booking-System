import { useEffect,useState } from 'react';
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

    if (!hallName  || !capacity || isNaN(capacity) || !price) {
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
        setHalls((prev) => [...prev, savedHall]); // or just newHall if backend doesn't return data
        // Reset form
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
    fetchHalls(); // Refresh the list of halls
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

    //profile section
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

  if (fetching) return <p>Loading your profile...</p>;
  if (loading) return <p>Loading halls...</p>;

  return (
     <div>
      <div className="flex justify-end p-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Name:</strong> {owner.name}</p>
        <p><strong>Email:</strong> {owner.email}</p>
        <p><strong>Phone:</strong> {owner.number}</p>
      </div>
    <div className="p-6">
       <h3 className="text-xl font-semibold mb-4">Registered Halls</h3>
      {halls.length === 0 ? (
        <p className="text-gray-500">No halls registered yet.</p>
      ) : (
        <ul className="space-y-3">
          {halls.map((hall, index) => (
            <li key={index} className="bg-gray-100 p-4 rounded shadow">
              <p><strong>{hall.name}</strong> (Capacity: {hall.capacity})</p>
              {/*<p>Owner: {hall.ownerName}, Contact: {hall.contactNumber}</p>*/}
              <p>Price: ₹{hall.price}/day</p>
              <p>Address: {hall.address}</p>
              <p>Amenities: {(hall.amenities || []).join(', ')}</p>
              <p>Operating Days: {(hall.daysOpen || []).join(', ')}</p>
               <button
                  onClick={() => handleViewBookings(hall._id)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  View Bookings
                </button>
            </li>
          ))}
        </ul>
      )}
      {showBookings && (
  <div className="mt-6 bg-white p-4 rounded-xl shadow-lg">
    <h3 className="text-lg font-bold mb-4">Bookings</h3>
    {selectedBookings.length === 0 ? (
      <p>No bookings found.</p>
    ) : (
      <ul className="space-y-2">
        {selectedBookings.map((booking, index) => (
          <li key={index} className="border p-3 rounded shadow">
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Occasion:</strong> {booking.occasion}</p>
            <p><strong>Booked By:</strong> {booking.customer.name} ({booking.customer.email})</p>
            <p><strong>Phone:</strong> {booking.customer.number}</p>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className=" bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Register a New Hall
        </button>
      ) : (
        <form onSubmit={handleAddHall} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Hall Name"
            value={hallName}
            onChange={(e) => setHallName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price per Day"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />

          <div>
            <label className="block font-medium mb-1">Amenities:</label>
            <div className="grid grid-cols-2 gap-2">
              {amenitiesOptions.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Operating Days:</label>
            <div className="grid grid-cols-2 gap-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={daysOpen.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Add Hall
          </button>
        </form>
      )}
    </div>
        </div>
            </div>

  );
}
