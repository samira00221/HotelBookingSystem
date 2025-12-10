package auca.ac.hotel_booking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import auca.ac.hotel_booking.model.Booking;
import auca.ac.hotel_booking.model.Payment;
import auca.ac.hotel_booking.model.PaymentStatus;
import auca.ac.hotel_booking.model.PaymentType;
import auca.ac.hotel_booking.model.Room;
import auca.ac.hotel_booking.model.User;
import auca.ac.hotel_booking.repository.BookingRepository;
import auca.ac.hotel_booking.repository.PaymentRepository;
import auca.ac.hotel_booking.repository.RoomRepository;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;
    private final RoomRepository roomRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository, EmailService emailService, RoomRepository roomRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
        this.roomRepository = roomRepository;
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Page<Payment> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> findRecentPaymentsByUserId(Long userId) {
        return paymentRepository.findTop5ByUser_IdOrderByPaymentDateDesc(userId);
    }

    public Payment createPayment(Long bookingId, double amountPaid, PaymentType paymentMethod, String transactionId, LocalDate paymentDate, PaymentStatus paymentStatus) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            Payment payment = new Payment();
            payment.setBooking(booking);
            payment.setUser(booking.getUser());
            payment.setAmountPaid(amountPaid);
            payment.setPaymentMethod(paymentMethod);

            // Generate transactionId if not provided
            if (transactionId == null || transactionId.isEmpty()) {
                transactionId = UUID.randomUUID().toString();
            }
            payment.setTransactionId(transactionId);

            payment.setPaymentDate(paymentDate);
            payment.setPaymentStatus(paymentStatus);
            payment.setConfirmed(false);

            String token = UUID.randomUUID().toString();
            payment.setConfirmationToken(token);

            paymentRepository.save(payment);

            // Link payment to booking and save booking
            booking.setPayment(payment);
            bookingRepository.save(booking);

            User user = booking.getUser();
            String link = "http://localhost:9090/payments/confirm?token=" + token;
            String subject = "Confirm Your Payment - Travella";
            String text = "Dear " + user.getUsername() + ",\n\n"
                + "Thank you for your payment.\n"
                + "Amount Paid: $" + payment.getAmountPaid() + "\n"
                + "Payment Method: " + payment.getPaymentMethod() + "\n"
                + "Transaction ID: " + payment.getTransactionId() + "\n"
                + "Date: " + payment.getPaymentDate() + "\n"
                + "Booking ID: " + booking.getBookingId() + "\n\n"
                + "Please confirm your payment by clicking the link below:\n" + link + "\n\n"
                + "If you do not confirm, your payment will remain pending.\n\nTravella Team";

            System.out.println("About to send email to: " + user.getEmail());
            try {
                emailService.sendEmail(user.getEmail(), subject, text);
                System.out.println("Email sent to: " + user.getEmail());
            } catch (Exception e) {
                e.printStackTrace();
            }

            return payment;
        }
        throw new IllegalArgumentException("Booking not found for id: " + bookingId);
    }

    public Payment updatePayment(Long id, Long bookingId, double amountPaid, PaymentType paymentMethod, String transactionId, LocalDate paymentDate, PaymentStatus paymentStatus) {
        Optional<Payment> existingPayment = paymentRepository.findById(id);
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (existingPayment.isPresent() && bookingOptional.isPresent()) {
            Payment updatedPayment = existingPayment.get();
            updatedPayment.setBooking(bookingOptional.get());
            updatedPayment.setAmountPaid(amountPaid);
            updatedPayment.setPaymentMethod(paymentMethod);
            updatedPayment.setTransactionId(transactionId);
            updatedPayment.setPaymentDate(paymentDate);
            updatedPayment.setPaymentStatus(paymentStatus);
            updatedPayment.setPaymentId(id);
            return paymentRepository.save(updatedPayment);
        }
        throw new IllegalArgumentException("Payment or Booking not found for update.");
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    public Optional<Payment> getPaymentByBookingId(Long bookingId) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isPresent()) {
            return paymentRepository.findByBooking(bookingOptional.get());
        }
        return Optional.empty();
    }

    public Optional<Payment> findByConfirmationToken(String token) {
        return paymentRepository.findByConfirmationToken(token);
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Payment markPaymentFailed(Long paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setPaymentStatus(PaymentStatus.FAILED);
            return paymentRepository.save(payment);
        }
        throw new IllegalArgumentException("Payment not found for id: " + paymentId);
    }

    public Payment markPaymentRefunded(Long paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setPaymentStatus(PaymentStatus.REFUNDED);
            return paymentRepository.save(payment);
        }
        throw new IllegalArgumentException("Payment not found for id: " + paymentId);
    }

    public void resendConfirmationEmail(Long paymentId) {
        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            Booking booking = payment.getBooking();
            User user = booking.getUser();
            String token = payment.getConfirmationToken();
            if (token == null || token.isEmpty()) {
                token = UUID.randomUUID().toString();
                payment.setConfirmationToken(token);
                payment.setConfirmed(false);
                paymentRepository.save(payment);
            }
            String link = "http://localhost:9090/payments/confirm?token=" + token;
            String subject = "Confirm Your Payment - Travella";
            String text = "Dear " + user.getUsername() + ",\n\n"
                + "Thank you for your payment.\n"
                + "Amount Paid: $" + payment.getAmountPaid() + "\n"
                + "Payment Method: " + payment.getPaymentMethod() + "\n"
                + "Transaction ID: " + payment.getTransactionId() + "\n"
                + "Date: " + payment.getPaymentDate() + "\n"
                + "Booking ID: " + booking.getBookingId() + "\n\n"
                + "Please confirm your payment by clicking the link below:\n" + link + "\n\n"
                + "If you do not confirm, your payment will remain pending.\n\nTravella Team";

            System.out.println("Resending payment confirmation email to: " + user.getEmail());
            emailService.sendEmail(user.getEmail(), subject, text);
        } else {
            throw new IllegalArgumentException("Payment not found for id: " + paymentId);
        }
    }

    public List<Payment> findByUserIdAndStatus(Long userId, PaymentStatus status) {
        return paymentRepository.findByUser_IdAndPaymentStatus(userId, status);
    }

    @Transactional
    public boolean confirmPayment(String token) {
        Optional<Payment> paymentOpt = paymentRepository.findByConfirmationToken(token);
        if (paymentOpt.isPresent()) {
            Payment payment = paymentOpt.get();
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setConfirmed(true);
            paymentRepository.save(payment);

            // Set room as unavailable
            Booking booking = payment.getBooking();
            if (booking != null) {
                Room room = booking.getRoom();
                if (room != null) {
                    room.setAvailable(false);
                    roomRepository.save(room);
                }
            }
            return true;
        }
        return false;
    }
}