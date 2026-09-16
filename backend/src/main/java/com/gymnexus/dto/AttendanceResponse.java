package com.gymnexus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
public class AttendanceResponse {
    private Long id;
    private Long memberId;
    private String memberName;
    private LocalDate date;
    private LocalTime checkInTime;
}
