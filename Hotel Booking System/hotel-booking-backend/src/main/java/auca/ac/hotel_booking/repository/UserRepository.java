package auca.ac.hotel_booking.repository;

import auca.ac.hotel_booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByResetToken(String resetToken);
    Optional<User> findByConfirmationToken(String confirmationToken);
} 
    

