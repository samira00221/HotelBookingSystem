package auca.ac.hotel_booking.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hotelId;
    private String name;
    private String description;
    private String address;
    private String contactDetails;

    @ElementCollection
    private List<String> amenities = new ArrayList<>();

    @OneToMany(mappedBy = "hotel")
    @JsonIgnore
    private List<AmenityImage> amenityImages;

    @ElementCollection
    private List<String> images = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Region region;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("hotelRooms")
    private List<Room> rooms = new ArrayList<>();

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("hotelBookings")
    private List<Booking> bookings = new ArrayList<>();

    public Hotel() {}

    public Hotel(Long hotelId, String name, String description, String address, String contactDetails, Region region,
                 List<String> amenities, List<String> images, List<Room> rooms, List<User> users, List<Booking> bookings) {
        this.hotelId = hotelId;
        this.name = name;
        this.description = description;
        this.address = address;
        this.contactDetails = contactDetails;
        this.region = region;
        this.amenities = amenities;
        this.images = images;
        this.rooms = rooms;
        this.users = users;
        this.bookings = bookings;
    }

    public Long getHotelId() { return hotelId; }
    public void setHotelId(Long hotelId) { this.hotelId = hotelId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getContactDetails() { return contactDetails; }
    public void setContactDetails(String contactDetails) { this.contactDetails = contactDetails; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public List<Room> getRooms() { return rooms; }
    public void setRooms(List<Room> rooms) { this.rooms = rooms; }

    public List<User> getUsers() { return users; }
    public void setUsers(List<User> users) { this.users = users; }

    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }

    public List<AmenityImage> getAmenityImages() {
        return amenityImages;
    }

    public void setAmenityImages(List<AmenityImage> amenityImages) {
        this.amenityImages = amenityImages;
    }
}