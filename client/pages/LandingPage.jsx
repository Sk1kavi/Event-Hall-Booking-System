import { useState } from "react";
import CustomerLogin from "../pages/CustomerLogin.jsx";
import OwnerLogin from "../pages/OwnerLogin.jsx";
import AdminLogin from "../pages/AdminLogin.jsx";
import { CheckCircle } from "lucide-react";

export default function LandingPage() {
  const [activeRole, setActiveRole] = useState(null);

  const renderLoginComponent = () => {
    if (!activeRole) return null;
    return (
      <div className="animate-fade-in mt-6">
        {activeRole === "customer" && <CustomerLogin />}
        {activeRole === "owner" && <OwnerLogin />}
        {activeRole === "admin" && <AdminLogin />}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-purple-700">
          Event Hall Booking System
        </h1>
        <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#features" className="hover:text-purple-600">
            Features
          </a>
          
          <a href="#login" className="hover:text-purple-600">
            Login
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-16 px-6">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Book With Confidence, Manage With Ease
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl">
          A trusted platform for customers as every hall and owner is verified by admin approval, ensuring a trusted booking experience — with email alerts for bookings and new hall additions.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 bg-white">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Platform Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Customers */}
          <div className="bg-gray-50 rounded-xl shadow p-8 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4 text-blue-600">
              For Customers
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                View all admin-approved halls
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Book halls with instant confirmation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                Email notifications for booking updates
              </li>
            </ul>
          </div>

          {/* Owners */}
          <div className="bg-gray-50 rounded-xl shadow p-8 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4 text-green-600">
              For Hall Owners
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Add halls and manage hall details
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Manage customer bookings easily
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Get notified by email on new bookings
              </li>
            </ul>
          </div>

          {/* Security */}
          <div className="bg-gray-50 rounded-xl shadow p-8 hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4 text-purple-600">
              Secure Platform
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Owners & halls shown only after admin approval
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Ensures a trusted booking environment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Automatic email alerts for hall additions
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roles + Login Section */}
      <section id="login" className="py-16 px-6 bg-gradient-to-br from-purple-50 to-purple-100">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Log In to Your Role
        </h3>
        <div className="flex justify-center gap-6 mb-8 flex-wrap">
          <button
            type="button"
            className={`px-6 py-3 rounded-lg font-bold shadow transition-all duration-300 ${
              activeRole === "customer"
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
            }`}
            onClick={() => setActiveRole("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={`px-6 py-3 rounded-lg font-bold shadow transition-all duration-300 ${
              activeRole === "owner"
                ? "bg-green-600 text-white"
                : "bg-white text-green-700 border border-green-200 hover:bg-green-50"
            }`}
            onClick={() => setActiveRole("owner")}
          >
            Hall Owner
          </button>
          <button
            type="button"
            className={`px-6 py-3 rounded-lg font-bold shadow transition-all duration-300 ${
              activeRole === "admin"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50"
            }`}
            onClick={() => setActiveRole("admin")}
          >
            Admin
          </button>
        </div>
        <div className="max-w-lg mx-auto">{renderLoginComponent()}</div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm bg-white shadow-inner">
        © {new Date().getFullYear()} Event Hall Booking System. All rights reserved.
      </footer>

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}
