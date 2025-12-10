import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  //Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    const res = await fetch("/api/users/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    if (res.ok) {
      setSuccess(true);
      setMessage("Password reset successful! You can now log in.");
    } else {
      setMessage("Reset failed. The link may be invalid or expired.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#181f2a] p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-800">
        <h2 className="text-3xl font-bold text-[#00df9a] mb-6 text-center">Reset Password</h2>
        {success ? (
          <>
            <div className="mb-4 text-[#00df9a] text-center">{message}</div>
            <div className="text-center">
              <Link to="/login">
                <button className="bg-[#00df9a] text-black px-4 py-2 rounded font-bold hover:bg-[#00c97a] transition">
                  Go to Login
                </button>
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-200">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-1 font-semibold text-gray-200">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00df9a]"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#00df9a] text-black py-2 rounded font-bold hover:bg-[#00c97a] transition"
            >
              Submit
            </button>
            {message && <div className="mt-4 text-red-400 text-center">{message}</div>}
          </form>
        )}
      </div>
    </div>
  );
}