package auca.ac.hotel_booking.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import auca.ac.hotel_booking.dto.BookingDTO;
import auca.ac.hotel_booking.dto.RecentArrivalDTO;
import auca.ac.hotel_booking.model.Booking;
import auca.ac.hotel_booking.model.PaymentStatus;
import auca.ac.hotel_booking.service.BookingService;
import auca.ac.hotel_booking.service.PaymentService;
import auca.ac.hotel_booking.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final PaymentService paymentService;
    private final UserService userService;

    @Autowired
    public BookingController(BookingService bookingService, PaymentService paymentService, UserService userService) {
    this.bookingService = bookingService;
    this.paymentService = paymentService;
    this.userService = userService;
    }

    @GetMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<Page<BookingDTO>> getAllBookings(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Booking> bookings = bookingService.getAllBookings(pageable);
    Page<BookingDTO> dtoPage = bookings.map(BookingDTO::new);
    return ResponseEntity.ok(dtoPage);
}

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(b -> ResponseEntity.ok(new BookingDTO(b)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@Valid @RequestBody BookingRequestDTO dto) {
        Booking booking = bookingService.createBooking(
            dto.getGuestId(),
            dto.getRoomId(),
            dto.getHotelId(),
            dto.getCheckInDate(),
            dto.getCheckOutDate()
        );

        if (booking != null) {
            // Always create payment after booking
            paymentService.createPayment(
                booking.getBookingId(),
                booking.getTotalPrice(), // or dto.getAmountPaid() if partial
                dto.getPaymentMethod(),
                dto.getTransactionId(),
                LocalDate.now(),
                PaymentStatus.PENDING
            );
            return new ResponseEntity<>(new BookingDTO(booking), HttpStatus.CREATED);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> updateBooking(
        @PathVariable Long id,
        @Valid @RequestBody BookingRequestDTO dto) {
        Booking updatedBooking = bookingService.updateBooking(
            id,
            dto.getGuestId(),
            dto.getRoomId(),
            dto.getHotelId(),
            dto.getCheckInDate(),
            dto.getCheckOutDate()
        );
        return updatedBooking != null ? ResponseEntity.ok(new BookingDTO(updatedBooking)) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/hotels/{hotelId}")
    public ResponseEntity<Page<BookingDTO>> getBookingsByHotel(@PathVariable Long hotelId, @PageableDefault(size = 10) Pageable pageable) {
        Page<Booking> bookings = bookingService.getBookingsByHotel(hotelId, pageable);
        Page<BookingDTO> dtoPage = bookings.map(BookingDTO::new);
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Page<BookingDTO>> getBookingsByUser(@PathVariable Long userId, @PageableDefault(size = 10) Pageable pageable) {
        Page<Booking> bookings = bookingService.getBookingsByUser(userId, pageable);
        Page<BookingDTO> dtoPage = bookings.map(BookingDTO::new);
        return ResponseEntity.ok(dtoPage);
    }
    @GetMapping("/my")
    public ResponseEntity<List<BookingDTO>> getMyBookings(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal) {
    Optional<auca.ac.hotel_booking.model.User> userOpt = userService.findByUsername(principal.getUsername());
    if (userOpt.isEmpty()) {
        return ResponseEntity.status(401).body(List.of());
    }
    Long userId = userOpt.get().getId();
    List<Booking> bookings = bookingService.findByUserId(userId);
    List<BookingDTO> dtos = bookings.stream().map(BookingDTO::new).collect(Collectors.toList());
    return ResponseEntity.ok(dtos);
    }

    @GetMapping("/recentarrivals")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RecentArrivalDTO>> getRecentArrivals() {
    List<Booking> recentBookings = bookingService.findRecentConfirmedArrivals(5); // Get top 5 confirmed
    List<RecentArrivalDTO> dtos = recentBookings.stream().map(booking -> {
        String userFullName = booking.getUser() != null ? booking.getUser().getFullName() : "";
        String roomNumber = booking.getRoom() != null ? booking.getRoom().getRoomNumber() : "";
        String hotelName = booking.getHotel() != null ? booking.getHotel().getName() : "";
        long nights = java.time.temporal.ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        double totalAmount = booking.getTotalPrice();
        return new RecentArrivalDTO(userFullName, roomNumber, hotelName, nights, totalAmount);
    }).collect(Collectors.toList());
    return ResponseEntity.ok(dtos);
}

}