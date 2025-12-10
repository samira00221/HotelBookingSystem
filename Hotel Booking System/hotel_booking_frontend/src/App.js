import React, { useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import HotelList from "./pages/HotelList";
import HotelDetails from "./pages/HotelDetails";
import CheckEmail from "./pages/CheckEmail";
import Account from "./pages/Account";
import PaymentConfirm from "./pages/PaymentConfirm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminHotels from "./pages/AdminHotels";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ResetPassword from "./pages/ResetPassword";  

function App() {
  const contactSectionRef = useRef(null);
  const aboutSectionRef = useRef(null);

  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  const yourGetUserFunction = () => JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <Router>
      <Navbar onContactClick={scrollToContact} onAboutClick={scrollToAbout} />
      <Routes>
        <Route
          path="/"
          element={
            <Hero
              contactSectionRef={contactSectionRef}
              aboutSectionRef={aboutSectionRef}
            />
          }
        />
        <Route path="/login" element={<Login contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef} />} />
        <Route path="/register" element={<Register contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef} />} />
        {/* Protected Routes */}
        <Route path="/forgot-password" element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
        <Route path="/reset-password" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
        <Route path="/hotels" element={<ProtectedRoute><HotelList /></ProtectedRoute>} />
        <Route path="/hotel/region" element={<ProtectedRoute><HotelList /></ProtectedRoute>} />
        <Route
          path="/hotel/:id"
          element={
            <ProtectedRoute>
              <HotelDetails contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef} />
            </ProtectedRoute>
          }
        />
        <Route path="/check-email" element={<ProtectedRoute><CheckEmail /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef} /></ProtectedRoute>} />
        <Route path="/payments/confirm" element={<ProtectedRoute><PaymentConfirm /></ProtectedRoute>} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef} />
            </ProtectedRoute>
          }
        />
        {/* Admin routes with sidebar/layout */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef}>
                <AdminDashboard getUser={yourGetUserFunction} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminLayout contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef}>
                <AdminBookings getUser={yourGetUserFunction} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hotels"
          element={
            <ProtectedRoute>
              <AdminLayout contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef}>
                <AdminHotels getUser={yourGetUserFunction} />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminLayout contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef}>
                <AdminUsers />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute>
              <AdminLayout contactSectionRef={contactSectionRef} aboutSectionRef={aboutSectionRef}>
                <AdminPayments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;