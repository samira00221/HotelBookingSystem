import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, contactSectionRef, aboutSectionRef }) => {
  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <div className="flex-1 p-8">
        {children}
        {/* About and Contact sections for smooth scroll */}
        <div className="mt-16 mb-8">
          <div ref={aboutSectionRef} className="mb-8">
            <h2 className="text-2xl font-bold text-[#00df9a] mb-2">About Us</h2>
            <p className="text-gray-300">
              Welcome to Travella! We are dedicated to making your hotel booking experience seamless, secure, and enjoyable. Our platform connects you with the best hotels and exclusive deals, ensuring your stay is comfortable and memorable.
            </p>
          </div>
          <div ref={contactSectionRef} className="mb-4">
            <h2 className="text-2xl font-bold text-[#00df9a] mb-2">Contact</h2>
            <p className="text-gray-300">
              Have questions or need support? Reach out to us at <a href="mailto:support@travella.com" className="text-[#00df9a] underline">support@travella.com</a> or call us at <span className="text-[#00df9a]">+1-800-TRAVELLA</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;