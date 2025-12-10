import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const HotelList = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const region = searchParams.get("region");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const params = region ? { region } : {};
        const res = await axios.get("http://localhost:9090/api/hotels", {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHotels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to fetch hotels.");
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [region]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading hotels...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {region ? `Hotels in ${region}` : "All Hotels"}
        </h1>
        {hotels.length === 0 ? (
          <p className="text-gray-600">No hotels found in this region.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotels.map((hotel) => (
              <Link 
              key={hotel.hotel.id || hotel.id}
               to={`/hotel/${hotel.id}`} 
               className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="md:flex">
                  <img
                    src={hotel.imageUrl || "https://via.placeholder.com/300x200?text=Hotel+Image"}
                    alt={hotel.name}
                    className="w-full h-48 object-cover md:w-1/2"
                  />
                  <div className="p-4 md:w-1/2">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{hotel.name}</h2>
                    <p className="text-gray-600 mb-2">{hotel.region}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(hotel.amenities || []).map((am, i) => (
                        <span
                          key={i}
                          className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                    <button className="bg-[#00df9a] text-black px-4 py-2 rounded-md font-medium hover:bg-[#00c97a]">
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelList;