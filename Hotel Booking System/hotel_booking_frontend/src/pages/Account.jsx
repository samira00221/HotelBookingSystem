import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:9090/api";

const Account = ({ contactSectionRef, aboutSectionRef }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch pending payments from backend endpoint
  const fetchPendingPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:9090/payments/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPendingPayments(data);
    } catch (err) {
      setPendingPayments([]);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:9090/bookings/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUser(prevUser => ({ ...prevUser, bookings: data }));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:9090/payments/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUser(prevUser => ({ ...prevUser, payments: data }));
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  useEffect(() => {
    const fetchAccountDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }
        const userRes = await axios.get(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        fetchPendingPayments();
      } catch (err) {
        setUser(null);
        setError("Could not load account info.");
        setPendingPayments([]);
        console.error("Error fetching account details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccountDetails();
    // eslint-disable-next-line
  }, []);

  const handleResendEmail = async (paymentId) => {
    setResendLoading(paymentId);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/payments/resend-email/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Confirmation email resent!");
    } catch (err) {
      setMessage("Failed to resend email.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancelPayment = async (paymentId) => {
    setCancelLoading(paymentId);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE}/payments/refund/${paymentId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Payment cancelled.");
      // Refresh pending payments
      if (user && user.id) fetchPendingPayments(user.id);
      fetchPayments();
    } catch (err) {
      setMessage("Failed to cancel payment.");
    } finally {
      setCancelLoading(false);
    }
  };

  useEffect(() => {
    if (user && !user.bookings) {
      fetchBookings();
    }
    if (user && !user.payments) {
      fetchPayments();
    }
    // eslint-disable-next-line
  }, [user]);

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
    setShowPaymentOptions(true);
  };

  // Use backend enums for payment method
  const handlePaymentMethod = (method) => {
    alert(`Payment via ${method} for booking ID ${selectedBooking?.id} is being processed.`);
    setShowPaymentOptions(false);
    // In a real application, you would integrate with a payment gateway here.
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-[#00df9a] text-xl font-bold">Loading account...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-xl font-bold">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gray-400 text-xl font-bold">Could not load account info. User not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-4">
      {/* Navbar is rendered only ONCE at the top level (App.jsx), not here */}
      <div className="max-w-3xl mx-auto bg-[#181f2a] rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-4xl font-extrabold text-[#00df9a] mb-8 text-center tracking-wide drop-shadow">My Account</h1>
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="font-semibold text-lg text-gray-200 mb-1">Username</div>
            <div className="mb-2 text-white">{user.username}</div>
            <div className="font-semibold text-lg text-gray-200 mb-1">Email</div>
            <div className="mb-2 text-white">{user.email}</div>
            {user.roles && Array.isArray(user.roles) && user.roles.length > 0 && (
              <>
                <div className="font-semibold text-lg text-gray-200 mb-1">Roles</div>
                <div className="mb-2 text-[#00df9a]">{user.roles.join(", ")}</div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-[#00df9a] w-24 h-24 flex items-center justify-center text-4xl font-bold text-black shadow-lg border-4 border-[#101e36] mb-2">
              {user.fullName && user.fullName.length > 0
                ? user.fullName[0].toUpperCase()
                : (user.username && user.username.length > 0 ? user.username[0].toUpperCase() : "")
              }
            </div>
            <div className="text-gray-300 font-semibold">{user.fullName}</div>
          </div>
        </div>

        {/* Pending Payments Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Pending Payments</h2>
          {message && <div className="mb-2 text-green-400">{message}</div>}
          {pendingPayments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="min-w-full leading-normal mb-4 bg-[#101e36] rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Payment ID</th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Booking ID</th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Amount</th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map(payment => (
                    <tr key={payment.id}>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">{payment.id}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">{payment.bookingId}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-[#00df9a] font-bold">${payment.amount}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm">
                        <span className="bg-yellow-300 text-yellow-900 px-3 py-1 rounded-full font-semibold text-xs">PENDING</span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm space-x-2">
                        <button
                          onClick={() => handleResendEmail(payment.id)}
                          className="bg-[#00df9a] text-black px-3 py-1 rounded hover:bg-[#00c97a] text-xs font-bold"
                          disabled={resendLoading === payment.id}
                        >
                          {resendLoading === payment.id ? "Resending..." : "Resend Email"}
                        </button>
                        <button
                          onClick={() => handleCancelPayment(payment.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs font-bold"
                          disabled={cancelLoading === payment.id}
                        >
                          {cancelLoading === payment.id ? "Cancelling..." : "Cancel"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-gray-400 text-sm">
                If you missed the email, click <span className="text-[#00df9a] font-semibold">Resend Email</span>. To cancel, click <span className="text-red-400 font-semibold">Cancel</span>.
              </div>
            </div>
          ) : (
            <div className="text-gray-400">No pending payments.</div>
          )}
        </div>

        {/* Bookings Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-[#00df9a] mb-2">My Bookings</h2>
          {user.bookings && Array.isArray(user.bookings) && user.bookings.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="min-w-full leading-normal bg-[#101e36] rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Hotel Name
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Room Type
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Nights
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">{booking.id}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">
                        {booking.hotelName || (booking.hotel && booking.hotel.name) || "N/A"}
                      </td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-[#00df9a]">{booking.roomType}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">{booking.numberOfNights}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm">
                        <span className={`relative inline-block px-3 py-1 font-semibold text-xs rounded-full ${
                          booking.status === "CONFIRMED" ? "bg-green-300 text-green-900" :
                          booking.status === "PENDING" ? "bg-yellow-300 text-yellow-900" :
                          booking.status === "CANCELLED" ? "bg-red-300 text-red-900" : "bg-gray-300 text-gray-900"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm">
                        {booking.status === "PENDING" && (
                          <button
                            onClick={() => handlePayNow(booking)}
                            className="bg-[#00df9a] text-black px-3 py-1 rounded-md font-bold hover:bg-[#00c97a] text-xs"
                          >
                            Pay Now
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400">No bookings found.</div>
          )}
        </div>

        {/* Payment History Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#00df9a] mb-2">Payment History</h2>
          {user.payments && Array.isArray(user.payments) && user.payments.length > 0 ? (
            <div className="overflow-x-auto rounded-lg shadow-inner">
              <table className="min-w-full leading-normal bg-[#101e36] rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user.payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">{payment.id}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">{payment.bookingId}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-[#00df9a] font-bold">${payment.amount}</td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm">
                        <span className={`relative inline-block px-3 py-1 font-semibold text-xs rounded-full ${
                          payment.status === "PAID" ? "bg-green-300 text-green-900" :
                          payment.status === "PENDING" ? "bg-yellow-300 text-yellow-900" :
                          payment.status === "FAILED" ? "bg-red-300 text-red-900" :
                          payment.status === "REFUNDED" ? "bg-gray-400 text-gray-900" :
                          "bg-gray-300 text-gray-900"
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-800 text-sm text-white">
                        {payment.date ? new Date(payment.date).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-400">No payment history found.</div>
          )}
        </div>

        {/* Payment Modal */}
        {showPaymentOptions && selectedBooking && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-[#181f2a] rounded-xl shadow-2xl p-8 border border-gray-700 max-w-sm w-full">
              <h2 className="text-xl font-bold text-[#00df9a] mb-4">Choose Payment Method</h2>
              <p className="text-gray-200 mb-2">Booking ID: <span className="font-semibold">{selectedBooking.id}</span></p>
              <p className="text-gray-200 mb-4">Total Amount: <span className="text-[#00df9a] font-bold">${selectedBooking.totalAmount || "N/A"}</span></p>
              <div className="space-y-4">
                <button
                  onClick={() => handlePaymentMethod("MOBILE_MONEY")}
                  className="w-full bg-[#00df9a] text-black px-4 py-2 rounded-md font-bold hover:bg-[#00c97a] transition"
                >
                  Pay with Mobile Money
                </button>
                <button
                  onClick={() => handlePaymentMethod("DEBIT_CARD")}
                  className="w-full bg-blue-400 text-black px-4 py-2 rounded-md font-bold hover:bg-blue-500 transition"
                >
                  Pay with Debit Card
                </button>
                <button
                  onClick={() => handlePaymentMethod("PAYPAL")}
                  className="w-full bg-yellow-400 text-black px-4 py-2 rounded-md font-bold hover:bg-yellow-500 transition"
                >
                  Pay with PayPal
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => setShowPaymentOptions(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* About Section */}
        <div ref={aboutSectionRef} className="mt-16 mb-8">
          <h2 className="text-2xl font-bold text-[#00df9a] mb-2">About Us</h2>
          <p className="text-gray-300">
            Welcome to Travella! We are dedicated to making your hotel booking experience seamless, secure, and enjoyable. Our platform connects you with the best hotels and exclusive deals, ensuring your stay is comfortable and memorable.
          </p>
        </div>

        {/* Contact Section */}
        <div ref={contactSectionRef} className="mb-4">
          <h2 className="text-2xl font-bold text-[#00df9a] mb-2">Contact</h2>
          <p className="text-gray-300">
            Have questions or need support? Reach out to us at <a href="mailto:support@travella.com" className="text-[#00df9a] underline">support@travella.com</a> or call us at <span className="text-[#00df9a]">+1-800-TRAVELLA</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Account;