import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [halls, setHalls] = useState([]);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
  }

  const BASE_URL = "https://event-hall-booking-system.onrender.com";

  const fetchOwners = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/owners`);
      const data = await response.json();
      if (data.success) {
        setOwners(data.owners);
      } else {
        alert("Failed to fetch owners.");
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
      alert("An error occurred while fetching owners.");
    }
    setLoading(false);
  };

  const fetchHalls = async () => {
    setFetching(true);
    try {
      const response = await fetch(`${BASE_URL}/halls`);
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
    setFetching(false);
  };

  useEffect(() => {
    fetchOwners();
    fetchHalls();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/owners/approve/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert("Owner approved");
        fetchOwners();
      } else {
        alert(data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Error approving owner");
    }
  };

  const handleHallApprove = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/halls/approve/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        alert("Hall approved");
        fetchHalls();
      } else {
        alert(data.message || "Approval failed");
      }
    } catch (error) {
      console.error("Approval error:", error);
      alert("Error approving hall");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/owners/reject/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Owner rejected");
        fetchOwners();
      } else {
        alert(data.message || "Rejection failed");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Error rejecting owner");
    }
  };

  const handleHallReject = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/halls/reject/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Hall rejected");
        fetchHalls();
      } else {
        alert(data.message || "Rejection failed");
      }
    } catch (error) {
      console.error("Rejection error:", error);
      alert("Error rejecting hall");
    }
  };

  if (loading || fetching)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">
          Loading dashboard data...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 py-10 px-2">
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-blue-800 drop-shadow">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-2 rounded-lg shadow hover:bg-red-600 transition font-semibold"
          >
            Logout
          </button>
        </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">       
        {/* Owners Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" /></svg>
            Pending Owner Approvals
          </h1>
          {owners.length === 0 ? (
            <p className="text-gray-500 text-lg">No owners found.</p>
          ) : (
            <ul className="space-y-6">
              {owners.map((owner) => (
                <li
                  key={owner._id}
                  className="border border-blue-100 bg-blue-50 rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="space-y-1">
                    <p>
                      <span className="font-semibold text-blue-800">Name:</span> {owner.name}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-800">Email:</span> {owner.email}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-800">Mobile:</span> {owner.number}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-800">Address:</span> {owner.address}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-800">Hall Name:</span> {owner.hallname}
                    </p>
                    <p>
                      <span className="font-semibold text-blue-800">Location:</span> {owner.location}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleApprove(owner._id)}
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(owner._id)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-red-500 hover:to-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Halls Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-200">
          <h1 className="text-3xl font-extrabold text-purple-700 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21v-2a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v2M16 3.13a4 4 0 0 1 0 7.75M8 3.13a4 4 0 0 0 0 7.75" /></svg>
            Pending Hall Approvals
          </h1>
          {halls.length === 0 ? (
            <p className="text-gray-500 text-lg">No halls found.</p>
          ) : (
            <ul className="space-y-6">
              {halls.map((hall) => (
                <li
                  key={hall._id}
                  className="border border-purple-100 bg-purple-50 rounded-xl p-6 shadow hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-purple-800 text-lg">
                      {hall.name} <span className="font-normal text-gray-700">(Capacity: {hall.capacity})</span>
                    </p>
                    <p>
                      <span className="font-semibold text-purple-800">Price:</span> ₹{hall.price}/day
                    </p>
                    <p>
                      <span className="font-semibold text-purple-800">Address:</span> {hall.address}
                    </p>
                    <p>
                      <span className="font-semibold text-purple-800">Amenities:</span> {(hall.amenities || []).join(', ')}
                    </p>
                    <p>
                      <span className="font-semibold text-purple-800">Operating Days:</span> {(hall.daysOpen || []).join(', ')}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleHallApprove(hall._id)}
                      className="bg-gradient-to-r from-green-400 to-green-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-green-500 hover:to-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleHallReject(hall._id)}
                      className="bg-gradient-to-r from-red-400 to-red-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-red-500 hover:to-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
