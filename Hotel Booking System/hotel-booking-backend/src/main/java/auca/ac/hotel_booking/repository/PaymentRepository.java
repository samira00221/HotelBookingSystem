package auca.ac.hotel_booking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import auca.ac.hotel_booking.model.Booking;
import auca.ac.hotel_booking.model.Payment;
import auca.ac.hotel_booking.model.PaymentStatus;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBooking(Booking booking);
    Optional<Payment> findByConfirmationToken(String token);
    List<Payment> findByUser_IdAndPaymentStatus(Long userId, PaymentStatus status);

    @Query("SELECT SUM(p.amountPaid) FROM Payment p WHERE p.paymentStatus = 'PAID'")
    Double sumAllPayments();

    // Add this for recent payment history
    List<Payment> findTop5ByUser_IdOrderByPaymentDateDesc(Long userId);
}
