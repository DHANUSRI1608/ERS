package com.enterprise.reporting.dto;

import com.enterprise.reporting.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Role role;
    private String status; // ACTIVE, INACTIVE
    private LocalDateTime createdAt;
    private String password; // Only used for creation/updates
}
