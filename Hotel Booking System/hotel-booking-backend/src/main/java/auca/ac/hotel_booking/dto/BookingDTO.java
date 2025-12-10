package auca.ac.hotel_booking.dto;

import java.time.LocalDate;

import auca.ac.hotel_booking.model.Booking;

public class BookingDTO {
    private Long bookingId;
    private String guestName;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalDate bookingDate;
    private double totalPrice;
    private String bookingStatus;
    private Long userId;
    private Long roomId;
    private Long hotelId;

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
    

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public BookingDTO(Booking booking) {
        this.bookingId = booking.getBookingId();
         this.guestName = booking.getUser() != null ? booking.getUser().getFullName() : "-";
        this.roomNumber = booking.getRoom() != null ? booking.getRoom().getRoomNumber() : "-";
        this.checkInDate = booking.getCheckInDate();
        this.checkOutDate = booking.getCheckOutDate();
        this.bookingDate = booking.getBookingDate();
        this.totalPrice = booking.getTotalPrice();
        this.bookingStatus = booking.getBookingStatus() != null ? booking.getBookingStatus().name() : null;
        this.userId = booking.getUser() != null ? booking.getUser().getId() : null;
        this.roomId = booking.getRoom() != null ? booking.getRoom().getRoomId() : null;
        this.hotelId = booking.getHotel() != null ? booking.getHotel().getHotelId() : null;
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