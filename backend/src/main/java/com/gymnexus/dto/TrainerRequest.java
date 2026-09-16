package com.gymnexus.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TrainerRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Contact is required")
    private String contact;
}
