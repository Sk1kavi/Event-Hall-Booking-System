import  { useState } from 'react';
import CustomerRegister from './CustomerRegister.jsx'; 

const CustomerLogin = () => {
    const [showRegister, setShowRegister] = useState(false);

    if (showRegister) {
        // Lazy load or import your CustomerRegister component as needed
        return <CustomerRegister />;
    }

    return (
        <form
            className="max-w-sm mx-auto mt-16 p-8 bg-white rounded shadow space-y-6"
            onSubmit={e => e.preventDefault()}
        >
            <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password:</label>
                <input
                    type="password"
                    id="password"
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
                <span
                    className="text-blue-600 underline cursor-pointer"
                    onClick={() => setShowRegister(true)}
                >
                    Register
                </span>
            </p>
        </form>
    );
};

export default CustomerLogin;