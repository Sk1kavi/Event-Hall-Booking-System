import  { useState } from 'react';
import OwnerLogin from './OwnerLogin';

const OwnerRegister = () => {
    const [showLogin,setShowLogin]=useState(false);

    if(showLogin){
        return <OwnerLogin/>;
    }
    return (
        <form className="max-w-sm mx-auto mt-16 p-8 bg-white rounded shadow space-y-6">
             <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name:</label>
                <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
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
             <div>
                <label htmlFor="number" className="block text-gray-700 font-semibold mb-2">Mobile Number:</label>
                <input
                    type="text"
                    id="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
             <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2"> Home Address:</label>
                <textarea
                    id="address"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">Hall Address:</label>
                <textarea
                    id="location"
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