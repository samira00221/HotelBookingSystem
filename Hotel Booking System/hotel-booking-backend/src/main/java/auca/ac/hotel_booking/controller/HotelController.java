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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import auca.ac.hotel_booking.dto.HotelDTO;
import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.repository.HotelRepository;
import auca.ac.hotel_booking.service.HotelService;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {
    private final HotelService hotelService;
    private final HotelRepository hotelRepository;

    @Autowired
    public HotelController(HotelService hotelService, HotelRepository hotelRepository) {
        this.hotelService = hotelService;
        this.hotelRepository = hotelRepository;
    }

    // Paged endpoint for frontend tables
    @GetMapping
    public ResponseEntity<Page<HotelDTO>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Hotel> hotels = hotelService.getAllHotels(pageable);
        Page<HotelDTO> dtoPage = hotels.map(HotelDTO::new); // HotelDTO must have a constructor: HotelDTO(Hotel hotel)
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HotelDTO> getHotelById(@PathVariable Long id) {
        Optional<Hotel> hotelOpt = hotelService.getHotelById(id);
        return hotelOpt.map(hotel -> ResponseEntity.ok(new HotelDTO(hotel)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<String>> searchHotelNames(@RequestParam("q") String query) {
        List<String> names = hotelRepository.findByNameContainingIgnoreCase(query)
            .stream()
            .map(Hotel::getName)
            .toList();
        return ResponseEntity.ok(names);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO> createHotel(@RequestBody HotelDTO hotelDTO) {
        Hotel hotel = hotelService.createHotel(hotelDTO.toEntity());
        return new ResponseEntity<>(new HotelDTO(hotel), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HotelDTO> updateHotel(@PathVariable Long id, @RequestBody HotelDTO hotelDTO) {
        Hotel updated = hotelService.updateHotel(id, hotelDTO.toEntity());
        return ResponseEntity.ok(new HotelDTO(updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadHotelImages(@PathVariable Long id, @RequestParam("files") List<MultipartFile> files) {
        try {
            String uploadDir = "uploads/images";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            Hotel hotel = hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

            List<String> imagePaths = hotel.getImages() != null ? hotel.getImages() : new ArrayList<>();

            for (MultipartFile file : files) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Path filepath = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), filepath, StandardCopyOption.REPLACE_EXISTING);
                imagePaths.add("/images/" + filename);
            }

            hotel.setImages(imagePaths);
            hotelRepository.save(hotel);

            return ResponseEntity.ok("Images uploaded successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Image upload failed: " + e.getMessage());
        }
    }
}