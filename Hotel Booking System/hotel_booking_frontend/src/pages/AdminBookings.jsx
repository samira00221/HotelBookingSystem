// ...existing imports...
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:9090/api";

const AdminBookings = ({ getUser }) => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [showDelete, setShowDelete] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, [page, size]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/bookings?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE}/bookings/${bookingToDelete.bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDelete(false);
      setBookingToDelete(null);
      fetchBookings();
    } catch (err) {
      alert("Failed to delete booking.");
    }
  };

  // Admin check (move hooks above this)
  const user = getUser ? getUser() : JSON.parse(localStorage.getItem("user") || "{}");
  if (!user || !user.roles || !user.roles.includes("ADMIN")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-2xl text-[#00df9a] font-bold">Access Denied: Admins Only</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-10 px-4">
      <div className="max-w-6xl mx-auto bg-[#181f2a] rounded-xl shadow-xl p-8 border border-gray-800">
        <h1 className="text-3xl font-bold text-[#00df9a] mb-6 text-center">Bookings</h1>
        {loading ? (
          <div className="text-center text-[#00df9a]">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg shadow-inner mb-4">
              <table className="min-w-full bg-[#101e36] rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Booking ID</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Guest</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Room</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Check In</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Check Out</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.bookingId} className="border-b border-gray-800">
                      <td className="px-4 py-2 text-white">{b.bookingId}</td>
                      <td className="px-4 py-2 text-[#00df9a]">{b.guest?.fullName || "-"}</td>
                      <td className="px-4 py-2 text-white">{b.room?.roomNumber || "-"}</td>
                      <td className="px-4 py-2 text-white">{b.checkInDate}</td>
                      <td className="px-4 py-2 text-white">{b.checkOutDate}</td>
                      <td className="px-4 py-2">
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => {
                            setBookingToDelete(b);
                            setShowDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <button
                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded mr-2 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Prev
                </button>
                <span className="text-gray-300 font-semibold">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="bg-gray-700 text-gray-200 px-3 py-1 rounded ml-2 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
              </div>
              <div>
                <label className="text-gray-300 mr-2">Rows per page:</label>
                <select
                  className="bg-gray-700 text-gray-200 px-2 py-1 rounded"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                >
                  {[5, 10, 20, 50].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation */}
        {showDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h2 className="text-xl font-bold mb-4">Delete Booking</h2>
              <p className="mb-6">Are you sure you want to delete booking <span className="font-semibold">{bookingToDelete?.bookingId}</span>?</p>
              <div className="flex justify-center">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={() => setShowDelete(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded font-semibold"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;