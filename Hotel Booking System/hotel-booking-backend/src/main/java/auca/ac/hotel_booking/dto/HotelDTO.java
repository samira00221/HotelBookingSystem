package auca.ac.hotel_booking.dto;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.Region;

public class HotelDTO {

    private Long hotelId;
    private String name;
    private String description;
    private String address;
    private String contactDetails;
    private String region;
    private List<String> amenities;
    private List<String> images;
    private List<RoomDTO> rooms;

    public HotelDTO() {}

    public HotelDTO(Hotel hotel) {
        this.hotelId = hotel.getHotelId();
        this.name = hotel.getName();
        this.description = hotel.getDescription();
        this.address = hotel.getAddress();
        this.contactDetails = hotel.getContactDetails();
        this.region = hotel.getRegion() != null ? hotel.getRegion().name() : null;
        this.amenities = hotel.getAmenities();
        this.images = hotel.getImages();
        this.rooms = hotel.getRooms() != null
            ? hotel.getRooms().stream().map(RoomDTO::new).collect(Collectors.toList())
            : List.of();
    }

    public HotelDTO(Long hotelId, String name, String description, String address, String contactDetails,
                    String region, List<String> amenities, List<String> images, List<RoomDTO> rooms) {
        this.hotelId = hotelId;
        this.name = name;
        this.description = description;
        this.address = address;
        this.contactDetails = contactDetails;
        this.region = region;
        this.amenities = amenities;
        this.images = images;
        this.rooms = rooms;
    }

    public Hotel toEntity() {
        Hotel hotel = new Hotel();
        hotel.setHotelId(this.hotelId);
        hotel.setName(this.name);
        hotel.setDescription(this.description);
        hotel.setAddress(this.address);
        hotel.setContactDetails(this.contactDetails);
        hotel.setRegion(this.region != null ? Region.valueOf(this.region) : null);
        hotel.setAmenities(this.amenities);
        hotel.setImages(this.images);
        // Note: rooms are not set here; handle in service if needed
        return hotel;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContactDetails() {
        return contactDetails;
    }

    public void setContactDetails(String contactDetails) {
        this.contactDetails = contactDetails;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public List<String> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<String> amenities) {
        this.amenities = amenities;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public List<RoomDTO> getRooms() {
        return rooms;
    }

    public void setRooms(List<RoomDTO> rooms) {
        this.rooms = rooms;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof HotelDTO)) return false;
        HotelDTO hotelDTO = (HotelDTO) o;
        return Objects.equals(hotelId, hotelDTO.hotelId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(hotelId);
    }
}
    

