package auca.ac.hotel_booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.Region;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByNameContainingIgnoreCase(String name);

    @Query("SELECT h.region, COUNT(h) FROM Hotel h GROUP BY h.region")
    List<Object[]> countHotelsByRegion();

    @Query("SELECT h FROM Hotel h " +
           "WHERE (:region IS NULL OR h.region = :region) " +
           "AND (:name IS NULL OR LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%')))")
    List<Hotel> searchHotels(@Param("region") Region region, @Param("name") String name);
}
