package com.enterprise.reporting.controller;

import com.enterprise.reporting.dto.UserDto;
import com.enterprise.reporting.model.User;
import com.enterprise.reporting.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        if (userRepository.findByUsername(userDto.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        try {
            User user = User.builder()
                .username(userDto.getUsername())
                .password(passwordEncoder.encode(userDto.getPassword()))
                .email(userDto.getEmail())
                .role(userDto.getRole())
                .status("ACTIVE")
                .build();
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(convertToDto(savedUser));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {
        return userRepository.findById(id)
            .map(user -> {
                user.setEmail(userDto.getEmail());
                user.setRole(userDto.getRole());
                user.setStatus(userDto.getStatus());
                if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(userDto.getPassword()));
                }
                User updatedUser = userRepository.save(user);
                return ResponseEntity.ok(convertToDto(updatedUser));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(@RequestBody UserDto userDto) {
        // In a real app, get current user from SecurityContext
        // For this demo, we'll find by username
        return userRepository.findByUsername(userDto.getUsername())
            .map(user -> {
                user.setEmail(userDto.getEmail());
                if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()) {
                    user.setPassword(passwordEncoder.encode(userDto.getPassword()));
                }
                User updatedUser = userRepository.save(user);
                return ResponseEntity.ok(convertToDto(updatedUser));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    private UserDto convertToDto(User user) {
        return UserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole())
            .status(user.getStatus())
            .createdAt(user.getCreatedAt())
            .build();
    }
}
