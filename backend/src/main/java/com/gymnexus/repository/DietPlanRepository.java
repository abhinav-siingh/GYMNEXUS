package com.gymnexus.repository;

import com.gymnexus.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    Optional<DietPlan> findTopByMemberIdOrderByAllocatedDateDesc(Long memberId);
}
