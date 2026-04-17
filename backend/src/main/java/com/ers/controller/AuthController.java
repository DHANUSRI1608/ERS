package com.ers.controller;

import com.ers.dto.Dto;
import com.ers.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<Dto.AuthResponse> login(@RequestBody Dto.LoginRequest req,
                                                   HttpServletRequest http) {
        return ResponseEntity.ok(authService.login(req, http.getRemoteAddr()));
    }

    @PostMapping("/register")
    public ResponseEntity<Dto.AuthResponse> register(@RequestBody Dto.RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }
}