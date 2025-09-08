import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const fadeInStyle = {
    animation: "fadeIn 0.8s ease",
};

const UpdateHall = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [hall, setHall] = useState(null);
    const [form, setForm] = useState({
        name: "",
        address: "",
        capacity: "",
        price: "",
        amenities: "",
        daysOpen: "",
        image: null,
    });

    useEffect(() => {
        const fetchHall = async () => {
            try {
                const res = await fetch(`https://event-hall-booking-system.onrender.com/halls/${id}`);
                if (!res.ok) throw new Error("Failed to fetch hall");
                const data = await res.json();

                setHall(data);
                setForm({
                    name: data.name || "",
                    address: data.address || "",
                    capacity: data.capacity ?? "",
                    price: data.price ?? "",
                    amenities: Array.isArray(data.amenities) ? data.amenities.join(", ") : "",
                    daysOpen: Array.isArray(data.daysOpen) ? data.daysOpen.join(", ") : "",
                    image: null,
                });
            } catch (err) {
                console.error("Error fetching hall:", err);
                alert("❌ Could not load hall details.");
            }
        };
        fetchHall();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const handleImageChange = (e) => {
        setForm((p) => ({ ...p, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("address", form.address);
            formData.append("capacity", String(form.capacity));
            formData.append("price", String(form.price));

            const amenitiesArray = form.amenities
                ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean)
                : [];
            const daysArray = form.daysOpen
                ? form.daysOpen.split(",").map((d) => d.trim()).filter(Boolean)
                : [];

            formData.append("amenities", JSON.stringify(amenitiesArray));
            formData.append("daysOpen", JSON.stringify(daysArray));

            if (form.image) formData.append("image", form.image);

            const res = await fetch(`https://event-hall-booking-system.onrender.com/halls/${id}`, {
                method: "PUT",
                body: formData,
            });
            const result = await res.json();

            if (res.ok && (result.success ?? true)) {
                alert("✅ Hall updated successfully!");
                navigate("/ownerdashboard");
            } else {
                alert("❌ Update failed: " + (result.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error updating hall:", err);
            alert("❌ Something went wrong while updating hall.");
        }
    };

    if (!hall) return <p style={fadeInStyle}>Loading...</p>;

   return (
  <div
    className="max-w-2xl mx-auto bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 rounded-2xl shadow-2xl border border-blue-200"
    style={fadeInStyle}
  >
    <style>
      {`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .input-animate:focus {
          box-shadow: 0 0 0 2px #2563eb33;
          transition: box-shadow 0.3s;
        }
        .btn-animate {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-animate:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 4px 16px #2563eb33;
        }
        .img-animate {
          animation: fadeIn 0.8s;
          box-shadow: 0 2px 16px #2563eb22;
        }
      `}
    </style>
   

    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hall Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hall Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter hall name"
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Enter address"
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none resize-none"
          rows={3}
        />
      </div>

      {/* Capacity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
        <input
          type="number"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Enter capacity"
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Enter price"
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amenities</label>
        <input
          type="text"
          name="amenities"
          value={form.amenities}
          onChange={handleChange}
          placeholder="E.g., AC, Parking, Catering"
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none"
        />
      </div>

      {/* Days Open */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operating Days</label>
        <input
          type="text"
          name="daysOpen"
          value={form.daysOpen}
          onChange={handleChange}
          placeholder="E.g., Mon, Tue, Wed"
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hall Image</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="w-full p-3 border border-blue-200 rounded-lg input-animate bg-white focus:outline-none"
        />
      </div>

      {hall.image && (
        <img
          src={hall.image}
          alt="Current Hall"
          className="w-44 h-32 object-cover rounded-xl img-animate mx-auto mb-2"
        />
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="btn-animate bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Update Hall
      </button>
    </form>
  </div>
);

};

export default UpdateHall;
