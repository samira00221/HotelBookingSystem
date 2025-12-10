import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";
import Navbar from "../components/Navbar";

const API_BASE = "http://localhost:9090/api";

const Login = ({ contactSectionRef, aboutSectionRef }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [show2FAPopup, setShow2FAPopup] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState("");
  const [showCheckEmailCard, setShowCheckEmailCard] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handle2FACodeChange = (e) => {
    setTwoFACode(e.target.value);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");
  setTwoFAError("");
  try {
    const res = await axios.post(`${API_BASE}/users/login`, form);
    console.log("Login response:", res.data);
    if (res.data.user) {
      console.log("User roles:", res.data.user.roles);
    }
    if (
      (typeof res.data === "string" && res.data.includes("2FA code sent to your email")) ||
      (typeof res.data === "object" && res.data.message && res.data.message.includes("2FA code sent to your email"))
    ) {
      setShowCheckEmailCard(true);
      setShow2FAPopup(true);
    } else if (res.data && res.data.token && res.data.user) {
      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      // Redirect based on role
      if (res.data.user.roles && res.data.user.roles.includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/search");
      }
    } else {
      setMessage("Unexpected response from server.");
    }
  } catch (err) {
    if (
      err.response &&
      err.response.status === 403 &&
      err.response.data === "Please confirm your email before logging in."
    ) {
      setMessage("Please confirm your email before logging in. Check your inbox for the confirmation link.");
    } else {
      setMessage(
        err.response?.data?.message ||
          err.response?.data ||
          "Login failed. Please check your credentials and try again."
      );
    }
  } finally {
    setLoading(false);
  }
};

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setTwoFALoading(true);
    setTwoFAError("");
    try {
      const res = await axios.post(`${API_BASE}/users/verify-2fa`, {
        username: form.username,
        code: twoFACode,
      });
      if (res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        setShow2FAPopup(false);
        setShowCheckEmailCard(false);
        setMessage("");
       if (
        res.data.user.roles &&
        Array.isArray(res.data.user.roles) &&
        res.data.user.roles.includes("ADMIN")
      ) {
        navigate("/admin/dashboard");
      } else {
        navigate("/search");
      }
      } else {
        setTwoFAError("Invalid server response.");
      }
    } catch (err) {
      setTwoFAError(
        err.response?.data?.message ||
          err.response?.data ||
          "Invalid or expired 2FA code."
      );
    } finally {
      setTwoFALoading(false);
    }
  };

  // Smooth scroll handlers for Navbar
  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-black">
      <div className="flex items-center justify-center flex-1 mt-20">
        <form
          className="bg-black p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-800"
          onSubmit={handleSubmit}
        >
          <h2 className="text-3xl font-bold text-[#00df9a] mb-6 text-center drop-shadow">Login</h2>
          {message && <div className="mb-4 text-[#00df9a] text-center">{message}</div>}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-200">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-semibold text-gray-200">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#00df9a] text-black py-2 rounded font-bold hover:bg-[#00c97a] transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="mt-4 text-sm text-center">
            <Link to="/forgot-password" className="text-[#00df9a] hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="mt-2 text-sm text-center text-gray-300">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#00df9a] hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>

      {/* Check Email Card */}
      {showCheckEmailCard && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#181f2a] p-8 rounded-xl shadow-2xl max-w-sm w-full border border-gray-700 text-center">
            <h3 className="text-2xl font-bold text-[#00df9a] mb-4">Check Your Email</h3>
            <p className="mb-4 text-gray-200">
              A 6-digit code has been sent to your email. Please enter it below to complete your login.
            </p>
            <form onSubmit={handle2FASubmit}>
              <input
                type="text"
                maxLength={6}
                value={twoFACode}
                onChange={handle2FACodeChange}
                className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#00df9a] text-center tracking-widest text-lg"
                placeholder="Enter 2FA code"
                required
                autoFocus
              />
              {twoFAError && (
                <div className="mb-2 text-red-400">{twoFAError}</div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-600 text-gray-100 px-4 py-2 rounded hover:bg-gray-700"
                  onClick={() => {
                    setShow2FAPopup(false);
                    setShowCheckEmailCard(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00df9a] text-black px-4 py-2 rounded font-bold hover:bg-[#00c97a] transition"
                  disabled={twoFALoading}
                >
                  {twoFALoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Section: About (right) and Contact (left) */}
      <div className="w-full bg-[#12192b] mt-8 py-8">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:justify-between gap-6 px-4">
          {/* Contact Section */}
          <div ref={contactSectionRef} id="contact" className="md:w-1/2 w-full">
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
          <div ref={aboutSectionRef} id="about" className="md:w-1/2 w-full">
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

export default Login;