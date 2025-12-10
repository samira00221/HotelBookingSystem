import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/hotels", label: "Hotels" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/payments", label: "Payments" },
];

const AdminSidebar = () => (
  <aside className="bg-[#181f2a] min-h-screen w-64 p-6 flex flex-col gap-4 border-r border-gray-800 shadow-xl">
    <div className="text-2xl font-bold text-[#00df9a] mb-8 tracking-wide text-center">
      Admin Panel
    </div>
    <nav className="flex flex-col gap-2">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `block px-5 py-3 rounded-lg font-semibold transition-colors duration-200 text-lg ${
              isActive
                ? "bg-[#00df9a] text-black shadow-md"
                : "text-gray-200 hover:bg-[#101e36] hover:text-[#00df9a]"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;