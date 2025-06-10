import { useState } from 'react';
import CustomerLogin from '../pages/CustomerLogin.jsx';
import OwnerLogin from '../pages/OwnerLogin.jsx';
import AdminLogin from '../pages/AdminLogin.jsx';

export default function LandingPage() {
    const [activeRole, setActiveRole] = useState(null);

    const renderLoginComponent = () => {
        switch (activeRole) {
            case 'customer':
                return <CustomerLogin />;
            case 'owner':
                return <OwnerLogin />;
            case 'admin':
                return <AdminLogin />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">
                    Welcome to the Event Hall Booking System
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Please select your role to log in:
                </p>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            activeRole === 'customer'
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                        onClick={() => setActiveRole('customer')}
                    >
                        Customer
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            activeRole === 'owner'
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        onClick={() => setActiveRole('owner')}
                    >
                        Hall Owner
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${
                            activeRole === 'admin'
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                        onClick={() => setActiveRole('admin')}
                    >
                        Admin
                    </button>
                </div>
                {renderLoginComponent()}
            </div>
        </div>
    );
}
