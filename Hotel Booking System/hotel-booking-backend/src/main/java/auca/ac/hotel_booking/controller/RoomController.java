package auca.ac.hotel_booking.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import auca.ac.hotel_booking.dto.RoomDTO;
import auca.ac.hotel_booking.model.Room;
import auca.ac.hotel_booking.repository.RoomRepository;
import auca.ac.hotel_booking.service.RoomService;

@RestController
@RequestMapping("/api/hotels/{hotelId}/rooms")
public class RoomController {
    private final RoomService roomService;
    private final RoomRepository roomRepository;

    @Autowired
    public RoomController(RoomService roomService, RoomRepository roomRepository) {
        this.roomService = roomService;
        this.roomRepository = roomRepository;
    }

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRoomsByHotel(@PathVariable Long hotelId) {
        List<Room> rooms = roomService.getRoomsByHotel(hotelId);
        List<RoomDTO> dtos = rooms.stream().map(RoomDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long hotelId, @PathVariable Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(r -> ResponseEntity.ok(new RoomDTO(r)))
                   .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@PathVariable Long hotelId, @RequestBody Room room) {
        Room createdRoom = roomService.createRoom(room, hotelId);
        return createdRoom != null 
            ? new ResponseEntity<>(new RoomDTO(createdRoom), HttpStatus.CREATED)
            : ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long hotelId, @PathVariable Long id, @RequestBody Room updatedRoom) {
        Room room = roomService.updateRoom(id, updatedRoom, hotelId);
        return room != null ? ResponseEntity.ok(new RoomDTO(room)) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long hotelId, @PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadRoomImages(
        @PathVariable("hotelId") Long hotelId,
        @PathVariable("id") Long roomId,
        @RequestParam("files") List<MultipartFile> files) {
        try {
            String uploadDir = "uploads/images";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

            List<String> imagePaths = room.getImages() != null ? room.getImages() : new ArrayList<>();

            for (MultipartFile file : files) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filepath = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
                imagePaths.add("/images/" + filename);
            }

            room.setImages(imagePaths);
            roomRepository.save(room);

            return ResponseEntity.ok("Images uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
}
