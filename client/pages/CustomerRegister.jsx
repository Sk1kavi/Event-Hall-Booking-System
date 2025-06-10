import { useState } from 'react';
import CustomerLogin from './CustomerLogin';

const CustomerRegister = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [number, setNumber] = useState("");
    const [address, setAddress] = useState("");

    if (showLogin) {
        return <CustomerLogin />;
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/customerregister", {
                method: "POST",
                body: JSON.stringify({ name, email, password, number, address }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                alert("Registration successful");
                setEmail("");
                setPassword("");
                setName("");
                setNumber("");
                setAddress("");
                setShowLogin(true);
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred during registration");
        }
    };

    return (
        <form onSubmit={handleOnSubmit} className="max-w-sm mx-auto mt-16 p-8 bg-white rounded shadow space-y-6">
            <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="number" className="block text-gray-700 font-semibold mb-2">Mobile Number:</label>
                <input
                    type="tel"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">Address:</label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
                Register
            </button>
            <p>
                Already have an account?{' '}
                <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setShowLogin(true)}
                >
                    Login
                </span>
            </p>
        </form>
    );
};

export default CustomerRegister;
