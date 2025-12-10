package auca.ac.hotel_booking.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.Room;
import auca.ac.hotel_booking.repository.HotelRepository;
import auca.ac.hotel_booking.repository.RoomRepository;

@Service
public class RoomService {
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;

    @Autowired
    public RoomService(RoomRepository roomRepository, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    @Transactional // Added for atomicity
    public Room createRoom(Room room, Long hotelId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found with id: " + hotelId));
        room.setHotel(hotel);
        return roomRepository.save(room);
    }

    @Transactional // Added for atomicity
    public Room updateRoom(Long id, Room updatedRoom, Long hotelId) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found with id: " + id));

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hotel not found with id: " + hotelId));

        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setRoomType(updatedRoom.getRoomType());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setPricePerNight(updatedRoom.getPricePerNight());
        existingRoom.setRoomStatus(updatedRoom.getRoomStatus());
        existingRoom.setImages(updatedRoom.getImages());
        existingRoom.setHotel(hotel);
        return roomRepository.save(existingRoom);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public List<Room> getRoomsByHotel(Long hotelId) {
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
        if (hotelOptional.isPresent()) {
            return roomRepository.findByHotel(hotelOptional.get());
        }
        return List.of(); // Or throw an exception
    }
}