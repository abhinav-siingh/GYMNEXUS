package com.gymnexus.service;

import com.gymnexus.dto.AttendanceResponse;
import com.gymnexus.entity.Attendance;
import com.gymnexus.entity.User;
import com.gymnexus.exception.ResourceNotFoundException;
import com.gymnexus.repository.AttendanceRepository;
import com.gymnexus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;

    /** Idempotent self check-in — calling it again the same day just updates the time. */
    public AttendanceResponse checkIn(Long memberId) {
        User member = userRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        LocalDate today = LocalDate.now();
        Attendance attendance = attendanceRepository.findByMemberIdAndDate(memberId, today)
                .orElse(Attendance.builder().member(member).date(today).build());
        attendance.setCheckInTime(LocalTime.now());
        return toResponse(attendanceRepository.save(attendance), member);
    }

    /** Admin manually marking a member present (e.g. front-desk check-in). */
    public AttendanceResponse markPresent(Long memberId) {
        return checkIn(memberId);
    }

    public List<AttendanceResponse> getHistory(Long memberId) {
        return attendanceRepository.findByMemberIdOrderByDateDesc(memberId).stream()
                .map(a -> toResponse(a, a.getMember()))
                .toList();
    }

    public List<AttendanceResponse> getToday() {
        return attendanceRepository.findByDate(LocalDate.now()).stream()
                .map(a -> toResponse(a, a.getMember()))
                .toList();
    }

    private AttendanceResponse toResponse(Attendance a, User member) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .memberId(member.getId())
                .memberName(member.getName())
                .date(a.getDate())
                .checkInTime(a.getCheckInTime())
                .build();
    }
}
