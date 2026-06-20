package com.majestic.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type;
    private Long id;
    private String email;
    private String name; // full name
    private String phone; // mobile number
    private List<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}