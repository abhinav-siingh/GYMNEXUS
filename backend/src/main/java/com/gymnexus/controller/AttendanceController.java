package com.gymnexus.controller;

import com.gymnexus.dto.AttendanceMarkRequest;
import com.gymnexus.dto.AttendanceResponse;
import com.gymnexus.security.JwtUtil;
import com.gymnexus.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private final JwtUtil jwtUtil;

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/checkin")
    public ResponseEntity<AttendanceResponse> checkIn(@RequestHeader("Authorization") String authHeader) {
        Long memberId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(attendanceService.checkIn(memberId));
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/me")
    public ResponseEntity<List<AttendanceResponse>> myHistory(@RequestHeader("Authorization") String authHeader) {
        Long memberId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(attendanceService.getHistory(memberId));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/today")
    public ResponseEntity<List<AttendanceResponse>> today() {
        return ResponseEntity.ok(attendanceService.getToday());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponse> mark(@Valid @RequestBody AttendanceMarkRequest request) {
        return ResponseEntity.ok(attendanceService.markPresent(request.getMemberId()));
    }
}
