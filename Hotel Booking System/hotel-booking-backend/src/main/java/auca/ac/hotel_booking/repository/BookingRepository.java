package auca.ac.hotel_booking.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import auca.ac.hotel_booking.model.Booking;
import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByHotel(Hotel hotel, Pageable pageable);
    Page<Booking> findByUser(User guest, Pageable pageable);
    @Query("SELECT b FROM Booking b ORDER BY b.checkInDate DESC")
    List<Booking> findRecentArrivals(Pageable pageable); 
    List<Booking> findByUserId(Long userId);
    List<Booking> findTop5ByOrderByBookingDateDesc();
    @Query("SELECT b FROM Booking b WHERE b.bookingStatus = 'CONFIRMED' ORDER BY b.checkInDate DESC")
    List<Booking> findRecentConfirmedArrivals(Pageable pageable);
}