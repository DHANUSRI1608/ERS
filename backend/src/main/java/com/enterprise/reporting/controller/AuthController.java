package com.enterprise.reporting.controller;

import com.enterprise.reporting.model.User;
import com.enterprise.reporting.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private final AuthService authService;

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (authService.validateUser(request.getUsername(), request.getPassword())) {
            User user = authService.getUserByUsername(request.getUsername());
            return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "role", user.getRole().name(),
                "token", "mock-jwt-token-" + user.getUsername() // Simple mock token for now
            ));
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
