package auca.ac.hotel_booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import auca.ac.hotel_booking.model.AmenityImage;

public interface AmenityImageRepository extends JpaRepository<AmenityImage, Long> {
    List<AmenityImage> findByHotel_HotelId(Long hotelId);
}