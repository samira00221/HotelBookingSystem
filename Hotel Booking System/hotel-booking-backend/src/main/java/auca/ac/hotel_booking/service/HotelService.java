package auca.ac.hotel_booking.service;

import auca.ac.hotel_booking.model.Hotel;
import auca.ac.hotel_booking.model.Region;
import auca.ac.hotel_booking.repository.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
public class HotelService {
    private final HotelRepository hotelRepository;

    @Autowired
    public HotelService(HotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    public Page<Hotel> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable);
    }

    public List<Hotel> searchHotels(Region region, String name) {
        return hotelRepository.searchHotels(region, name);
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel updatedHotel) {
        return hotelRepository.findById(id)
                .map(existingHotel -> {
                    updatedHotel.setHotelId(id);
                    return hotelRepository.save(updatedHotel);
                })
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found for id: " + id));
    }

    public void deleteHotel(Long id) {
        if (!hotelRepository.existsById(id)) {
            throw new IllegalArgumentException("Hotel not found for id: " + id);
        }
        hotelRepository.deleteById(id);
    }
}