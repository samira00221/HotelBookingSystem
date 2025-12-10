import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const API_BASE = "http://localhost:9090/api";

const paymentOptions = [
  { value: "MOBILE_MONEY", label: "Mobile Money" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "PAYPAL", label: "Paypal" },
];

const prettifyRoomType = (type) => {
  if (!type) return "";
  switch (type) {
    case "STANDARD": return "Standard Room";
    case "DOUBLE": return "Double Room";
    case "SUITE": return "Suite";
    default: return type;
  }
};

const amenityIcons = {
  wifi: "📶",
  pool: "🏊",
  gym: "🏋️",
  spa: "💆",
  restaurant: "🍽️",
  bar: "🍸",
  parking: "🅿️",
  ac: "❄️",
  breakfast: "🥐",

};

const ImageSlider = ({ images, height = "h-40" }) => (
  <div className={`w-full ${height} mb-2`}>
    {images && images.length > 0 ? (
      <img
        src={images[0]}
        alt="Room"
        className="w-full object-cover rounded"
        style={{ height: "160px" }}
      />
    ) : (
      <div className="w-full bg-gray-200 flex items-center justify-center rounded" style={{ height: "160px" }}>
        No Image
      </div>
    )}
  </div>
);

const HotelDetails = ({ contactSectionRef, aboutSectionRef }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReservationPopup, setShowReservationPopup] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reservationMessage, setReservationMessage] = useState("");
  const [amenityImages, setAmenityImages] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Date pickers
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  // User ID for guestId
  const [userId, setUserId] = useState(null);

  // Fetch user info to get guestId/userId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserId(res.data.id);
      } catch (err) {
        setUserId(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/hotels/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHotel(res.data);
      } catch (err) {
        setError("Failed to fetch hotel details.");
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const fetchAmenityImages = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/amenity-images/hotel/${id}`);
        setAmenityImages(
          Array.isArray(res.data)
            ? res.data.map((imgPath) => `http://localhost:9090${imgPath}`)
            : []
        );
      } catch (err) {
        setAmenityImages([]);
      }
    };
    fetchAmenityImages();
  }, [id]);

  const getRoomTypeData = () => {
    if (!hotel || !hotel.rooms) return [];
    const types = ["STANDARD", "DOUBLE", "SUITE"];
    return types.map(type => {
      const roomsOfType = hotel.rooms.filter(r => r.roomType === type);
      if (roomsOfType.length === 0) return null;
      const images = roomsOfType.flatMap(r =>
        (r.images && r.images.length > 0)
          ? r.images.map(img => `http://localhost:9090${img}`)
          : []
      );
      const price = roomsOfType[0].pricePerNight || roomsOfType[0].price;
      return {
        type,
        images: images.length > 0 ? images : ["https://via.placeholder.com/200x150?text=Room+Image"],
        price,
        room: roomsOfType[0],
      };
    }).filter(Boolean);
  };

  const handleMakeReservation = (roomTypeObj) => {
    setSelectedRoomType(roomTypeObj);
    setShowReservationPopup(true);
    setPaymentMethod("");
    setCheckInDate(null);
    setCheckOutDate(null);
  };

  const confirmReservation = async () => {
    if (bookingLoading) return; 
    if (!selectedRoomType || !paymentMethod || !checkInDate || !checkOutDate) {
      alert("Please select all booking details.");
      return;
    }
    if (!userId) {
      alert("User information not loaded. Please try again.");
      return;
    }
    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const reservationData = {
        hotelId: hotel.hotelId || hotel.id,
        roomId: selectedRoomType.room.id || selectedRoomType.room.roomId,
        roomType: selectedRoomType.type,
        checkInDate: checkInDate.toISOString().split("T")[0],
        checkOutDate: checkOutDate.toISOString().split("T")[0],
        paymentMethod: paymentMethod,
        guestId: userId,
      };
      await axios.post(`${API_BASE}/bookings`, reservationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowReservationPopup(false);
      setShowPaymentModal(true);
    } catch (err) {
      setReservationMessage("Failed to make reservation. Please try again.");
      setTimeout(() => setReservationMessage(""), 5000);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading hotel details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!hotel) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Hotel not found.</div>;
  }

  const roomTypesData = getRoomTypeData();

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <img
            src={
              hotel.images && hotel.images.length > 0
                ? `http://localhost:9090${hotel.images[0]}`
                : "https://via.placeholder.com/800x400?text=Hotel+Image"
            }
            alt={hotel.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#00df9a] mb-2">{hotel.name}</h1>
            <p className="text-gray-700 mb-4">{hotel.description || "No description available."}</p>
            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {hotel.amenities.map((am, i) => (
                    <span
                      key={i}
                      className="flex items-center bg-[#e0f7fa] text-[#00bfae] px-3 py-1 rounded-full text-sm font-medium"
                    >
                      <span className="mr-2">{amenityIcons[am.toLowerCase()] || "✨"}</span>
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Room Cards */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Rooms</h2>
          {roomTypesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {roomTypesData.map((roomTypeObj) => (
                <div key={roomTypeObj.type} className="bg-[#f9f9f9] rounded-lg shadow p-4 flex flex-col">
                  <ImageSlider images={roomTypeObj.images} />
                  <h3 className="text-lg font-bold text-[#00df9a] mb-1">{prettifyRoomType(roomTypeObj.type)}</h3>
                  <p className="text-gray-600 mb-1">Price: ${roomTypeObj.price}/night</p>
                  <button
                    onClick={() => handleMakeReservation(roomTypeObj)}
                    className="mt-auto bg-[#00df9a] text-black px-3 py-2 rounded font-medium hover:bg-[#00c97a] text-sm"
                  >
                    Make Reservation
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No rooms available at the moment.</p>
          )}
        </div>

        {/* Amenity Images Card */}
        {amenityImages.length > 0 && (
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Hotel Amenity Gallery</h3>
              <ImageSlider images={amenityImages} height="h-40" />
            </div>
          </div>
        )}

        {/* Reservation Popup */}
        {showReservationPopup && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Reservation</h2>
              <div className="mb-2">
                <span className="font-semibold text-gray-700">Room Type: </span>
                {prettifyRoomType(selectedRoomType?.type)}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">Check-in Date:</label>
                <DatePicker
                  selected={checkInDate}
                  onChange={date => {
                    setCheckInDate(date);
                    if (checkOutDate && date && date > checkOutDate) setCheckOutDate(null);
                  }}
                  minDate={new Date()}
                  className="border rounded px-3 py-2 w-full"
                  placeholderText="Select check-in date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-1">Check-out Date:</label>
                <DatePicker
                  selected={checkOutDate}
                  onChange={date => setCheckOutDate(date)}
                  minDate={checkInDate ? new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                  className="border rounded px-3 py-2 w-full"
                  placeholderText="Select check-out date"
                  dateFormat="yyyy-MM-dd"
                  disabled={!checkInDate}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Payment Method:</label>
                <select
                  className="shadow border rounded w-full py-2 px-3 text-gray-700"
                  value={paymentMethod}
                  onChange={e => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  {paymentOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                  onClick={() => setShowReservationPopup(false)}
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#00df9a] text-black px-4 py-2 rounded-md font-medium hover:bg-[#00c97a]"
                  onClick={confirmReservation}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal after reservation */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
              <h2 className="text-2xl font-bold text-[#00df9a] mb-4">Almost Done!</h2>
              <p className="mb-2">Check your email for a payment confirmation link.</p>
              <p className="mb-4 text-gray-600">
                Or check your{" "}
                <span
                  className="font-semibold text-[#00df9a] cursor-pointer underline"
                  onClick={() => navigate("/account")}
                >
                  Account
                </span>{" "}
                for pending payments.
              </p>
              <button
                className="bg-[#00df9a] text-black px-4 py-2 rounded hover:bg-[#00c97a] font-medium"
                onClick={() => setShowPaymentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {reservationMessage && (
          <div className="fixed bottom-4 left-4 bg-green-200 text-green-800 p-4 rounded-md shadow-md z-50">
            {reservationMessage}
          </div>
        )}

        {/* Bottom Section: About and Contact */}
        <div className="w-full bg-gray-100 mt-8 py-6">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row md:justify-between gap-6 px-4">
            {/* Contact Section */}
            <div ref={contactSectionRef} className="md:w-1/2 w-full">
              <h2 className="text-xl font-bold text-[#00df9a] mb-2">Contact Us</h2>
              <p className="mb-2 text-gray-700 text-sm">Have questions? Reach out:</p>
              <div className="flex flex-col items-start space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <FaPhone className="text-[#00df9a] text-lg" />
                  <span className="text-gray-800 font-semibold">+250780000000</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEnvelope className="text-[#00df9a] text-lg" />
                  <span className="text-gray-800 font-semibold">travella@info.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaInstagram className="text-[#00df9a] text-lg" />
                  <span className="text-gray-800 font-semibold">@travella_rw</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTwitter className="text-[#00df9a] text-lg" />
                  <span className="text-gray-800 font-semibold">@travellaRwanda</span>
                </div>
              </div>
            </div>
            {/* About Section */}
            <div ref={aboutSectionRef} className="md:w-1/2 w-full">
              <h2 className="text-xl font-bold text-[#00df9a] mb-2">About Travella</h2>
              <p className="text-gray-700 text-sm">
                Your gateway to the best hotels in Rwanda. Explore top destinations and enjoy seamless booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;