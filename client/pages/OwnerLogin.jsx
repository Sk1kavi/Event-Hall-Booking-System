import  { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import OwnerRegister  from './OwnerRegister';
const OwnerLogin = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    if (showRegister) {
        // Lazy load or import your CustomerRegister component as needed
        return <OwnerRegister />;
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await fetch("http://localhost:5000/ownerlogin", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await result.json();
            console.log(data);

            if (data.success) {
                alert("Login successful");
                localStorage.setItem("ownerEmail", data.owner.email);
                localStorage.setItem("ownerId", data.owner._id.toString());
                setEmail("");
                setPassword("");
                navigate("/ownerdashboard");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login");
        }
    };

    return (
        <form className="max-w-sm mx-auto mt-16 p-8 bg-white rounded shadow space-y-6"
            onSubmit={handleOnSubmit}>
            <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
            >
                Login
            </button>
            <p>
                Do not have an account?{' '}
                <span className="text-blue-600 underline cursor-pointer" onClick={() => setShowRegister(true)}>Register</span>
            </p>
        </form>
    );
};

export default OwnerLogin;