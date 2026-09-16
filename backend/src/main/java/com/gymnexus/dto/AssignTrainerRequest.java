package com.gymnexus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignTrainerRequest {

    @NotNull(message = "trainerId is required")
    private Long trainerId;
}
