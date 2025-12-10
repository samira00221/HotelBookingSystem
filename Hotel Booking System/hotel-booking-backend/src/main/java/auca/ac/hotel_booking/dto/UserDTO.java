package auca.ac.hotel_booking.dto;

import java.util.Set;
import java.util.stream.Collectors;

import auca.ac.hotel_booking.model.Role;
import auca.ac.hotel_booking.model.User;

public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Set<String> roles;
    // add other fields as needed

    public void setId(Long id) {
      this.id = id;
    }
    public void setUsername(String username) {
      this.username = username;
    }
    public void setEmail(String email) {
      this.email = email;
    }
    public void setFullName(String fullName) {
      this.fullName = fullName;
    }
    public void setRoles(Set<String> roles) {
      this.roles = roles;
    }
    public UserDTO(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.roles = user.getRoles().stream().map(Role::name).collect(Collectors.toSet());
    }
      // Getters (and setters if needed)
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Set<String> getRoles() { return roles; }
}
