package com.gymnexus.repository;

import com.gymnexus.entity.DietTemplate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.Optional;

public interface DietTemplateRepository extends JpaRepository<DietTemplate, Long> {
    Optional<DietTemplate> findByDayOfWeek(DayOfWeek dayOfWeek);
}
