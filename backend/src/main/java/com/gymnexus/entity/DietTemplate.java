package com.gymnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;

/**
 * The automatic day-wise diet every member sees without any admin action.
 * Seeded with defaults on first run; admin can edit them later.
 */
@Entity
@Table(name = "diet_templates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private DayOfWeek dayOfWeek;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;
}
