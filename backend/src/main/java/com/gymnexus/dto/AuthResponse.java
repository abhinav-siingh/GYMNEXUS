package com.gymnexus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role;   // "ADMIN" | "MEMBER"
    private Long id;
    private String name;
}
