package auca.ac.hotel_booking.model;

public enum RoomType {
    STANDARD("Standard Room"),
    DOUBLE("Double Room"),
    SUITE("Suite");

    private final String displayName;

    RoomType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
