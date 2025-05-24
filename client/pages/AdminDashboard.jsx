import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [halls, setHalls] = useState([]);
  const [fetching, setFetching] = useState(true);

  const BASE_URL = "http://localhost:5000";

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

  if (loading || fetching) return <p>Loading dashboard data...</p>;

  return (
    <>
      {/* Owners Section */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Owner Approvals</h1>
        {owners.length === 0 ? (
          <p>No owners found.</p>
        ) : (
          <ul className="space-y-4">
            {owners.map((owner) => (
              <li key={owner._id} className="border p-4 rounded shadow space-y-2">
                <p><strong>Name:</strong> {owner.name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>Mobile:</strong> {owner.number}</p>
                <p><strong>Address:</strong> {owner.address}</p>
                <p><strong>Hall Name:</strong> {owner.hallname}</p>
                <p><strong>Location:</strong> {owner.location}</p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApprove(owner._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(owner._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
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
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pending Hall Approvals</h1>
        {halls.length === 0 ? (
          <p>No halls found.</p>
        ) : (
          <ul className="space-y-4">
            {halls.map((hall) => (
              <li key={hall._id} className="border p-4 rounded shadow space-y-2">
                <p><strong>{hall.name}</strong> (Capacity: {hall.capacity})</p>
                <p>Owner: {hall.ownerName}, Contact: {hall.contactNumber}</p>
                <p>Price: ₹{hall.price}/day</p>
                <p>Address: {hall.address}</p>
                <p>Amenities: {(hall.amenities || []).join(', ')}</p>
                <p>Operating Days: {(hall.daysOpen || []).join(', ')}</p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleHallApprove(hall._id)}
                    className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleHallReject(hall._id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
