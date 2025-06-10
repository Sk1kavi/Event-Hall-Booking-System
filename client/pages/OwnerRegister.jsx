import  { useState } from 'react';
import OwnerLogin from './OwnerLogin';

const OwnerRegister = () => {
    const [showLogin,setShowLogin]=useState(false);
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [name,setName]=useState("");
    const [number,setNumber]=useState("");
    const [address,setAddress]=useState("");
    const [hallname,setHallname]=useState("");
    const [location,setLocation]=useState("");

    if(showLogin){
        return <OwnerLogin/>;
    }
     const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/ownerregister", {
                method: "POST",
                body: JSON.stringify({ name, email, password, number, address ,hallname,location}),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            console.log(data);

            if (data.success) {
                alert(" Your Application for registering as a hall owner has been successfully submitted to admin for approval . you will be able to login once approved. ");
                setEmail("");
                setPassword("");
                setName("");
                setNumber("");
                setAddress("");
                setHallname("");
                setLocation("");
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
        <form className="max-w-sm mx-auto mt-16 p-8 bg-white rounded shadow space-y-6"
            onSubmit={handleOnSubmit}>
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
                    type="text"
                    id="number"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
             <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2"> Home Address:</label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    cols={10}
                />
            </div>
            <div>
                <label htmlFor="hallname" className="block text-gray-700 font-semibold mb-2">Hall Name:</label>
                <input
                    type="text"
                    id="hallname"
                    value={hallname}
                    onChange={(e) => setHallname(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Hall Address:</label>
                <textarea
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    cols={10}
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
                <span className="text-blue-600 underline cursor-pointer" onClick={()=>setShowLogin(true)}>Login</span>
            </p>
        </form>
    );
};

export default OwnerRegister;