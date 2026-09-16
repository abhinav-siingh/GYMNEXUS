package com.gymnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * The EXTRA plan an admin/trainer gives a specific member — on top of the
 * automatic day-wise plan every member gets from DietTemplate.
 */
@Entity
@Table(name = "diet_plans")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DietPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String details;

    @Column(nullable = false)
    private LocalDate allocatedDate;
}
