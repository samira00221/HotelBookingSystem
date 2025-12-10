package auca.ac.hotel_booking.dto;

import java.util.List;
import java.util.stream.Collectors;
import auca.ac.hotel_booking.model.Hotel;

public class HotelMapper {
    public static HotelDTO toHotelDTO(Hotel hotel) {
        List<RoomDTO> roomDTOs = hotel.getRooms() != null
            ? hotel.getRooms().stream().map(RoomDTO::new).collect(Collectors.toList())
            : List.of();
        return new HotelDTO(
            hotel.getHotelId(),
            hotel.getName(),
            hotel.getDescription(),
            hotel.getAddress(),
            hotel.getContactDetails(),
            hotel.getRegion() != null ? hotel.getRegion().name() : null,
            hotel.getAmenities(),
            hotel.getImages(),
            roomDTOs
        );
    }
}
