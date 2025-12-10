package auca.ac.hotel_booking.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import auca.ac.hotel_booking.repository.BookingRepository;
import auca.ac.hotel_booking.repository.HotelRepository;
import auca.ac.hotel_booking.repository.PaymentRepository;
import auca.ac.hotel_booking.repository.RoomRepository;
import auca.ac.hotel_booking.repository.UserRepository;

@Service
public class DashboardService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private HotelRepository hotelRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PaymentRepository paymentRepository;
    @Autowired private RoomRepository roomRepository;

    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalBookings", bookingRepository.count());
        summary.put("totalRevenue", paymentRepository.sumAllPayments());
        summary.put("totalGuests", userRepository.count());
        summary.put("hotelsByRegion", hotelRepository.countHotelsByRegion());
        summary.put("occupancyRate", roomRepository.getOccupancyRate());
        summary.put("recentArrivals", bookingRepository.findRecentArrivals(PageRequest.of(0, 5)));
        summary.put("roomAvailability", roomRepository.getRoomAvailabilitySummary());
        // Add more as needed
        return summary;
    }
}