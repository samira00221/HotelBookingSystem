import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await axios.post("http://localhost:9090/api/users/request-reset", { email });
      setMessage("If this email exists, a reset link has been sent.");
    } catch (err) {
      setError("Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-black p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800 mt-0"
      >
        <h2 className="text-3xl font-bold text-[#00df9a] mb-6 text-center">Reset Password</h2>
        {message && <div className="text-green-500 mb-4 text-center">{message}</div>}
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-gray-200">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-md border border-gray-700 bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-[#00df9a] w-full rounded-md font-bold py-3 text-black hover:bg-[#00c97a] transition"
          >
            Send Reset Link
          </button>
          <button
            type="button"
            className="bg-gray-600 w-full rounded-md font-bold py-3 text-gray-100 hover:bg-gray-700 transition"
            onClick={() => navigate("/login")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;