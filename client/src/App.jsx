import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import AdminDashboard from "../pages/AdminDashboard"; 
import OwnerDashboard from "../pages/OwnerDashboard";
import CustomerDashboard from "../pages/CustomerDashboard"; 
import UpdateHall from "../pages/UpdateHall.jsx";
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/customerdashboard" element={<CustomerDashboard />} /> 
        <Route path="/ownerdashboard" element={<OwnerDashboard />} />
        <Route path="/updatehall/:id" element={<UpdateHall />} />
        <Route path="*" element={<div className="text-center mt-16">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}
