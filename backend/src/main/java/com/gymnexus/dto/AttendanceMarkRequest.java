package com.gymnexus.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceMarkRequest {

    @NotNull(message = "memberId is required")
    private Long memberId;
}
