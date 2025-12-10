import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:9090/api";

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "GUEST", label: "Guest" }
];

const Register = ({ contactSectionRef, aboutSectionRef }) => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    roles: [],
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //Only allow one role at a time
  const handleRoleRadio = (role) => {
    setForm((prev) => ({
      ...prev,
      roles: [role],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    if (form.roles.length === 0) {
      setMessage("Please select a role.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/users/register`, {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phoneNumber: form.phoneNumber,
        password: form.password,
        roles: form.roles,
      });
      setMessage("Registration successful! Please check your email to confirm your account.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-black">
      <div className="flex items-center justify-center flex-1">
        <form
          className="bg-black p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-800 mt-16"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-[#00df9a] mb-6 text-center drop-shadow">Register</h2>
          {message && <div className="mb-4 text-[#00df9a] text-center">{message}</div>}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-gray-200">Role</label>
            <div className="flex gap-6">
              {roleOptions.map((role) => (
                <label key={role.value} className="flex items-center text-gray-200">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={form.roles[0] === role.value}
                    onChange={() => handleRoleRadio(role.value)}
                    className="mr-2 accent-[#00df9a]"
                  />
                  {role.label}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#00df9a] text-black py-2 rounded font-bold hover:bg-[#00c97a] transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-4 text-sm text-center text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00df9a] hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
      {/* Bottom Section: About (right) and Contact (left) */}
      <div className="w-full bg-[#181f2a] mt-8 py-8">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:justify-between gap-6 px-4">
          {/* Contact Section */}
          <div id="contact" ref={contactSectionRef} className="md:w-1/2 w-full">
            <h2 className="text-xl font-bold text-[#00df9a] mb-2">Contact Us</h2>
            <p className="mb-2 text-gray-300 text-sm">Have questions? Reach out:</p>
            <div className="flex flex-col items-start space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FaPhone className="text-[#00df9a] text-lg" />
                <span className="text-gray-200 font-semibold">+250780000000</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-[#00df9a] text-lg" />
                <span className="text-gray-200 font-semibold">travella@info.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaInstagram className="text-[#00df9a] text-lg" />
                <span className="text-gray-200 font-semibold">@travella_rw</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaTwitter className="text-[#00df9a] text-lg" />
                <span className="text-gray-200 font-semibold">@travellaRwanda</span>
              </div>
            </div>
          </div>
          {/* About Section */}
          <div id="about" ref={aboutSectionRef} className="md:w-1/2 w-full">
            <h2 className="text-xl font-bold text-[#00df9a] mb-2">About Travella</h2>
            <p className="text-gray-300 text-sm">
              Your gateway to the best hotels in Rwanda. Explore top destinations and enjoy seamless booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;