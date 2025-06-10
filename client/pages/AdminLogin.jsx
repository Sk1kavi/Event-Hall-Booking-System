import { useState } from "react";
import {useNavigate} from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch("https://event-hall-booking-system.onrender.com/adminlogin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();
      console.log(data);

      if (data.success) {
        setEmail("");
        setPassword("");
        alert("Login successful");
        navigate("/admindashboard");

      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="max-w-sm mx-auto mt-16 p-8 bg-white rounded shadow space-y-6"
    >
      <div>
        <label
          htmlFor="email"
          className="block text-gray-700 font-semibold mb-2"
        >
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-gray-700 font-semibold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default AdminLogin;
