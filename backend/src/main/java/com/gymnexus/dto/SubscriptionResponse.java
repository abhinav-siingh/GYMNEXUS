package com.gymnexus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private String plan;
    private LocalDate startDate;
    private LocalDate endDate;
}
