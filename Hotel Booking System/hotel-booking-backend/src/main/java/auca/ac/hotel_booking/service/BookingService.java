package auca.ac.hotel_booking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import auca.ac.hotel_booking.model.Booking;
import auca.ac.hotel_booking.model.BookingStatus;
import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.Room;
import auca.ac.hotel_booking.model.User;
import auca.ac.hotel_booking.repository.BookingRepository;
import auca.ac.hotel_booking.repository.HotelRepository;
import auca.ac.hotel_booking.repository.RoomRepository;
import auca.ac.hotel_booking.repository.UserRepository;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    @Autowired
    public BookingService(BookingRepository bookingRepository, UserRepository userRepository, RoomRepository roomRepository, HotelRepository hotelRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
    }
    
    @Transactional(readOnly = true)
    public Page<Booking> getAllBookings(Pageable pageable) {
       return bookingRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public List<Booking> findByUserId(Long userId) {
    return bookingRepository.findByUserId(userId);
    }

    public List<Booking> findTop5ByOrderByBookingDateDesc() {
    return bookingRepository.findTop5ByOrderByBookingDateDesc();
    }
    public List<Booking> findRecentConfirmedArrivals(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    return bookingRepository.findRecentConfirmedArrivals(pageable);
    }

    public Booking createBooking(Long userId, Long roomId, Long hotelId, LocalDate checkInDate, LocalDate checkOutDate) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found for id: " + userId));
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new IllegalArgumentException("Room not found for id: " + roomId));
        Hotel hotel = hotelRepository.findById(hotelId)
            .orElseThrow(() -> new IllegalArgumentException("Hotel not found for id: " + hotelId));

        double totalPrice = room.getPricePerNight() * (checkOutDate.toEpochDay() - checkInDate.toEpochDay());

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setHotel(hotel);
        booking.setCheckInDate(checkInDate);
        booking.setCheckOutDate(checkOutDate);
        booking.setBookingDate(LocalDate.now());
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Long userId, Long roomId, Long hotelId, LocalDate checkInDate, LocalDate checkOutDate) {
        Optional<Booking> existingBooking = bookingRepository.findById(id);

        if (existingBooking.isPresent()) {
            Booking booking = existingBooking.get();

            if (userId != null) {
                userRepository.findById(userId).ifPresent(booking::setUser);
            }
            if (roomId != null) {
                roomRepository.findById(roomId).ifPresent(room -> {
                    booking.setRoom(room);
                    // Recalculate total price if dates are present
                    if (checkInDate != null && checkOutDate != null) {
                        double totalPrice = room.getPricePerNight() * (checkOutDate.toEpochDay() - checkInDate.toEpochDay());
                        booking.setTotalPrice(totalPrice);
                    }
                });
            }
            if (hotelId != null) {
                hotelRepository.findById(hotelId).ifPresent(booking::setHotel);
            }
            if (checkInDate != null) booking.setCheckInDate(checkInDate);
            if (checkOutDate != null) booking.setCheckOutDate(checkOutDate);
    
            return bookingRepository.save(booking);
        }
        return null; // Or throw an exception
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByHotel(Long hotelId, Pageable pageable) {
        return hotelRepository.findById(hotelId)
            .map(hotel -> bookingRepository.findByHotel(hotel, pageable))
            .orElse(Page.empty());
    }

    @Transactional(readOnly = true)
    public Page<Booking> getBookingsByUser(Long userId, Pageable pageable) {
      Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isPresent()) {
        return bookingRepository.findByUser(userOpt.get(), pageable);
    }
    return Page.empty();
}
}