package com.gymnexus.repository;

import com.gymnexus.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByMemberIdOrderByDateDesc(Long memberId);
    Optional<Attendance> findByMemberIdAndDate(Long memberId, LocalDate date);
    List<Attendance> findByDate(LocalDate date);
}
