import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaBed,
  FaSwimmer,
  FaPhone,
  FaEnvelope,
  FaInstagram,
  FaTwitter
} from "react-icons/fa";
import axios from "axios";
import Navbar from "../components/Navbar";

// Simple slider for hotel images
function HotelImageSlider({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  const prev = (e) => {
    e.stopPropagation();
    setIdx(idx === 0 ? images.length - 1 : idx - 1);
  };
  const next = (e) => {
    e.stopPropagation();
    setIdx(idx === images.length - 1 ? 0 : idx + 1);
  };
  return (
    <div className="relative w-full h-48 mb-3">
      <img
        src={images[idx]}
        alt={`Hotel image ${idx + 1}`}
        className="w-full h-48 object-cover rounded-md"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded-l hover:bg-[#00df9a] text-black"
            aria-label="Previous"
          >
            &#8592;
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 px-2 py-1 rounded-r hover:bg-[#00df9a] text-black"
            aria-label="Next"
          >
            &#8594;
          </button>
        </>
      )}
    </div>
  );
}

const Search = ({ contactSectionRef, aboutSectionRef }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const confirmed = params.get("confirmed");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [availableRegions, setAvailableRegions] = useState([]);
  const [showRoomTypeDropdown, setShowRoomTypeDropdown] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
  const navigate = useNavigate();


  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const prettifyRoomType = (type) => {
    if (!type) return "";
    switch (type) {
      case "STANDARD": return "Standard Room";
      case "DOUBLE": return "Double Room";
      case "SUITE": return "Suite";
      default: return type;
    }
  };

  const iconStyle = "text-[#00df9a] text-2xl mr-2";

 useEffect(() => {
  const fetchAllHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:9090/api/hotels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Handle both paginated and non-paginated responses
      let hotelsData = [];
      if (Array.isArray(res.data)) {
        hotelsData = res.data;
      } else if (res.data && Array.isArray(res.data.content)) {
        hotelsData = res.data.content;
      }
      setAllHotels(hotelsData);
    } catch (err) {
      setError("Failed to fetch hotels.");
      setAllHotels([]);
    } finally {
      setLoading(false);
    }
  };

  fetchAllHotels();
}, []);
  // Update available regions and room types when allHotels change
useEffect(() => {
  if (Array.isArray(allHotels) && allHotels.length > 0) {
    const regions = [...new Set(allHotels.map(hotel => hotel.region))];
    setAvailableRegions(regions);
    const roomTypes = [
      ...new Set(
        allHotels
          .flatMap(hotel => (hotel.rooms || []).map(room => room.roomType))
          .filter(rt => !!rt && rt.trim() !== "")
      ),
    ];
    setAvailableRoomTypes(roomTypes);
  } else {
    setAvailableRegions([]);
    setAvailableRoomTypes([]);
  }
}, [allHotels]);

  // Filtering logic
  useEffect(() => {
    let filtered = [...allHotels];

    // Keyword filter
    if (searchKeyword) {
      const lowerCaseKeyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(hotel => {
        const matchesName = hotel.name && hotel.name.toLowerCase().includes(lowerCaseKeyword);
        const matchesRegion = hotel.region && hotel.region.toLowerCase().includes(lowerCaseKeyword);
        const matchesAmenities = (hotel.amenities || []).some(am =>
          am && am.toLowerCase().includes(lowerCaseKeyword)
        );
        const matchesRooms = (hotel.rooms || []).some(room =>
          room.name && room.name.toLowerCase().includes(lowerCaseKeyword)
        );
        return matchesName || matchesRegion || matchesAmenities || matchesRooms;
      });
    }

    // Region filter
    if (selectedRegion) {
      filtered = filtered.filter(hotel => hotel.region === selectedRegion);
    }

    // Room type filter
    if (selectedRoomType) {
      filtered = filtered.filter(hotel =>
        (hotel.rooms || []).some(room => room.roomType === selectedRoomType)
      );
    }
    setFilteredHotels(filtered);
  }, [allHotels, searchKeyword, selectedRegion, selectedRoomType]);

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const toggleRegionDropdown = () => {
    setShowRegionDropdown(!showRegionDropdown);
    setShowRoomTypeDropdown(false);
  };

  const toggleRoomTypeDropdown = () => {
    setShowRoomTypeDropdown(!showRoomTypeDropdown);
    setShowRegionDropdown(false);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region === selectedRegion ? "" : region);
    setShowRegionDropdown(false);
  };

  const handleRoomTypeSelect = (roomType) => {
    setSelectedRoomType(roomType === selectedRoomType ? "" : roomType);
    setShowRoomTypeDropdown(false);
  };



  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading hotels...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4">
      {confirmed === "1" && (
        <div className="mb-4 w-full max-w-lg mx-auto bg-green-100 text-green-800 px-4 py-3 rounded text-center font-semibold">
          Email confirmed! You can now log in.
        </div>
      )}
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Find Your Perfect Stay</h1>
        <div className="flex items-center mb-3 gap-6">
          <FaMapMarkerAlt className={iconStyle} title="Region" />
          <FaBed className={iconStyle} title="Hotel Name" />
          <FaSwimmer className={iconStyle} title="Amenities" />
        </div>
        {/* Filter Row */}
        <div className="w-full max-w-md flex flex-row items-center relative mb-6">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search hotels..."
            className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-[#00df9a] text-black"
            value={searchKeyword}
            onChange={handleSearchInputChange}
            style={{ minWidth: 0 }}
          />
          {/* Tiny space */}
          <div style={{ width: 3 }} />
          {/* Region Dropdown Button */}
          <div className="relative">
            <button
              className="bg-gray-200 text-gray-700 px-2 py-2 border-l border-gray-300 focus:outline-none"
              style={{ borderRadius: 0 }}
              onClick={toggleRegionDropdown}
              type="button"
            >
              {selectedRegion ? selectedRegion : "Region"}
            </button>
            {showRegionDropdown && (
              <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded shadow-md z-10">
                <div
                  className={`px-3 py-2 text-gray-700 hover:bg-[#00df9a] hover:text-black cursor-pointer ${
                    !selectedRegion ? "bg-[#e0f7fa] text-[#00df9a]" : ""
                  }`}
                  onClick={() => handleRegionSelect("")}
                >
                  All Regions
                </div>
                {availableRegions.map(region => (
                  <div
                    key={region}
                    className={`px-3 py-2 text-gray-700 hover:bg-[#00df9a] hover:text-black cursor-pointer ${
                      selectedRegion === region ? "bg-[#e0f7fa] text-[#00df9a]" : ""
                    }`}
                    onClick={() => handleRegionSelect(region)}
                  >
                    {region}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Tiny space */}
          <div style={{ width: 3 }} />
          {/* Room Type Dropdown Button */}
          <div className="relative">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 border-l border-gray-300 rounded-r-lg focus:outline-none"
              style={{ borderRadius: "0 0.5rem 0.5rem 0", minWidth: 120 }}
              onClick={toggleRoomTypeDropdown}
              type="button"
            >
              {selectedRoomType ? selectedRoomType : "Room Type"}
            </button>
            {showRoomTypeDropdown && (
              <div className="absolute left-0 top-full mt-1 min-w-[140px] bg-white border border-gray-200 rounded shadow-md z-10">
                <div
                  className={`px-3 py-2 text-gray-700 hover:bg-[#00df9a] hover:text-black cursor-pointer whitespace-nowrap ${
                    !selectedRoomType ? "bg-[#e0f7fa] text-[#00df9a]" : ""
                  }`}
                  onClick={() => handleRoomTypeSelect("")}
                >
                  All Room Types
                </div>
                {availableRoomTypes.map(roomType => (
                  <div
                    key={roomType}
                    className={`px-3 py-2 text-gray-700 hover:bg-[#00df9a] hover:text-black cursor-pointer whitespace-nowrap ${
                      selectedRoomType === roomType ? "bg-[#e0f7fa] text-[#00df9a]" : ""
                    }`}
                    onClick={() => handleRoomTypeSelect(roomType)}
                  >
                    {prettifyRoomType(roomType)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Display Hotels */}
      <div className="w-full max-w-5xl mx-auto">
        {filteredHotels.length === 0 ? (
          <div className="text-center text-gray-500 font-semibold">No hotels found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredHotels.map(hotel => (
              <div key={hotel.hotelId} className="bg-[#f9f9f9] rounded-lg shadow p-4 flex flex-col">
                <HotelImageSlider
                  images={
                    hotel.images && hotel.images.length > 0
                      ? hotel.images.map(img => `http://localhost:9090${img}`)
                      : [
                          "https://via.placeholder.com/400x200?text=Hotel+Image",
                          "https://via.placeholder.com/400x200?text=Hotel+Image+2",
                          "https://via.placeholder.com/400x200?text=Hotel+Image+3"
                        ]
                  }
                />
                <h2 className="text-xl font-bold text-[#00df9a] mb-1">{hotel.name}</h2>
                <div className="text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline-block mr-1" />
                  {hotel.region}
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {(hotel.amenities || []).map((am, i) => (
                    <span key={i} className="bg-[#00df9a] text-black px-2 py-1 rounded text-xs font-semibold">
                      {am}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => navigate(`/hotel/${hotel.hotelId}`)}
                  className="mt-auto bg-[#00df9a] text-black px-3 py-2 rounded font-medium hover:bg-[#00c97a] text-sm"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Section: About (right) and Contact (left) */}
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
  );
};

export default Search;