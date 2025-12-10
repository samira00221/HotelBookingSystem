import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:9090/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, size]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/users?page=${page}&size=${size}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#181f2a] rounded-xl shadow-xl p-8 border border-gray-800">
      <h1 className="text-3xl font-bold text-[#00df9a] mb-6 text-center">Users</h1>
      {loading ? (
        <div className="text-center text-[#00df9a]">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-inner mb-4">
            <table className="min-w-full bg-[#101e36] rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Username</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Full Name</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-300 uppercase">Roles</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800">
                    <td className="px-4 py-2 text-white">{u.id}</td>
                    <td className="px-4 py-2 text-[#00df9a]">{u.username}</td>
                    <td className="px-4 py-2 text-white">{u.fullName}</td>
                    <td className="px-4 py-2 text-white">{u.email}</td>
                    <td className="px-4 py-2 text-white">{Array.isArray(u.roles) ? u.roles.join(", ") : u.roles}</td>
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
    </div>
  );
};

export default AdminUsers;
