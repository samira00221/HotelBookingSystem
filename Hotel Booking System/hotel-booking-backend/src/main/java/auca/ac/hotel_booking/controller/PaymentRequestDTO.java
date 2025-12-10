package auca.ac.hotel_booking.controller;

import java.time.LocalDate;

import auca.ac.hotel_booking.model.PaymentStatus;
import auca.ac.hotel_booking.model.PaymentType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PaymentRequestDTO {

    @NotNull(message = "Booking ID cannot be null")
    private Long bookingId;

    @Min(value = 1, message = "Amount must be greater than 0")
    private double amountPaid;

    @NotNull(message = "Payment method cannot be null")
    private PaymentType paymentMethod; // Use enum type here

    @Size(max = 100, message = "Transaction ID must be at most 100 characters")
    private String transactionId;

    private LocalDate paymentDate;

    private PaymentStatus paymentStatus;

    // Default constructor
    public PaymentRequestDTO() {}

    // All-args constructor
    public PaymentRequestDTO(Long bookingId, double amountPaid, PaymentType paymentMethod, String transactionId, LocalDate paymentDate, PaymentStatus paymentStatus) {
        this.bookingId = bookingId;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paymentDate = paymentDate;
        this.paymentStatus = paymentStatus;
    }

    // Getters
    public Long getBookingId() {
        return bookingId;
    }

    public double getAmountPaid() {
        return amountPaid;
    }

    public PaymentType getPaymentMethod() {
        return paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    // Setters
    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public void setPaymentMethod(PaymentType paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}