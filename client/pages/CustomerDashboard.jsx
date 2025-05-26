import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CustomerDashboard = () => {
  const customerId = localStorage.getItem("customerId");
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedHall, setSelectedHall] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [occasion, setOccasion] = useState('');
  const [customer, setCustomer] = useState(null);
  const [fetching, setFetching] = useState(true);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/halls/list");
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
    customerId: customerId // assuming you're storing customer info in state/context
  };

  const res = await fetch('http://localhost:5000/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingData)
  });

  const data = await res.json();

  if (data.success) {
    alert('Booking successful!');
    setSelectedDate('');
    setOccasion('');
    setShowBookingForm(false);
  } else {
    alert('Booking failed: ' + data.message);
  }
};

  useEffect(() => {
    fetchHalls();
  }, []);
 

  //profile section
     useEffect(() => {
    const fetchCustomer= async () => {
      try {
        const res = await fetch(`http://localhost:5000/customer/${customerId}`);
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

  if (fetching) return <p>Loading your profile...</p>;

  if (loading) return <p className="text-center mt-10">Loading halls...</p>;

  return (
    <div className="p-6">
       <h2 className="text-xl font-bold mb-4">Your Profile</h2>
      <div className="bg-gray-100 p-4 rounded shadow">
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.number}</p>
      </div>
      <h3 className="text-2xl font-bold mb-6 text-center">Available Event Halls</h3>
      {halls.length === 0 ? (
        <p className="text-center text-gray-500">No halls available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {halls.map((hall, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
            >
              <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                Image Placeholder
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold mb-2">{hall.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Capacity:</strong> {hall.capacity}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Price:</strong> ₹{hall.price}/day
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Address:</strong> {hall.address}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Amenities:</strong> {(hall.amenities || []).join(', ')}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Operating Days:</strong> {(hall.daysOpen || []).join(', ')}
                </p>
                <button
                    onClick={() => {
                      setSelectedHall(hall);  
                      setShowBookingForm(true);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl transition"
                  >
                    Book Now
                  </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showBookingForm && selectedHall && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        onClick={() => setShowBookingForm(false)}
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4">Book {selectedHall.name}</h2>

      <form onSubmit={handleBookingSubmit}>
        <label className="block mb-2 font-medium">Select Date</label>
          <DatePicker
  selected={selectedDate ? new Date(selectedDate) : null}
  onChange={(date) => {
    
    const isoDate = date.toISOString().split('T')[0];
    setSelectedDate(isoDate);
  }}
  minDate={new Date()}
  dateFormat="yyyy-MM-dd"
  className="w-full mb-4 p-2 border border-gray-300 rounded"
/>

        <label className="block mb-2 font-medium">Occasion</label>
        <input
          type="text"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
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