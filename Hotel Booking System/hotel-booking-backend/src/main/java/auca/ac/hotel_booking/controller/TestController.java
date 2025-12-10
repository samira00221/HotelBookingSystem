package auca.ac.hotel_booking.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import auca.ac.hotel_booking.repository.BookingRepository;
import auca.ac.hotel_booking.repository.HotelRepository;
import auca.ac.hotel_booking.repository.PaymentRepository;
import auca.ac.hotel_booking.repository.RoomRepository; // Assuming you have this
import auca.ac.hotel_booking.repository.UserRepository;

@RestController
@RequestMapping("/admin") // Or a different appropriate path
public class TestController {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final PaymentRepository paymentRepository;

    public TestController(BookingRepository bookingRepository, UserRepository userRepository,
                          HotelRepository hotelRepository, RoomRepository roomRepository,
                          PaymentRepository paymentRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.hotelRepository = hotelRepository;
        this.roomRepository = roomRepository;
        this.paymentRepository = paymentRepository;
    }

    @DeleteMapping("/delete-all-data")
    public ResponseEntity<String> deleteAllData() {
        bookingRepository.deleteAll();
        userRepository.deleteAll();
        roomRepository.deleteAll();
        hotelRepository.deleteAll();
        paymentRepository.deleteAll(); // If you have a payment entity
        return new ResponseEntity<>("All data has been deleted.", HttpStatus.OK);
    }
    // Example: in TestController.java
@DeleteMapping("/delete-all-bookings-payments")
public String deleteAllBookingsAndPayments() {
    bookingRepository.findAll().forEach(b -> b.setPayment(null)); // Remove references
    bookingRepository.saveAll(bookingRepository.findAll());
    paymentRepository.deleteAll();
    bookingRepository.deleteAll();
    return "All bookings and payments deleted.";
}
}
