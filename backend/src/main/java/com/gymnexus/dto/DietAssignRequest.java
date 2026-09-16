package com.gymnexus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DietAssignRequest {

    @NotNull(message = "memberId is required")
    private Long memberId;

    private Long trainerId; // optional

    @NotBlank(message = "details is required")
    private String details;
}
