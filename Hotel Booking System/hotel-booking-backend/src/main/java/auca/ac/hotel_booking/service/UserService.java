package auca.ac.hotel_booking.service;


import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import auca.ac.hotel_booking.model.Role;
import auca.ac.hotel_booking.model.User;
import auca.ac.hotel_booking.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    public Page<User> getAllUsers(Pageable pageable) {
    return userRepository.findAll(pageable);
    }

    public User registerUser(String username, String fullName, String email, String phoneNumber, String password, Set<Role> roles) {
        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber); // Set to null or provide a default value
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(roles);
        user.setEnabled(false); // Set to false initially
        return userRepository.save(user);

    }
   

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
         return userRepository.findByEmail(email);
    }
    public Optional<User> findByPhoneNumber(String phoneNumber) {
    
         return userRepository.findByPhoneNumber(phoneNumber);
    }

    public Optional<User> findByResetToken(String token) {
        return userRepository.findByResetToken(token);
    }

    public Optional<User> findByConfirmationToken(String token) {
    return userRepository.findByConfirmationToken(token);
    }
    public User save(User user) {
        return userRepository.save(user);
    }

}

