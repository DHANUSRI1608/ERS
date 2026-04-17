package com.ers.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class Dto {

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role;
        private String department;
    }

    @Data @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private Long id;
        private String name;
        private String email;
        private String role;
        private String department;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class SaveReportRequest {
        private String name;
        private String columns;
        private String groupByField;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CreateUserRequest {
        private String name;
        private String email;
        private String password;
        private String role;
        private String department;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class UpdateRoleRequest {
        private String role;
    }

    @Data @AllArgsConstructor
    public static class ApiError {
        private String message;
    }
}