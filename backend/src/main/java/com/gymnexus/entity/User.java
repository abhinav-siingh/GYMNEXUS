package com.gymnexus.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

/**
 * A single table holds both the admin (gym owner) and members, distinguished
 * by role. There is only ever one ADMIN row, seeded on startup — admins never
 * sign up through the public API.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String phone;

    @JsonIgnore
    @Column(nullable = false)
    private String password; // BCrypt-hashed

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private LocalDate joinDate;

    // Trainer currently assigned to this member (nullable — admin assigns it)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer assignedTrainer;
}
