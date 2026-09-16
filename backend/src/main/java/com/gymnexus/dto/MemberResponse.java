package com.gymnexus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
public class MemberResponse {
    private Long id;
    private String name;
    private String phone;
    private String plan;
    private LocalDate joined;
    private LocalDate end;
    private String status;       // active | expiring | expired
    private Long daysLeft;
    private String trainerName;  // null if none assigned
}
