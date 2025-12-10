package auca.ac.hotel_booking.controller;

import java.time.LocalDate;

import auca.ac.hotel_booking.model.PaymentType;
import jakarta.validation.constraints.NotNull;

public class BookingRequestDTO {
    @NotNull
    private Long guestId;
    @NotNull
    private Long roomId;
    @NotNull
    private Long hotelId;
    @NotNull
    private LocalDate checkInDate;
    @NotNull
    private LocalDate checkOutDate;
    @NotNull
    private PaymentType paymentMethod;
    private String transactionId;
    


    public Long getGuestId() {
        return guestId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setGuestId(Long guestId) {
        this.guestId = guestId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public PaymentType getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentType paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

}
