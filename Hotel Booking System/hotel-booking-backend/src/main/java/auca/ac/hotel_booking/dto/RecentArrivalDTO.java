package auca.ac.hotel_booking.dto;

public class RecentArrivalDTO {
    private String userFullName;
    private String roomNumber;
    private String hotelName;
    private long nights;
    private double totalAmount;

    public RecentArrivalDTO(String userFullName, String roomNumber, String hotelName, long nights, double totalAmount) {
        this.userFullName = userFullName;
        this.roomNumber = roomNumber;
        this.hotelName = hotelName;
        this.nights = nights;
        this.totalAmount = totalAmount;
    }

    public String getUserFullName() {
        return userFullName;
    }

    public void setUserFullName(String userFullName) {
        this.userFullName = userFullName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public long getNights() {
        return nights;
    }

    public void setNights(long nights) {
        this.nights = nights;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    
}