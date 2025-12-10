
package auca.ac.hotel_booking.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import auca.ac.hotel_booking.model.AmenityImage;
import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.repository.AmenityImageRepository;
import auca.ac.hotel_booking.repository.HotelRepository;

@RestController
@RequestMapping("/api/amenity-images")
public class AmenityImageController {
    @Autowired
    private AmenityImageRepository amenityImageRepository;
    @Autowired
    private HotelRepository hotelRepository;

    @PostMapping("/upload/{hotelId}")
    public ResponseEntity<?> uploadAmenityImage(@PathVariable Long hotelId, @RequestParam("file") MultipartFile file) {
        Optional<Hotel> hotelOpt = hotelRepository.findById(hotelId);
        if (hotelOpt.isEmpty()) return ResponseEntity.notFound().build();

        String uploadsDir = "uploads/amenities/";
        File dir = new File(uploadsDir);
        if (!dir.exists()) dir.mkdirs();

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadsDir, filename);
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            AmenityImage img = new AmenityImage();
            img.setHotel(hotelOpt.get());
            img.setImagePath("/amenities/" + filename);
            amenityImageRepository.save(img);
            return ResponseEntity.ok("Image uploaded.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed.");
        }
    }

    @GetMapping("/hotel/{hotelId}")
    public List<AmenityImage> getImagesByHotel(@PathVariable Long hotelId) {
        return amenityImageRepository.findByHotel_HotelId(hotelId);
    }
}