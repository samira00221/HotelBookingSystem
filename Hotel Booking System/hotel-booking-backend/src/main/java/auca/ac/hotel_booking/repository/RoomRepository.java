package auca.ac.hotel_booking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByHotel(Hotel hotel);
    @Query("SELECT (COUNT(r) - SUM(CASE WHEN r.roomStatus = 'AVAILABLE' THEN 1 ELSE 0 END)) * 1.0 / COUNT(r) FROM Room r")
    Double getOccupancyRate();

    @Query("SELECT r.roomStatus, COUNT(r) FROM Room r GROUP BY r.roomStatus")
    List<Object[]> getRoomAvailabilitySummary();
    // You can add custom query methods here if needed
}