package com.gymnexus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class DietPlanResponse {
    private Long id;
    private Long memberId;
    private String memberName;
    private Long trainerId;
    private String trainerName; // null if no trainer specified
    private String details;
    private LocalDate allocatedDate;
}
