package auca.ac.hotel_booking.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import auca.ac.hotel_booking.dto.UserDTO;
import auca.ac.hotel_booking.model.Role;
import auca.ac.hotel_booking.model.User;
import auca.ac.hotel_booking.repository.UserRepository;
import auca.ac.hotel_booking.security.JwtUtil;
import auca.ac.hotel_booking.service.EmailService;
import auca.ac.hotel_booking.service.UserService;
import jakarta.servlet.http.HttpServletResponse;



@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, EmailService emailService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<User> users = userService.getAllUsers(pageable);
    Page<UserDTO> dtoPage = users.map(UserDTO::new);
    return ResponseEntity.ok(dtoPage);
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> body) {
        String fullName = (String) body.get("fullName");
        String username = (String) body.get("username");
        String email = (String) body.get("email");
        String phoneNumber = (String) body.get("phoneNumber");
        String password = (String) body.get("password");

        List<String> rolesList = body.containsKey("roles") && body.get("roles") instanceof List
    ? ((List<?>) body.get("roles")).stream().map(Object::toString).collect(Collectors.toList())
    : List.of("GUEST");
Set<String> rolesStr = rolesList.stream().map(String::toUpperCase).collect(Collectors.toSet());

        Set<Role> roleEnums = new HashSet<>();
        for (String role : rolesStr) {
            if (!role.equals("GUEST") && !role.equals("ADMIN")) {
                return ResponseEntity.badRequest().body("Invalid role: " + role);
            }
            roleEnums.add(Role.valueOf(role));
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already registered.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        String confirmationToken = UUID.randomUUID().toString();
        User user = userService.registerUser(
            username, fullName, email, phoneNumber, password, roleEnums
        );
        user.setConfirmationToken(confirmationToken);
        userService.save(user);

        String link = "http://localhost:9090/api/users/confirm?token=" + confirmationToken;
        String subject = "Welcome to Travella!";
        String text = "Hello " + username + ",\n\nThank you for registering. Please confirm your email address by clicking the link below:\n" + link;

        emailService.sendEmail(email, subject, text);

        return ResponseEntity.ok("Registration successful! Please check your email to confirm your account.");
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");
    Optional<User> userOpt = userService.findByUsername(username);

    if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
        User user = userOpt.get();
        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("Please confirm your email before logging in.");
        }

        // 2FA logic
        String code = String.valueOf((int)(Math.random() * 900000) + 100000);
        user.setTwoFactorSecret(code);
        user.setTwoFactorExpiry(LocalDateTime.now().plusMinutes(10));
        userService.save(user);

        emailService.sendEmail(user.getEmail(), "Your 2FA Code", "Your code is: " + code);

        return ResponseEntity.ok(Collections.singletonMap("message", "2FA code sent to your email."));
    }
    return ResponseEntity.status(401).body("Invalid credentials");
}

    @PostMapping("/verify-2fa")
    public ResponseEntity<?> verify2fa(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String code = body.get("code");
        Optional<User> userOpt = userService.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getTwoFactorSecret() != null
                && user.getTwoFactorSecret().equals(code)
                && user.getTwoFactorExpiry() != null
                && user.getTwoFactorExpiry().isAfter(LocalDateTime.now())) {

                user.setTwoFactorSecret(null);
                user.setTwoFactorExpiry(null);
                userService.save(user);

                String token = jwtUtil.generateToken(
                    username,
                    user.getRoles().stream().map(Role::name).collect(Collectors.toSet())
                );
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", new UserDTO(user));
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid or expired 2FA code");
    }

    @PostMapping("/test-admin-email")
    public ResponseEntity<?> testAdminEmail() {
        Optional<User> adminOpt = userService.findByUsername("admin");
        if (adminOpt.isPresent()) {
            User admin = adminOpt.get();
            emailService.sendEmail(admin.getEmail(), "Test Email", "This is a test email to admin.");
            return ResponseEntity.ok("Test email sent to: " + admin.getEmail());
        }
        return ResponseEntity.status(404).body("Admin user not found");
    }

    @PostMapping("/request-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isPresent()) {
            String resetToken = UUID.randomUUID().toString();
            User user = userOpt.get();
            user.setResetToken(resetToken);
            userService.save(user);

        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
        String emailText = "Click the link below to reset your password:\n" + resetLink;
        emailService.sendEmail(email, "Password Reset", emailText);

            return ResponseEntity.ok("Reset token sent to email.");
        }
        return ResponseEntity.status(404).body("User not found");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        Optional<User> userOpt = userService.findByResetToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            userService.save(user);
            return ResponseEntity.ok("Password reset successful");
        }
        return ResponseEntity.status(400).body("Invalid token");
    }

    @GetMapping("/confirm")
    public void confirmEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        Optional<User> userOpt = userService.findByConfirmationToken(token);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEnabled(true);
            user.setConfirmationToken(null);
            userService.save(user);
            response.sendRedirect("http://localhost:3000/?confirmed=1");
        } else {
            response.sendRedirect("http://localhost:3000/?confirmed=0");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<User> userOpt = userService.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        User user = userOpt.get();
        return ResponseEntity.ok(new UserDTO(user));
    }




}