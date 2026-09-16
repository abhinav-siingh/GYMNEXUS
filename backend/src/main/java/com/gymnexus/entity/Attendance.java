package com.gymnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * One row = one member present on one date. Absent days simply have no row —
 * this keeps the table small and avoids having to pre-create rows for every
 * member every day.
 */
@Entity
@Table(name = "attendance", uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "date"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime checkInTime;
}
