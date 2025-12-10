import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_BASE = "http://localhost:9090/api";

const AdminDashboard = ({ getUser }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentArrivals, setRecentArrivals] = useState([]);
  const navigate = useNavigate();
  
 useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
        // Fetch recent arrivals separately
        const arrivalsRes = await axios.get(`${API_BASE}/bookings/recentarrivals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentArrivals(Array.isArray(arrivalsRes.data) ? arrivalsRes.data : []);
      } catch (err) {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);
  // Check admin access
  const user = getUser ? getUser() : JSON.parse(localStorage.getItem("user") || "{}");
  if (!user || !user.roles || !user.roles.includes("ADMIN")) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-2xl text-[#00df9a] font-bold">Access Denied: Admins Only</div>
      </div>
    );
  }

 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-[#00df9a] font-bold">Loading dashboard...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-xl text-red-500 font-bold">{error}</div>
      </div>
    );
  }
  if (!summary) return null;

  // Chart Data
  const regionData = {
    labels: Array.isArray(summary.hotelsByRegion) ? summary.hotelsByRegion.map(([region]) => region) : [],
    datasets: [
      {
        label: "Hotels by Region",
        data: Array.isArray(summary.hotelsByRegion) ? summary.hotelsByRegion.map(([_, count]) => count) : [],
        backgroundColor: [
          "#00df9a", "#101e36", "#e0f7fa", "#888", "#222"
        ],
        borderWidth: 1,
      },
    ],
  };

  const roomStatusData = {
    labels: Array.isArray(summary.roomAvailability) ? summary.roomAvailability.map(([status]) => status) : [],
    datasets: [
      {
        label: "Rooms",
        data: Array.isArray(summary.roomAvailability) ? summary.roomAvailability.map(([_, count]) => count) : [],
        backgroundColor: [
          "#00df9a", "#101e36", "#888"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#181f2a] rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col items-center">
            <div className="text-gray-300 text-lg mb-1">Total Bookings</div>
            <div className="text-3xl font-bold text-[#00df9a]">{typeof summary.totalBookings === "number" ? summary.totalBookings.toLocaleString() : "-"}</div>
          </div>
          <div className="bg-[#181f2a] rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col items-center">
            <div className="text-gray-300 text-lg mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-[#00df9a]">{typeof summary.totalRevenue === "number" ? `$${summary.totalRevenue.toLocaleString()}` : "-"}</div>
          </div>
          <div className="bg-[#181f2a] rounded-xl p-6 shadow-lg border border-gray-800 flex flex-col items-center">
            <div className="text-gray-300 text-lg mb-1">Total Guests</div>
            <div className="text-3xl font-bold text-[#00df9a]">{typeof summary.totalGuests === "number" ? summary.totalGuests.toLocaleString() : "-"}</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow border border-gray-200 flex flex-col items-center">
            <div className="text-lg font-semibold text-gray-800 mb-2">Hotels by Region</div>
            <Pie data={regionData} />
          </div>
          <div className="bg-white rounded-xl p-6 shadow border border-gray-200 flex flex-col items-center">
            <div className="text-lg font-semibold text-gray-800 mb-2">Room Availability</div>
            <Bar data={roomStatusData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-[#181f2a] rounded-xl p-6 shadow-lg border border-gray-800 mb-8 flex flex-col items-center">
          <div className="text-gray-300 text-lg mb-1">Occupancy Rate</div>
          <div className="text-4xl font-bold text-[#00df9a] mb-2">
            {(summary.occupancyRate * 100).toFixed(0)}%
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div
              className="bg-[#00df9a] h-4 rounded-full"
              style={{ width: `${summary.occupancyRate * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Recent Arrivals Table */}
        <div className="bg-white rounded-xl p-6 shadow border border-gray-200">
          <div className="text-lg font-semibold text-gray-800 mb-4">Recent Arrivals</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-gray-600">Room</th>
                  <th className="px-4 py-2 text-gray-600">Name</th>
                  <th className="px-4 py-2 text-gray-600">Check In</th>
                  <th className="px-4 py-2 text-gray-600">Check Out</th>
                </tr>
              </thead>
              <tbody>
                {recentArrivals && recentArrivals.length > 0 ? (
                  recentArrivals.map((arr, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-2">{arr.room?.roomNumber || "-"}</td>
                      <td className="px-4 py-2">{arr.guest?.fullName || "-"}</td>
                      <td className="px-4 py-2">{arr.checkInDate}</td>
                      <td className="px-4 py-2">{arr.checkOutDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-gray-400">No recent arrivals</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;