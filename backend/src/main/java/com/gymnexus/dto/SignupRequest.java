package com.gymnexus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Public signup is ALWAYS for members — the admin (gym owner) is seeded once
 * on startup and only ever logs in, never signs up. There is no "role" field
 * here on purpose.
 */
@Data
public class SignupRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Plan is required")
    private String plan; // "monthly" | "quarterly" | "yearly"
}
