package auca.ac.hotel_booking.dto;

import java.util.List;

import auca.ac.hotel_booking.model.Room;

public class RoomDTO {
    private Long roomId;
    private String roomNumber;
    private String roomType;
    private int capacity;
    private double pricePerNight;
    private String roomStatus;
    private List<String> images;
    private Long hotelId;

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public String getRoomStatus() {
        return roomStatus;
    }

    public void setRoomStatus(String roomStatus) {
        this.roomStatus = roomStatus;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public RoomDTO(Room room) {
        this.roomId = room.getRoomId();
        this.roomNumber = room.getRoomNumber();
        this.roomType = room.getRoomType() != null ? room.getRoomType().name() : null;
        this.capacity = room.getCapacity();
        this.pricePerNight = room.getPricePerNight();
        this.roomStatus = room.getRoomStatus() != null ? room.getRoomStatus().name() : null;
        this.images = room.getImages();
        this.hotelId = room.getHotel() != null ? room.getHotel().getHotelId() : null;
    }

    // Getters and setters...
}
