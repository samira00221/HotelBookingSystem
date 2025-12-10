package auca.ac.hotel_booking.dto;

import java.time.LocalDate;

import auca.ac.hotel_booking.model.Payment;

public class PaymentDTO {
    private Long paymentId;
    private String guestName;
    private String roomNumber;
    private String paymentMethod;
    private Double amountPaid;
    private String transactionId;
    private LocalDate paymentDate;
    private boolean confirmed;
    private String paymentStatus;
    private Long bookingId;

    public PaymentDTO(Payment payment) {
        this.paymentId = payment.getPaymentId();
        this.guestName = payment.getUser() != null ? payment.getUser().getFullName() : "-";
        this.roomNumber = (payment.getBooking() != null && payment.getBooking().getRoom() != null)
                ? payment.getBooking().getRoom().getRoomNumber()
                : "-";
        this.paymentMethod = payment.getPaymentMethod() != null ? payment.getPaymentMethod().name() : null;
        this.amountPaid = payment.getAmountPaid();
        this.transactionId = payment.getTransactionId();
        this.paymentDate = payment.getPaymentDate();
        this.confirmed = payment.isConfirmed();
        this.paymentStatus = payment.getPaymentStatus() != null ? payment.getPaymentStatus().name() : null;
        this.bookingId = payment.getBooking() != null ? payment.getBooking().getBookingId() : null;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public Double getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(double amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
}